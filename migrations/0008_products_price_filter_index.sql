-- Optional index to speed up public product list filtering by price (safe if already exists).
CREATE INDEX IF NOT EXISTS idx_products_admin_active_price ON products_admin (status, price);
