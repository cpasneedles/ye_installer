use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CatalogItemsResponse {
    pub items: Vec<Value>,
    #[serde(rename = "dominant_brand")]
    pub dominant_brand: Option<DominantBrand>,
    #[serde(rename = "search_tracking_params")]
    pub search_tracking_params: SearchTrackingParams2,
    pub pagination: Pagination,
    pub code: i64,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchTrackingParams {
    pub score: f64,
    #[serde(rename = "matched_queries")]
    pub matched_queries: Value,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DominantBrand {
    pub id: i64,
    pub title: String,
    pub slug: String,
    #[serde(rename = "favourite_count")]
    pub favourite_count: i64,
    #[serde(rename = "pretty_favourite_count")]
    pub pretty_favourite_count: String,
    #[serde(rename = "item_count")]
    pub item_count: i64,
    #[serde(rename = "pretty_item_count")]
    pub pretty_item_count: String,
    #[serde(rename = "is_visible_in_listings")]
    pub is_visible_in_listings: bool,
    #[serde(rename = "requires_authenticity_check")]
    pub requires_authenticity_check: bool,
    #[serde(rename = "is_luxury")]
    pub is_luxury: bool,
    #[serde(rename = "is_hvf")]
    pub is_hvf: bool,
    pub path: String,
    pub url: String,
    #[serde(rename = "is_favourite")]
    pub is_favourite: bool,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchTrackingParams2 {
    #[serde(rename = "search_correlation_id")]
    pub search_correlation_id: String,
    #[serde(rename = "search_session_id")]
    pub search_session_id: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Pagination {
    #[serde(rename = "current_page")]
    pub current_page: i64,
    #[serde(rename = "total_pages")]
    pub total_pages: i64,
    #[serde(rename = "total_entries")]
    pub total_entries: i64,
    #[serde(rename = "per_page")]
    pub per_page: i64,
    pub time: i64,
}
