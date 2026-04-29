CREATE TABLE IF NOT EXISTS homepage_best_sellers (
  slot INTEGER PRIMARY KEY CHECK (slot >= 0 AND slot <= 7),
  static_product_id TEXT NOT NULL
);

ALTER TABLE products_admin ADD COLUMN gallery_json TEXT;
