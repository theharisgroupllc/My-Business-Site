"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type ProductRow = {
  id: string;
  name: string;
  category_id: string;
  price: number;
  inventory: number;
  status: string;
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
  type: string;
  value: number;
  active: number;
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

  const addProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = {
      name: String(form.get("name") ?? ""),
      categoryId: String(form.get("categoryId") ?? ""),
      price: Number(form.get("price")),
      inventory: Number(form.get("inventory")),
    };
    const response = await fetch("/api/admin/products", { method: "POST", headers, body: JSON.stringify(body) });
    setMessage(response.ok ? "Product saved." : "Unable to save product.");
    if (response.ok) {
      event.currentTarget.reset();
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

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-brand-navy">Products & Inventory</h2>
            <span className="text-xs text-slate-500">Add, price, stock, archive</span>
          </div>
          <form onSubmit={addProduct} className="mt-4 grid gap-3 md:grid-cols-5">
            <input name="name" required placeholder="Product name" className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2" />
            <input name="categoryId" required placeholder="Category" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <input name="price" required type="number" min="0" step="0.01" placeholder="Price" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <input name="inventory" required type="number" min="0" placeholder="Stock" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <button className="rounded-md bg-brand-navy px-4 py-2 text-sm font-semibold text-white md:col-span-5">Add Product</button>
          </form>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr><th className="p-2">Name</th><th>Category</th><th>Price</th><th>Inventory</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {data.products.map((product) => (
                  <tr key={product.id} className="border-t border-slate-100">
                    <td className="p-2 font-medium text-slate-800">{product.name}</td>
                    <td>{product.category_id}</td>
                    <td>{currency.format(product.price)}</td>
                    <td>{product.inventory}</td>
                    <td>{product.status}</td>
                    <td><button onClick={() => deleteProduct(product.id)} className="text-xs font-semibold text-red-600">Archive</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-brand-navy">Discount Manager</h2>
          <form onSubmit={addDiscount} className="mt-4 grid gap-3 sm:grid-cols-3">
            <input name="code" required placeholder="SAVE10" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <select name="type" className="rounded-md border border-slate-300 px-3 py-2 text-sm">
              <option value="percent">Percent</option>
              <option value="fixed">Fixed</option>
            </select>
            <input name="value" required type="number" min="0" step="0.01" placeholder="Value" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <button className="rounded-md bg-brand-navy px-4 py-2 text-sm font-semibold text-white sm:col-span-3">Create Discount</button>
          </form>
          <div className="mt-4 space-y-2">
            {data.discounts.map((discount) => (
              <div key={discount.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                <span className="font-semibold text-brand-navy">{discount.code}</span>
                <span>{discount.type} - {discount.value}</span>
              </div>
            ))}
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
