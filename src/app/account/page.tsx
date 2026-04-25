import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account | Everon Global Trades LLC",
  description: "Manage your customer account details and order preferences.",
};

export default function AccountPage() {
  return (
    <div className="mx-auto mt-10 max-w-5xl px-4 md:px-6">
      <h1 className="text-3xl font-bold text-brand-navy">My Account</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-brand-navy">Profile Details</h2>
          <div className="mt-3 grid gap-3">
            <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Full name" />
            <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Email address" />
            <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Phone number" />
            <button type="button" className="w-fit rounded-md bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-slate">
              Save Profile
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-brand-navy">Account Security</h2>
          <div className="mt-3 grid gap-3">
            <input type="password" className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Current password" />
            <input type="password" className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="New password" />
            <button type="button" className="w-fit rounded-md border border-brand-navy px-4 py-2 text-sm font-semibold text-brand-navy hover:bg-slate-100">
              Update Password
            </button>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-brand-navy">Recent Orders</h2>
        <p className="mt-2 text-sm text-slate-600">Track and manage your orders through your dashboard.</p>
        <div className="mt-4 rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
          No recent orders yet. Place your first order from our shop to see details here.
        </div>
      </section>
    </div>
  );
}
