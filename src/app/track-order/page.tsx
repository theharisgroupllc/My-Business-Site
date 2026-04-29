"use client";

import { FormEvent, useState } from "react";

type OrderTrack = {
  id: string;
  customer_name: string;
  customer_email: string;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
  items_json?: string;
  shipping_json?: string;
};

export default function TrackOrderPage() {
  const [order, setOrder] = useState<OrderTrack | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setOrder(null);
    const form = new FormData(event.currentTarget);
    const id = String(form.get("orderId") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    if (!id || !email) {
      setError("Please enter both order ID and email.");
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({ id, email });
      const response = await fetch(`/api/orders/track?${params.toString()}`);
      const data = (await response.json()) as { order?: OrderTrack; error?: string };
      if (!response.ok) {
        setError(data.error ?? "Unable to look up this order.");
        return;
      }
      if (data.order) setOrder(data.order);
      else setError("Order not found.");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-3xl px-4 md:px-6">
      <h1 className="text-3xl font-bold text-brand-navy">Track Order</h1>
      <p className="mt-3 text-sm text-slate-600">
        Enter the order ID from your confirmation and the email you used at checkout.
      </p>
      <form className="mt-6 rounded-xl border border-slate-200 p-6" onSubmit={onSubmit}>
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="track-order-id">
            Order ID
          </label>
          <input
            id="track-order-id"
            name="orderId"
            placeholder="e.g. uuid from confirmation"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            required
            autoComplete="off"
          />
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="track-email">
            Email
          </label>
          <input
            id="track-email"
            name="email"
            type="email"
            placeholder="Email used at checkout"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            required
            autoComplete="email"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-brand-teal px-5 py-3 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
          >
            {loading ? "Looking up…" : "Track order"}
          </button>
        </div>
      </form>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {order && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm">
          <p className="font-semibold text-brand-navy">Order {order.id}</p>
          <p className="mt-2 text-slate-700">
            <span className="text-slate-500">Placed:</span> {order.created_at}
          </p>
          <p className="mt-1 text-slate-700">
            <span className="text-slate-500">Customer:</span> {order.customer_name} ({order.customer_email})
          </p>
          <p className="mt-1 text-slate-700">
            <span className="text-slate-500">Total:</span> ${Number(order.total).toFixed(2)}
          </p>
          <p className="mt-1 text-slate-700">
            <span className="text-slate-500">Status:</span> {order.status}
          </p>
          <p className="mt-1 text-slate-700">
            <span className="text-slate-500">Payment:</span> {order.payment_status}
          </p>
          <p className="mt-4 text-xs text-slate-500">
            Save your order ID after checkout. Full shipment tracking will appear here once fulfillment is connected.
          </p>
        </div>
      )}
    </div>
  );
}
