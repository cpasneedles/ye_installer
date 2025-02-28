pub mod commands;
pub mod db;
pub mod models;
pub mod vinted;

use std::time::Duration;
use surrealdb::{engine::any::Any, Surreal};
use tauri::Manager;
use vinted::fetch_cookie;

#[derive(Clone)]
pub enum Database {
    Local(Surreal<Any>),
    Remote(Surreal<Any>),
}

impl Database {
    pub fn client(&self) -> &Surreal<Any> {
        match self {
            Database::Local(db) => db,
            Database::Remote(db) => db,
        }
    }
}

pub mod config {
    pub mod table {
        pub const VINTED_FILTERS: &str = "vinted_filters";
        pub const VINTED_ITEMS: &str = "vinted_items";
        pub const VINTED_ACCOUNTS: &str = "vinted_accounts";
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .setup(|app| {
            let app_handle = app.handle().clone();

            tauri::async_runtime::spawn(async move {
                let is_premium = false;
                let db = db::connect(is_premium, &app_handle).await.unwrap();
                app_handle.manage(db);

                // First, fetch the cookie before any item fetch happens
                println!("🔄 Fetching initial Vinted cookie...");
                loop {
                    match fetch_cookie().await {
                        Ok(()) => {
                            println!("✅ Initial cookie fetched successfully");
                            break;
                        }
                        Err(e) => {
                            eprintln!(
                                "❌ Error fetching initial cookie: {}. Retrying in 10 seconds...",
                                e
                            );
                            tokio::time::sleep(Duration::from_secs(10)).await;
                        }
                    }
                }

                // Now, start periodic cookie refresh
                tokio::spawn(async move {
                    loop {
                        println!("⏳ Sleeping for 40 minutes before refreshing cookies...");
                        tokio::time::sleep(Duration::from_secs(2400)).await;

                        println!("🔄 Fetching Vinted cookies...");
                        match fetch_cookie().await {
                            Ok(()) => println!("✅ Cookie refreshed successfully."),
                            Err(e) => eprintln!("❌ Error refreshing cookie: {}", e),
                        }
                    }
                });

                // Now, start fetching Vinted items
                tokio::spawn(async move {
                    loop {
                        println!("🔄 Fetching Vinted items...");
                        match commands::vinted::fetch_vinted_items(app_handle.clone()).await {
                            Ok(_) => println!("✅ Fetched Vinted items successfully."),
                            Err(e) => eprintln!("❌ Error fetching Vinted items: {:?}", e),
                        };

                        println!("⏳ Sleeping for 5 minutes before next fetch...");
                        tokio::time::sleep(Duration::from_secs(300)).await;
                    }
                });
            });

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::filter::create_filter,
            commands::filter::select_filter_all,
            commands::filter::select_filter_by_params,
            commands::filter::delete_filter
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
