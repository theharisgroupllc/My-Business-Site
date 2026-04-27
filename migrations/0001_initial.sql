CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  rating REAL NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reviews_status_created ON reviews (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_product_status ON reviews (product_id, status);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  phone TEXT,
  total REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_payment',
  payment_provider TEXT,
  payment_status TEXT NOT NULL DEFAULT 'not_configured',
  items_json TEXT NOT NULL,
  shipping_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_email_created ON orders (customer_email, created_at DESC);

CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contact_status_created ON contact_messages (status, created_at DESC);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  email TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
