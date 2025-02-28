use std::time::{SystemTime, UNIX_EPOCH};

use serde::{Deserialize, Serialize};
use surrealdb::{
    engine::any::Any,
    sql::{Id, Thing},
    Surreal,
};

use crate::{
    config::table::{self, VINTED_FILTERS},
    models::error::Error,
};

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq)]
pub struct Filter {
    pub id: Thing,
    pub name: String,
    pub params: String,
    pub active: bool,
    pub autocop: bool,
    pub updated: u64,
    pub created: u64,
}

impl Filter {
    pub fn new(name: String, params: String) -> Self {
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();

        Self {
            id: Thing::from((table::VINTED_FILTERS, Id::ulid())),
            name,
            params,
            active: true,
            autocop: false,
            updated: now,
            created: now,
        }
    }

    pub async fn create(self, db: &Surreal<Any>) -> Result<Option<Self>, Error> {
        Ok(db
            .create::<Option<Self>>(table::VINTED_FILTERS)
            .content(self)
            .await?)
    }

    pub async fn select_by_params(db: &Surreal<Any>, params: String) -> Result<Vec<Self>, Error> {
        Ok(db
            .query(format!(
                "SELECT * FROM {} WHERE params = $params",
                VINTED_FILTERS
            ))
            .bind(("params", params))
            .await?
            .take::<Vec<Self>>(0)?)
    }

    pub async fn select_all(db: &Surreal<Any>) -> Result<Vec<Self>, Error> {
        Ok(db.select::<Vec<Self>>(VINTED_FILTERS).await?)
    }

    pub async fn update(self, db: &Surreal<Any>) -> Result<Option<Self>, Error> {
        Ok(db
            .update::<Option<Self>>((self.id.tb.clone(), self.id.id.to_raw()))
            .content(self)
            .await?)
    }

    pub async fn delete(self, db: &Surreal<Any>) -> Result<Option<Self>, Error> {
        Ok(db
            .delete::<Option<Self>>((self.id.tb.clone(), self.id.id.to_raw()))
            .await?)
    }
}
