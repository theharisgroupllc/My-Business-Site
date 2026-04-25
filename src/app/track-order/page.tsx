import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Order | Everon Global Trades LLC",
  description: "Track your Everon Global Trades LLC order with your order ID and email address.",
};

export default function TrackOrderPage() {
  return (
    <div className="mx-auto mt-10 max-w-3xl px-4 md:px-6">
      <h1 className="text-3xl font-bold text-brand-navy">Track Order</h1>
      <p className="mt-3 text-sm text-slate-600">Enter your order details below to view shipment and delivery status.</p>
      <form className="mt-6 rounded-xl border border-slate-200 p-6">
        <div className="space-y-3">
          <input placeholder="Order ID" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input type="email" placeholder="Email used at checkout" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <button className="rounded-md bg-brand-teal px-5 py-3 text-sm font-semibold text-white hover:bg-teal-700">Track Shipment</button>
        </div>
      </form>
    </div>
  );
}
