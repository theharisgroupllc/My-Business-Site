type Env = {
  ASSETS: Fetcher;
  DB?: D1Database;
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
    const customerName = sanitizeText(body.customerName, 120) || "Verified Customer";
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

  const customerEmail = sanitizeText(body.customerEmail, 180);
  const customerName = sanitizeText(body.customerName, 160) || "Guest Customer";
  const items = Array.isArray(body.items) ? body.items : [];
  const total = Number(body.total);

  if (!customerEmail || items.length === 0 || Number.isNaN(total) || total <= 0) {
    return json({ error: "Customer email, order items, and total are required." }, { status: 400 });
  }

  const id = crypto.randomUUID();
  await db
    .prepare(
      "INSERT INTO orders (id, customer_email, customer_name, items_json, shipping_json, total, status, payment_status, created_at) VALUES (?, ?, ?, ?, ?, ?, 'pending_payment', 'not_configured', datetime('now'))",
    )
    .bind(id, customerEmail, customerName, JSON.stringify(items).slice(0, 8000), "{}", total)
    .run();

  return json({ id, paymentStatus: "pending_payment" }, { status: 201 });
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

async function handleApi(request: Request, env: Env) {
  const url = new URL(request.url);

  try {
    if (url.pathname === "/api/health") {
      return json({ ok: true, database: Boolean(env.DB) });
    }
    if (url.pathname === "/api/reviews") return handleReviews(request, env);
    if (url.pathname === "/api/contact" && request.method === "POST") return handleContact(request, env);
    if (url.pathname === "/api/newsletter" && request.method === "POST") return handleNewsletter(request, env);
    if (url.pathname === "/api/orders" && request.method === "POST") return handleOrders(request, env);
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
