use reqwest::{
    header::{ACCEPT_LANGUAGE, COOKIE, USER_AGENT},
    Client,
};
use serde::de::DeserializeOwned;
use std::sync::{LazyLock, Mutex};

use crate::models::error::Error;

pub static VINTED_DOMAIN: &str = "www.vinted.sk";

// This LazyLock will store the complete cookie string as received from Vinted.
static FULL_COOKIE: LazyLock<Mutex<Option<String>>> = LazyLock::new(|| Mutex::new(None));

/// Fetches the full cookie string from Vinted and stores it in FULL_COOKIE.
pub async fn fetch_cookie() -> Result<(), Error> {
    println!("Fetching cookie...");

    let url = format!("https://{}", VINTED_DOMAIN);
    let res = Client::new()
        .get(&url)
        .header(
            USER_AGENT,
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0",
        )
        .header(ACCEPT_LANGUAGE, "en-US,en;q=0.7")
        .send()
        .await?;

    let headers = res.headers();

    // Collect all set-cookie header values into a vector.
    let cookies: Vec<String> = headers
        .get_all("set-cookie")
        .iter()
        .filter_map(|hv| {
            hv.to_str()
                .ok()
                .map(|s| s.split(';').next().unwrap_or("").to_string())
        })
        .filter(|s| !s.is_empty())
        .collect();

    // Join all cookie strings with "; " to form the final cookie header value.
    let full_cookie = cookies.join("; ");
    // println!("✅ Full Cookie String: {}", full_cookie);

    *FULL_COOKIE.lock().unwrap() = Some(full_cookie);
    Ok(())
}

/// Sends a GET request with the complete cookie string attached, and parses the response.
pub async fn fetch_any<T>(url: &str) -> Result<T, Error>
where
    T: DeserializeOwned,
{
    let cookie = FULL_COOKIE
        .lock()
        .unwrap()
        .clone()
        .ok_or(Error::Custom("No authentication cookies available".into()))?;

    let client = Client::new();

    let res = client
        .get(url)
        .header(
            USER_AGENT,
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0",
        )
        .header(ACCEPT_LANGUAGE, "en-US,en;q=0.7")
        .header(COOKIE, cookie)
        .send()
        .await?;

    let body_bytes = res.bytes().await?;
    let json: Result<T, serde_json::Error> = serde_json::from_slice(&body_bytes);
    Ok(json?)
}

pub fn extract_filter(mut search_url: String) -> Result<String, Error> {
    search_url = search_url.replace(" ", "+");

    search_url
        .split('?')
        .nth(1)
        .map(String::from)
        .ok_or_else(|| {
            Error::Custom(String::from(
                "No query parameters found in the provided URL.",
            ))
        })
}
