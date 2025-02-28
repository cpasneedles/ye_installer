use crate::{models::error::Error, Database};

use surrealdb::{
    engine::any::{self},
    opt::auth::Root,
};
use tauri::Manager;

pub const NAMESPACE: &str = "kspace";
pub const DATABASE: &str = "kdb";

pub async fn connect_remote(address: &str, password: &str) -> Result<Database, Error> {
    let db = any::connect(format!("wss://{}", address)).await?;

    db.signin(Root {
        username: "admin",
        password,
    })
    .await?;

    db.use_ns("kspace").use_db("kdb").await?;

    let db_version = db.version().await?;

    println!(
        "Remote - NS:{},DB:{},VERSION:{}",
        "kspace", "kdb", db_version
    );

    Ok(Database::Remote(db))
}

pub async fn connect_local(path: &str) -> Result<Database, Error> {
    let db = any::connect(format!("rocksdb:{}", path)).await?;

    db.use_ns(NAMESPACE).use_db(DATABASE).await?;

    let db_version = db.version().await?;
    println!("Local - NS: kspace, DB: kdb, VERSION: {}", db_version);

    Ok(Database::Local(db))
}

pub async fn connect(is_premium: bool, app: &tauri::AppHandle) -> Result<Database, Error> {
    if is_premium {
        let db_endpoint = std::env::var("SURREALDB_ENDPOINT")?;
        let db_pwd = std::env::var("SURREALDB_PWD")?;
        connect_remote(&db_endpoint, &db_pwd).await
    } else {
        connect_local(&format!(
            "{}/kanye_db",
            app.path().app_local_data_dir().unwrap().to_str().unwrap()
        ))
        .await
    }
}
