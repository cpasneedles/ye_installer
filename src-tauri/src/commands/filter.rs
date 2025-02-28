use tauri::{command, AppHandle, Manager};

use crate::{
    models::{error::Error, filter::Filter},
    vinted::extract_filter,
    Database,
};

#[command]
pub async fn create_filter(
    name: String,
    vinted_search_url: String,
    app: AppHandle,
) -> Result<Option<Filter>, Error> {
    let db: &Database = app.state::<Database>().inner();
    let params = extract_filter(vinted_search_url)?;
    let filter = Filter::new(name, params);
    filter.create(db.client()).await
}

#[command]
pub async fn select_filter_all(app: AppHandle) -> Result<Vec<Filter>, Error> {
    let db = app.state::<Database>().inner();
    Filter::select_all(db.client()).await
}

#[command]
pub async fn select_filter_by_params(
    vinted_search_url: String,
    app: AppHandle,
) -> Result<Vec<Filter>, Error> {
    let db = app.state::<Database>().inner();
    let params = extract_filter(vinted_search_url)?;
    Filter::select_by_params(db.client(), params).await
}

#[command]
pub async fn delete_filter(filter: Filter, app: AppHandle) -> Result<Option<Filter>, Error> {
    let db = app.state::<Database>().inner();
    filter.delete(db.client()).await
}
