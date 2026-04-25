import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Everon Global Trades LLC",
  description: "Refund and returns policy for Everon Global Trades LLC.",
};

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto mt-10 max-w-4xl px-4 md:px-6">
      <h1 className="text-3xl font-bold text-brand-navy">Refund Policy</h1>
      <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
        <p>Refund requests can be submitted within 14 days of delivery for eligible items in original condition and packaging.</p>
        <p>Once approved, refunds are processed to the original payment method. Processing timelines depend on your financial institution.</p>
        <p>To start a return or refund claim, contact info@everonglobaltrades.com with your order ID and supporting details.</p>
      </div>
    </div>
  );
}
