use std::time::Duration;
use tauri::{AppHandle, Emitter, Manager};

use crate::{
    models::{error::Error, filter::Filter, vinted::CatalogItemsResponse},
    vinted::fetch_any,
    Database,
};

pub async fn fetch_vinted_items(app: AppHandle) -> Result<(), Error> {
    let db = app.state::<Database>().inner();

    println!("Fetching all filters from database...");
    let filters = Filter::select_all(db.client()).await?;

    for filter in &filters {
        let url = format!(
            "https://www.vinted.sk/api/v2/catalog/items?{}&per_page=96",
            filter.params
        );
        println!("➡️ Requesting: {}", url);

        match fetch_any::<CatalogItemsResponse>(&url).await {
            Ok(response) => {
                if let Err(e) = app.emit("new_vinted_items", response) {
                    println!("⚠️ Error emitting event to frontend: {:?}", e);
                }
            }
            Err(e) => {
                println!("❌ Failed to fetch URL {}: {:?}", url, e);
            }
        }

        println!("⏳ Waiting 3 seconds before next request...");
        tokio::time::sleep(Duration::from_secs(3)).await;
    }

    println!("✅ Finished fetching Vinted items.");
    Ok(())
}
