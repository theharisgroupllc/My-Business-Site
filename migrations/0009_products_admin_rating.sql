-- Customer-visible rating for catalog filtering (defaults to 4.5 for existing rows).
ALTER TABLE products_admin ADD COLUMN rating REAL NOT NULL DEFAULT 4.5 CHECK (rating >= 1 AND rating <= 5);

CREATE INDEX IF NOT EXISTS idx_products_admin_active_rating ON products_admin (status, rating);
