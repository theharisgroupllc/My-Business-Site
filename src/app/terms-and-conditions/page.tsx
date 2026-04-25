import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Everon Global Trades LLC",
  description: "Terms and conditions for shopping with Everon Global Trades LLC.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto mt-10 max-w-4xl px-4 md:px-6">
      <h1 className="text-3xl font-bold text-brand-navy">Terms & Conditions</h1>
      <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
        <p>By using everonglobaltrades.com, you agree to our terms regarding product listings, pricing, payment authorization, and shipment timelines.</p>
        <p>All content, branding, and product information are managed by Everon Global Trades LLC and may be updated without prior notice.</p>
        <p>Orders may be reviewed for verification and fraud prevention to protect both customers and supplier operations.</p>
      </div>
    </div>
  );
}
