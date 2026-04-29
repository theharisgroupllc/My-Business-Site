"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { categories, products as catalogProducts } from "@/lib/catalog";

type ProductRow = {
  id: string;
  slug?: string;
  name: string;
  category_id: string;
  price: number;
  inventory: number;
  status: string;
  image_url?: string | null;
};

type OrderRow = {
  id: string;
  customer_name: string;
  customer_email: string;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
};

type ReviewRow = {
  id: string;
  customer_name: string;
  rating: number;
  body: string;
  status: string;
  created_at: string;
};

type DiscountRow = {
  id: string;
  code: string;
  discount_type?: string;
  type?: string;
  value: number;
  status?: string;
  active?: number;
};

type AdminData = {
  products: ProductRow[];
  orders: OrderRow[];
  reviews: ReviewRow[];
  discounts: DiscountRow[];
  customers: Array<{ customer_email: string; customer_name: string; orders_count: number; lifetime_value: number }>;
  reports: {
    totalOrders: number;
    totalRevenue: number;
    pendingReviews: number;
    activeProducts: number;
    subscribers: number;
  };
};

const emptyData: AdminData = {
  products: [],
  orders: [],
  reviews: [],
  discounts: [],
  customers: [],
  reports: { totalOrders: 0, totalRevenue: 0, pendingReviews: 0, activeProducts: 0, subscribers: 0 },
};

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function AdminDashboard() {
  const [token, setToken] = useState("");
  const [data, setData] = useState<AdminData>(emptyData);
  const [message, setMessage] = useState("Enter your admin token to load secure dashboard data.");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  /** Keeps Select category and quick picker in sync */
  const [productCategoryId, setProductCategoryId] = useState("");
  const [homeSlots, setHomeSlots] = useState<string[]>([]);

  const headers = useMemo(() => ({ "Content-Type": "application/json", "x-admin-token": token }), [token]);

  const loadData = async () => {
    if (!token) {
      setMessage("Admin token is required.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/admin/summary", { headers });
      const payload = (await response.json()) as AdminData | { error?: string };
      if (!response.ok) throw new Error("error" in payload ? payload.error : "Unable to load admin data.");
      setData(payload as AdminData);
      setMessage("Dashboard data loaded.");
      const homeRes = await fetch("/api/admin/home-best-sellers", { headers });
      if (homeRes.ok) {
        const homeJson = (await homeRes.json()) as { slots?: string[] };
        if (homeJson.slots?.length === 8) setHomeSlots([...homeJson.slots]);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = window.localStorage.getItem("everon-admin-token");
    if (saved) setToken(saved);
  }, []);

  const saveToken = () => {
    window.localStorage.setItem("everon-admin-token", token);
    void loadData();
  };

  const imageToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Unable to read image."));
      reader.readAsDataURL(file);
    });

  const addProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const imageFile = form.get("image");
    if (imageFile instanceof File && imageFile.size > 750_000) {
      setMessage("Please upload an image under 750 KB for fast mobile performance.");
      return;
    }
    const imageUrl = imageFile instanceof File && imageFile.size > 0 ? await imageToDataUrl(imageFile) : String(form.get("imageUrl") ?? "");
    const galleryField = form.getAll("gallery");
    const galleryImages: string[] = [];
    for (const entry of galleryField) {
      if (!(entry instanceof File) || entry.size === 0) continue;
      if (entry.size > 750_000) {
        setMessage("Each gallery image must be under 750 KB.");
        return;
      }
      galleryImages.push(await imageToDataUrl(entry));
      if (galleryImages.length >= 7) break;
    }
    const body = {
      name: String(form.get("name") ?? ""),
      categoryId: String(form.get("categoryId") ?? ""),
      price: Number(form.get("price")),
      inventory: Number(form.get("inventory")),
      rating: Number(form.get("rating")),
      description: String(form.get("description") ?? ""),
      imageUrl,
      galleryImages: galleryImages.length ? galleryImages : undefined,
    };
    const response = await fetch("/api/admin/products", { method: "POST", headers, body: JSON.stringify(body) });
    setMessage(response.ok ? "Product saved." : "Unable to save product.");
    if (response.ok) {
      event.currentTarget.reset();
      setProductCategoryId("");
      setImagePreview("");
      await loadData();
    }
  };

  const updateReview = async (id: string, status: "approved" | "rejected") => {
    const response = await fetch(`/api/admin/reviews/${id}`, { method: "PATCH", headers, body: JSON.stringify({ status }) });
    setMessage(response.ok ? `Review ${status}.` : "Unable to update review.");
    if (response.ok) await loadData();
  };

  const addDiscount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = {
      code: String(form.get("code") ?? ""),
      type: String(form.get("type") ?? "percent"),
      value: Number(form.get("value")),
    };
    const response = await fetch("/api/admin/discounts", { method: "POST", headers, body: JSON.stringify(body) });
    setMessage(response.ok ? "Discount saved." : "Unable to save discount.");
    if (response.ok) {
      event.currentTarget.reset();
      await loadData();
    }
  };

  const deleteProduct = async (id: string) => {
    const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE", headers });
    setMessage(response.ok ? "Product archived." : "Unable to archive product.");
    if (response.ok) await loadData();
  };

  const removeProductImage = async (id: string) => {
    const response = await fetch(`/api/admin/products/${id}/image`, { method: "DELETE", headers });
    setMessage(response.ok ? "Product image removed." : "Unable to remove product image.");
    if (response.ok) await loadData();
  };

  return (
    <div className="mx-auto mt-10 max-w-7xl px-4 md:px-6">
      <div className="rounded-2xl bg-gradient-to-r from-brand-navy to-brand-teal p-6 text-white md:p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-teal-100">Secure Operations</p>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">Everon Admin Dashboard</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-100">
          Manage products, inventory, orders, customers, reviews, reports, and discount operations from one protected workspace.
        </p>
      </div>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="admin-token">
          Admin access token
        </label>
        <div className="mt-2 grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <input
            id="admin-token"
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="Enter Cloudflare Worker admin token"
            className="min-w-0 rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <button onClick={saveToken} className="rounded-md bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-slate">
            Save & Load
          </button>
          <button onClick={loadData} className="rounded-md border border-brand-navy px-4 py-2 text-sm font-semibold text-brand-navy hover:bg-slate-50">
            Refresh
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">{loading ? "Loading..." : message}</p>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ["Orders", data.reports.totalOrders],
          ["Revenue", currency.format(data.reports.totalRevenue)],
          ["Pending Reviews", data.reports.pendingReviews],
          ["Products", data.reports.activeProducts],
          ["Subscribers", data.reports.subscribers],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-bold text-brand-navy">{value}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-brand-navy">Homepage — Best Selling Products (templates)</h2>
        <p className="mt-1 text-xs text-slate-500">
          Eight slots shown on the homepage before live D1 products. Each slot is a catalog product ID. Save applies all slots; Reset restores one slot to its default.
        </p>
        {homeSlots.length === 8 ? (
          <div className="mt-4 space-y-2">
            {homeSlots.map((slotId, slot) => (
              <div key={slot} className="flex flex-wrap items-center gap-2">
                <span className="w-8 text-xs font-semibold text-slate-500">{slot + 1}</span>
                <select
                  value={slotId}
                  onChange={(e) => {
                    const next = [...homeSlots];
                    next[slot] = e.target.value;
                    setHomeSlots(next);
                  }}
                  className="min-w-0 flex-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                >
                  {catalogProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
                  onClick={async () => {
                    const response = await fetch(`/api/admin/home-best-sellers/slot/${slot}`, { method: "DELETE", headers });
                    setMessage(response.ok ? `Slot ${slot + 1} reset to default.` : "Unable to reset slot.");
                    if (response.ok) {
                      const j = (await response.json()) as { static_product_id?: string };
                      if (j.static_product_id) {
                        const next = [...homeSlots];
                        next[slot] = j.static_product_id;
                        setHomeSlots(next);
                      }
                    }
                  }}
                >
                  Reset
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-3 rounded-md bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-slate"
              onClick={async () => {
                const response = await fetch("/api/admin/home-best-sellers", {
                  method: "PUT",
                  headers,
                  body: JSON.stringify({ slots: homeSlots }),
                });
                setMessage(response.ok ? "Homepage best sellers saved." : "Unable to save homepage slots.");
              }}
            >
              Save homepage slots
            </button>
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-500">Load dashboard with a valid token to edit slots (requires DB migration 0006–0007).</p>
        )}
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-brand-navy">Products & Inventory</h2>
            <span className="text-xs text-slate-500">Add, price, stock, archive</span>
          </div>
          <form onSubmit={addProduct} data-product-form="true" className="mt-4 grid gap-3 md:grid-cols-12">
            <input
              name="name"
              required
              placeholder="Product name"
              className="min-w-0 rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-3"
            />
            <div className="relative min-w-0 md:col-span-3">
              <select
                name="categoryId"
                required
                value={productCategoryId}
                onChange={(event) => setProductCategoryId(event.target.value)}
                className="h-11 min-h-[44px] w-full cursor-pointer appearance-none rounded-md border border-slate-300 bg-white py-2 pl-3 pr-11 text-left text-sm leading-snug text-slate-900 shadow-sm outline-none transition focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/25 sm:h-10 sm:min-h-0"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <span
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                aria-hidden
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
            <input
              name="price"
              required
              type="number"
              min="0"
              step="0.01"
              placeholder="Price"
              className="min-w-0 rounded-md border border-slate-300 px-3 py-2 text-sm tabular-nums md:col-span-2"
            />
            <input
              name="inventory"
              required
              type="number"
              min="0"
              placeholder="Stock"
              className="min-w-0 rounded-md border border-slate-300 px-3 py-2 text-sm tabular-nums md:col-span-2"
            />
            <input
              name="rating"
              type="number"
              min="1"
              max="5"
              step="0.1"
              defaultValue={4.5}
              placeholder="Rating (1–5)"
              title="Customer-facing rating for filters"
              className="min-w-0 rounded-md border border-slate-300 px-3 py-2 text-sm tabular-nums md:col-span-2"
            />
            <input
              name="imageUrl"
              placeholder="Image URL (optional)"
              className="min-w-0 rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-6"
            />
            <textarea
              name="description"
              placeholder="Short product description"
              rows={3}
              className="min-w-0 rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-6"
            />
            <div className="md:col-span-12">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Category quick picker</p>
              <p className="mt-0.5 text-xs text-slate-500">Tap a category to fill the select above.</p>
              <div className="mt-2 flex max-h-[7.5rem] flex-wrap gap-2 overflow-y-auto overscroll-contain rounded-lg border border-slate-200 bg-slate-50 p-2 sm:max-h-32">
                {categories.map((category) => {
                  const active = productCategoryId === category.id;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setProductCategoryId(category.id)}
                      className={
                        active
                          ? "rounded-full border border-brand-teal bg-teal-50 px-3 py-1.5 text-left text-xs font-semibold text-brand-navy shadow-sm ring-1 ring-brand-teal/30"
                          : "rounded-full border border-slate-200 bg-white px-3 py-1.5 text-left text-xs font-medium text-slate-700 hover:border-brand-teal/60 hover:text-brand-navy"
                      }
                    >
                      {category.name}
                    </button>
                  );
                })}
              </div>
            </div>
            <label className="rounded-md border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-600 md:col-span-6">
              Upload product image (primary)
              <input
                name="image"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="mt-2 block w-full text-xs"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) {
                    setImagePreview("");
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = () => setImagePreview(String(reader.result));
                  reader.readAsDataURL(file);
                }}
              />
            </label>
            <label className="rounded-md border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-600 md:col-span-6">
              Additional images (up to 7, optional)
              <input name="gallery" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" multiple className="mt-2 block w-full text-xs" />
            </label>
            {imagePreview && (
              <div className="rounded-lg border border-slate-200 p-2 md:col-span-12">
                <img src={imagePreview} alt="Product preview" className="h-32 w-full rounded-md object-cover" />
              </div>
            )}
            <button className="rounded-md bg-brand-navy px-4 py-2 text-sm font-semibold text-white md:col-span-12">Add Product Live</button>
          </form>
          <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full min-w-[860px] table-fixed text-left text-sm">
              <colgroup>
                <col className="w-24" />
                <col className="w-[28%]" />
                <col className="w-[22%]" />
                <col className="w-[12%]" />
                <col className="w-[12%]" />
                <col className="w-[10%]" />
                <col className="w-[16%]" />
              </colgroup>
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-3">Image</th>
                  <th className="px-3 py-3">Name</th>
                  <th className="px-3 py-3">Category</th>
                  <th className="px-3 py-3 text-right">Price</th>
                  <th className="px-3 py-3 text-right">Inventory</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.products.map((product) => (
                  <tr key={product.id} className="align-top">
                    <td className="px-3 py-3">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="h-12 w-16 rounded object-cover" />
                      ) : (
                        <span className="text-xs text-slate-400">No image</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <p className="line-clamp-2 font-medium text-slate-800">{product.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{product.slug ?? "No slug"}</p>
                    </td>
                    <td className="px-3 py-3 text-slate-700">{product.category_id}</td>
                    <td className="px-3 py-3 text-right font-medium text-slate-900">{currency.format(product.price)}</td>
                    <td className="px-3 py-3 text-right font-medium text-slate-900">{product.inventory}</td>
                    <td className="px-3 py-3">
                      <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{product.status}</span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-3 whitespace-nowrap">
                        <button onClick={() => removeProductImage(product.id)} className="text-xs font-semibold text-amber-600 hover:text-amber-700">
                          Remove image
                        </button>
                        <button onClick={() => deleteProduct(product.id)} className="text-xs font-semibold text-red-600 hover:text-red-700">
                          Archive
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold leading-tight text-brand-navy whitespace-nowrap">Discount Manager</h2>
          <p className="mt-1.5 text-xs leading-snug text-slate-500">Codes apply at checkout once connected</p>
          <form onSubmit={addDiscount} className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="discount-code" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Discount code
              </label>
              <input
                id="discount-code"
                name="code"
                required
                placeholder="e.g. SAVE10"
                autoComplete="off"
                className="h-11 min-h-[44px] w-full min-w-0 rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/25 sm:h-10 sm:min-h-0"
              />
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <label htmlFor="discount-type" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Type
              </label>
              <div className="relative">
                <select
                  id="discount-type"
                  name="type"
                  className="h-11 min-h-[44px] w-full cursor-pointer appearance-none rounded-md border border-slate-300 bg-white py-2 pl-3 pr-11 text-sm leading-snug text-slate-900 shadow-sm outline-none transition focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/25 sm:h-10 sm:min-h-0"
                >
                  <option value="percent">Percent (%)</option>
                  <option value="fixed">Fixed amount ($)</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <label htmlFor="discount-value" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Value
              </label>
              <input
                id="discount-value"
                name="value"
                required
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="h-11 min-h-[44px] w-full min-w-0 rounded-md border border-slate-300 px-3 py-2 text-sm tabular-nums shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/25 sm:h-10 sm:min-h-0"
              />
            </div>
            <button
              type="submit"
              className="h-11 min-h-[44px] w-full rounded-md bg-brand-navy px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-slate sm:h-10 sm:min-h-0"
            >
              Create discount
            </button>
          </form>
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Active Codes</p>
            <div className="mt-2 max-h-[min(18rem,50vh)] divide-y divide-slate-200 overflow-y-auto overscroll-contain rounded-lg border border-slate-200 bg-slate-50/80">
              {data.discounts.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-slate-500">No discounts yet.</p>
              ) : (
                data.discounts.map((discount) => (
                  <div
                    key={discount.id}
                    className="flex min-h-[3rem] flex-col justify-center gap-0.5 px-3 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                  >
                    <span className="font-semibold tabular-nums text-brand-navy">{discount.code}</span>
                    <span className="text-slate-600">
                      <span className="font-medium text-slate-700">{discount.discount_type ?? discount.type}</span>
                      <span className="mx-1 text-slate-400">·</span>
                      <span className="tabular-nums">{discount.value}</span>
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-brand-navy">Orders</h2>
          <div className="mt-4 space-y-3">
            {data.orders.map((order) => (
              <div key={order.id} className="rounded-lg border border-slate-100 p-3 text-sm">
                <div className="flex flex-wrap justify-between gap-2">
                  <strong className="text-brand-navy">{order.customer_name}</strong>
                  <span>{currency.format(order.total)} - {order.payment_status}</span>
                </div>
                <p className="text-slate-500">{order.customer_email}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-brand-navy">Review Approval</h2>
          <div className="mt-4 space-y-3">
            {data.reviews.map((review) => (
              <div key={review.id} className="rounded-lg border border-slate-100 p-3 text-sm">
                <div className="flex flex-wrap justify-between gap-2">
                  <strong className="text-brand-navy">{review.customer_name}</strong>
                  <span>{review.rating} stars - {review.status}</span>
                </div>
                <p className="mt-2 text-slate-600">{review.body}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => updateReview(review.id, "approved")} className="rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">Approve</button>
                  <button onClick={() => updateReview(review.id, "rejected")} className="rounded bg-red-600 px-3 py-1 text-xs font-semibold text-white">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-brand-navy">Customer Insights</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {data.customers.map((customer) => (
            <div key={customer.customer_email} className="rounded-lg bg-slate-50 p-3 text-sm">
              <p className="font-semibold text-brand-navy">{customer.customer_name}</p>
              <p className="text-slate-500">{customer.customer_email}</p>
              <p className="mt-1 text-slate-700">{customer.orders_count} orders - {currency.format(customer.lifetime_value)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
