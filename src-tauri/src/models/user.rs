use std::time::{SystemTime, UNIX_EPOCH};

use serde::{Deserialize, Serialize};
use surrealdb::sql::{Id, Thing};

#[derive(Serialize, Deserialize)]
pub struct User {
    pub id: Thing,
    pub name: String,
    pub password: String,
    pub last_login: Option<u64>,
    pub updated: u64,
    pub created: u64,
}

impl User {
    pub fn new(name: String, password: String) -> Self {
        let id = Thing::from(("users", Id::ulid()));
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();

        Self {
            id,
            name,
            password,
            last_login: None,
            updated: now,
            created: now,
        }
    }
}
