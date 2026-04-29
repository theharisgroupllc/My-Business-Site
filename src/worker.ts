type Env = {
  ASSETS: Fetcher;
  DB?: D1Database;
  ADMIN_TOKEN?: string;
};

type ApiResponse = Record<string, unknown> | Array<Record<string, unknown>>;

const fallbackReviews = [
  {
    id: "fallback-1",
    customer_name: "Morgan Lewis",
    company: "Independent Retail Buyer",
    rating: 4.8,
    quote: "Everon Global Trades consistently delivers quality products with professional fulfillment and responsive support.",
    status: "approved",
  },
  {
    id: "fallback-2",
    customer_name: "Jessica Tran",
    company: "Home Goods Customer",
    rating: 4.6,
    quote: "Reliable shipping, secure checkout, and products that match the descriptions. I trust them for recurring purchases.",
    status: "approved",
  },
  {
    id: "fallback-3",
    customer_name: "Daniel Brooks",
    company: "Small Business Owner",
    rating: 4.4,
    quote: "Their multi-category sourcing helped us expand inventory confidently with dependable supplier-backed products.",
    status: "approved",
  },
];

const json = (body: ApiResponse, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...init.headers,
    },
  });

const getBody = async (request: Request) => {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const sanitizeText = (value: unknown, maxLength: number) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

const getSession = (request: Request) => {
  const header = request.headers.get("x-everon-session")?.trim();
  if (header === "authenticated") return "authenticated";
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(/(?:^|;\s*)everon_session=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
};

const requireDb = (env: Env) => {
  if (!env.DB) {
    throw new Error("D1 database is not bound yet.");
  }
  return env.DB;
};

const requireAdmin = (request: Request, env: Env) => {
  const token = request.headers.get("x-admin-token") ?? "";
  if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
    return false;
  }
  return true;
};

const toNumber = (value: unknown, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

async function handleReviews(request: Request, env: Env) {
  if (request.method === "GET") {
    if (!env.DB) {
      return json({ reviews: fallbackReviews, database: false });
    }
    const db = env.DB;
    const { results } = await db
      .prepare(
        "SELECT id, product_id, customer_name, 'Verified Customer' AS company, rating, body AS quote, status, created_at FROM reviews WHERE status = 'approved' ORDER BY created_at DESC LIMIT 50",
      )
      .all();
    return json({ reviews: results ?? [] });
  }

  if (request.method === "POST") {
    const db = requireDb(env);
    const session = getSession(request);
    if (!session) {
      return json({ error: "Authentication required to submit reviews." }, { status: 401 });
    }

    const body = await getBody(request);
    if (!body) return json({ error: "Invalid JSON payload." }, { status: 400 });

    const productId = sanitizeText(body.productId, 80);
    const customerName = sanitizeText(body.customerName ?? body.name, 120) || "Verified Customer";
    const quote = sanitizeText(body.quote, 800);
    const rating = Number(body.rating);

    if (!quote || Number.isNaN(rating) || rating < 1 || rating > 5) {
      return json({ error: "A review quote and rating from 1 to 5 are required." }, { status: 400 });
    }

    const id = crypto.randomUUID();
    await db
      .prepare(
        "INSERT INTO reviews (id, product_id, customer_name, rating, body, status, created_at) VALUES (?, ?, ?, ?, ?, 'pending', datetime('now'))",
      )
      .bind(id, productId || null, customerName, rating, quote)
      .run();

    return json({ id, status: "pending", message: "Review submitted for moderation." }, { status: 201 });
  }

  return json({ error: "Method not allowed." }, { status: 405 });
}

async function handleContact(request: Request, env: Env) {
  const db = requireDb(env);
  const body = await getBody(request);
  if (!body) return json({ error: "Invalid JSON payload." }, { status: 400 });

  const fullName = sanitizeText(body.fullName, 160);
  const email = sanitizeText(body.email, 180);
  const phone = sanitizeText(body.phone, 60);
  const message = sanitizeText(body.message, 1200);

  if (!fullName || !email || !message) {
    return json({ error: "Name, email, and message are required." }, { status: 400 });
  }

  const id = crypto.randomUUID();
  await db
    .prepare(
      "INSERT INTO contact_messages (id, name, email, phone, message, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))",
    )
    .bind(id, fullName, email, phone || null, message)
    .run();

  return json({ id, message: "Inquiry received." }, { status: 201 });
}

async function handleNewsletter(request: Request, env: Env) {
  const db = requireDb(env);
  const body = await getBody(request);
  const email = sanitizeText(body?.email, 180);
  if (!email) return json({ error: "Email is required." }, { status: 400 });

  await db
    .prepare("INSERT OR IGNORE INTO newsletter_subscribers (email, created_at) VALUES (?, datetime('now'))")
    .bind(email)
    .run();

  return json({ message: "Subscription saved." }, { status: 201 });
}

async function handleOrders(request: Request, env: Env) {
  const db = requireDb(env);
  const body = await getBody(request);
  if (!body) return json({ error: "Invalid JSON payload." }, { status: 400 });

  const customerBlock = body.customer && typeof body.customer === "object" ? (body.customer as Record<string, unknown>) : null;
  const customerEmail = sanitizeText(body.customerEmail ?? customerBlock?.email, 180);
  const first = sanitizeText(customerBlock?.firstName, 80);
  const last = sanitizeText(customerBlock?.lastName, 80);
  const customerName =
    sanitizeText(body.customerName, 160) || [first, last].filter(Boolean).join(" ").trim() || "Guest Customer";

  const items = Array.isArray(body.items) ? body.items : [];
  const total = Number(body.total);

  if (!customerEmail || items.length === 0 || Number.isNaN(total) || total <= 0) {
    return json({ error: "Customer email, order items, and total are required." }, { status: 400 });
  }

  const shipping = customerBlock
    ? {
        firstName: first,
        lastName: last,
        address: sanitizeText(customerBlock.address, 240),
        city: sanitizeText(customerBlock.city, 120),
        state: sanitizeText(customerBlock.state, 80),
        postalCode: sanitizeText(customerBlock.postalCode, 40),
        phone: sanitizeText(customerBlock.phone, 60),
      }
    : {};
  const phone = sanitizeText(customerBlock?.phone, 60) || null;
  const shippingJson = JSON.stringify(shipping).slice(0, 8000);

  const id = crypto.randomUUID();
  await db
    .prepare(
      "INSERT INTO orders (id, customer_email, customer_name, phone, items_json, shipping_json, total, status, payment_status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending_payment', 'not_configured', datetime('now'))",
    )
    .bind(id, customerEmail, customerName, phone, JSON.stringify(items).slice(0, 8000), shippingJson, total)
    .run();

  return json({ id, paymentStatus: "pending_payment" }, { status: 201 });
}

async function handleOrderTrack(request: Request, env: Env) {
  const db = requireDb(env);
  const url = new URL(request.url);
  const id = sanitizeText(url.searchParams.get("id"), 80);
  const email = sanitizeText(url.searchParams.get("email"), 180);
  if (!id || !email) {
    return json({ error: "Order id and email are required." }, { status: 400 });
  }
  const row = await db
    .prepare(
      "SELECT id, customer_name, customer_email, total, status, payment_status, items_json, shipping_json, created_at FROM orders WHERE id = ? AND lower(customer_email) = lower(?)",
    )
    .bind(id, email)
    .first<Record<string, unknown>>();
  if (!row) {
    return json({ error: "No order found for this id and email." }, { status: 404 });
  }
  return json({ order: row });
}

async function handleProducts(request: Request, env: Env) {
  if (!env.DB) return json({ products: [], database: false });
  const url = new URL(request.url);
  const categoryFilter = sanitizeText(url.searchParams.get("category"), 120);
  if (categoryFilter) {
    const { results } = await env.DB
      .prepare(
        "SELECT id, slug, name, category_id, price, inventory, description, image_url FROM products_admin WHERE status = 'active' AND category_id = ? ORDER BY updated_at DESC LIMIT 300",
      )
      .bind(categoryFilter)
      .all();
    return json({ products: results ?? [], database: true });
  }
  const { results } = await env.DB
    .prepare(
      "SELECT id, slug, name, category_id, price, inventory, description, image_url FROM products_admin WHERE status = 'active' ORDER BY updated_at DESC LIMIT 300",
    )
    .all();
  return json({ products: results ?? [], database: true });
}

function handleCheckoutSession() {
  return json(
    {
      status: "credentials_required",
      message: "Payment provider credentials are not configured yet. Add Stripe or PayPal secrets before enabling live checkout.",
    },
    { status: 503 },
  );
}

async function handleAdmin(request: Request, env: Env) {
  if (!requireAdmin(request, env)) {
    return json({ error: "Admin authentication required." }, { status: 401 });
  }
  const db = requireDb(env);
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === "/api/admin/summary") {
    const [ordersAgg, pendingReviews, contacts, subscribers, activeProducts, productsList, ordersList, reviewsList, discountsList, customersList] =
      await Promise.all([
        db.prepare("SELECT COUNT(*) AS count, COALESCE(SUM(total), 0) AS total FROM orders").first(),
        db.prepare("SELECT COUNT(*) AS count FROM reviews WHERE status = 'pending'").first(),
        db.prepare("SELECT COUNT(*) AS count FROM contact_messages WHERE status = 'new'").first(),
        db.prepare("SELECT COUNT(*) AS count FROM newsletter_subscribers").first(),
        db.prepare("SELECT COUNT(*) AS count FROM products_admin WHERE status = 'active'").first(),
        db.prepare("SELECT * FROM products_admin ORDER BY updated_at DESC LIMIT 200").all(),
        db.prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT 200").all(),
        db.prepare("SELECT * FROM reviews ORDER BY created_at DESC LIMIT 200").all(),
        db.prepare("SELECT * FROM discounts ORDER BY updated_at DESC LIMIT 100").all(),
        db
          .prepare(
            "SELECT customer_email, MAX(customer_name) AS customer_name, COUNT(*) AS orders_count, COALESCE(SUM(total), 0) AS lifetime_value, MAX(created_at) AS last_order_at FROM orders GROUP BY customer_email ORDER BY last_order_at DESC LIMIT 200",
          )
          .all(),
      ]);

    const orderCount = Number((ordersAgg as { count?: number })?.count ?? 0);
    const revenue = Number((ordersAgg as { total?: number })?.total ?? 0);
    const pendingCount = Number((pendingReviews as { count?: number })?.count ?? 0);
    const activeCount = Number((activeProducts as { count?: number })?.count ?? 0);
    const subscriberCount = Number((subscribers as { count?: number })?.count ?? 0);

    return json({
      reports: {
        totalOrders: orderCount,
        totalRevenue: revenue,
        pendingReviews: pendingCount,
        activeProducts: activeCount,
        subscribers: subscriberCount,
      },
      products: productsList.results ?? [],
      orders: ordersList.results ?? [],
      reviews: reviewsList.results ?? [],
      discounts: discountsList.results ?? [],
      customers: customersList.results ?? [],
    });
  }

  if (path === "/api/admin/products") {
    if (request.method === "GET") {
      const { results } = await db.prepare("SELECT * FROM products_admin ORDER BY updated_at DESC LIMIT 200").all();
      return json({ products: results ?? [] });
    }
    if (request.method === "POST") {
      const body = await getBody(request);
      if (!body) return json({ error: "Invalid JSON payload." }, { status: 400 });
      const id = sanitizeText(body.id, 120) || crypto.randomUUID();
      const name = sanitizeText(body.name, 180);
      const categoryId = sanitizeText(body.categoryId, 120);
      const description = sanitizeText(body.description, 1200);
      const imageUrl = sanitizeText(body.imageUrl, 300000);
      const price = toNumber(body.price);
      const inventory = Math.max(0, Math.floor(toNumber(body.inventory)));
      if (!name || !categoryId || price <= 0) {
        return json({ error: "Product name, category, and price are required." }, { status: 400 });
      }
      await db
        .prepare(
          "INSERT INTO products_admin (id, slug, name, category_id, price, inventory, description, image_url, status, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', datetime('now')) ON CONFLICT(id) DO UPDATE SET name = excluded.name, category_id = excluded.category_id, price = excluded.price, inventory = excluded.inventory, description = excluded.description, image_url = excluded.image_url, updated_at = datetime('now')",
        )
        .bind(id, id, name, categoryId, price, inventory, description || null, imageUrl || null)
        .run();
      return json({ id, message: "Product saved." }, { status: 201 });
    }
  }

  if (path.startsWith("/api/admin/products/") && path.endsWith("/image") && request.method === "DELETE") {
    const id = decodeURIComponent(path.split("/").at(-2) ?? "");
    await db.prepare("UPDATE products_admin SET image_url = NULL, updated_at = datetime('now') WHERE id = ?").bind(id).run();
    return json({ message: "Product image removed." });
  }

  if (path.startsWith("/api/admin/products/") && request.method === "DELETE") {
    const id = decodeURIComponent(path.split("/").pop() ?? "");
    await db.prepare("UPDATE products_admin SET status = 'archived', updated_at = datetime('now') WHERE id = ?").bind(id).run();
    return json({ message: "Product archived." });
  }

  if (path === "/api/admin/orders") {
    const { results } = await db.prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT 200").all();
    return json({ orders: results ?? [] });
  }

  if (path === "/api/admin/customers") {
    const { results } = await db
      .prepare(
        "SELECT customer_email, MAX(customer_name) AS customer_name, COUNT(*) AS order_count, COALESCE(SUM(total), 0) AS lifetime_value, MAX(created_at) AS last_order_at FROM orders GROUP BY customer_email ORDER BY last_order_at DESC LIMIT 200",
      )
      .all();
    return json({ customers: results ?? [] });
  }

  if (path === "/api/admin/reviews") {
    const { results } = await db.prepare("SELECT * FROM reviews ORDER BY created_at DESC LIMIT 200").all();
    return json({ reviews: results ?? [] });
  }

  if (path.startsWith("/api/admin/reviews/") && request.method === "PATCH") {
    const segments = path.split("/").filter(Boolean);
    const id = decodeURIComponent(segments[3] ?? "");
    if (!id) return json({ error: "Review id required." }, { status: 400 });

    let status = "";
    if (request.headers.get("content-type")?.includes("application/json")) {
      const body = await getBody(request);
      const raw = sanitizeText(body?.status, 20).toLowerCase();
      if (raw === "approved" || raw === "rejected") status = raw;
    }
    if (!status) {
      const action = segments[4];
      status = action === "approve" ? "approved" : action === "reject" ? "rejected" : "";
    }
    if (!status) return json({ error: "Invalid review action. Use status approved|rejected or /approve /reject." }, { status: 400 });
    await db.prepare("UPDATE reviews SET status = ? WHERE id = ?").bind(status, id).run();
    return json({ id, status });
  }

  if (path === "/api/admin/discounts") {
    if (request.method === "GET") {
      const { results } = await db.prepare("SELECT * FROM discounts ORDER BY updated_at DESC LIMIT 100").all();
      return json({ discounts: results ?? [] });
    }
    if (request.method === "POST") {
      const body = await getBody(request);
      if (!body) return json({ error: "Invalid JSON payload." }, { status: 400 });
      const code = sanitizeText(body.code, 40).toUpperCase();
      const type = sanitizeText(body.type, 20) || "percent";
      const value = toNumber(body.value);
      if (!code || value <= 0) return json({ error: "Discount code and value are required." }, { status: 400 });
      await db
        .prepare(
          "INSERT INTO discounts (id, code, discount_type, value, status, updated_at) VALUES (?, ?, ?, ?, 'active', datetime('now')) ON CONFLICT(code) DO UPDATE SET discount_type = excluded.discount_type, value = excluded.value, status = 'active', updated_at = datetime('now')",
        )
        .bind(code, code, type, value)
        .run();
      return json({ code, message: "Discount saved." }, { status: 201 });
    }
  }

  if (path === "/api/admin/reports") {
    const { results } = await db
      .prepare(
        "SELECT date(created_at) AS day, COUNT(*) AS orders, COALESCE(SUM(total), 0) AS revenue FROM orders GROUP BY date(created_at) ORDER BY day DESC LIMIT 30",
      )
      .all();
    return json({ dailySales: results ?? [] });
  }

  return json({ error: "Admin endpoint not found." }, { status: 404 });
}

async function handleApi(request: Request, env: Env) {
  const url = new URL(request.url);

  if (url.pathname === "/api/reviews" && request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, POST, OPTIONS",
        "access-control-allow-headers": "content-type, x-everon-session",
        "access-control-max-age": "86400",
      },
    });
  }

  try {
    if (url.pathname === "/api/health") {
      return json({ ok: true, database: Boolean(env.DB) });
    }
    if (url.pathname.startsWith("/api/admin/")) return await handleAdmin(request, env);
    if (url.pathname === "/api/products" && request.method === "GET") return await handleProducts(request, env);
    if (url.pathname === "/api/reviews") return await handleReviews(request, env);
    if (url.pathname === "/api/contact" && request.method === "POST") return await handleContact(request, env);
    if (url.pathname === "/api/newsletter" && request.method === "POST") return await handleNewsletter(request, env);
    if (url.pathname === "/api/orders/track" && request.method === "GET") return await handleOrderTrack(request, env);
    if (url.pathname === "/api/orders" && request.method === "POST") return await handleOrders(request, env);
    if (url.pathname === "/api/checkout/status" && request.method === "GET") return handleCheckoutSession();
    if (url.pathname === "/api/checkout/session" && request.method === "POST") return handleCheckoutSession();
  } catch (error) {
    return json(
      {
        error: error instanceof Error ? error.message : "Unexpected API error.",
      },
      { status: error instanceof Error && error.message.includes("D1") ? 503 : 500 },
    );
  }

  return json({ error: "API endpoint not found." }, { status: 404 });
}

export default {
  fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      return handleApi(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
