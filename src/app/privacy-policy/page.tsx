import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Everon Global Trades LLC",
  description: "Privacy policy of Everon Global Trades LLC.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto mt-10 max-w-4xl px-4 md:px-6">
      <h1 className="text-3xl font-bold text-brand-navy">Privacy Policy</h1>
      <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
        <p>Everon Global Trades LLC collects essential customer information to process orders, provide support, and improve service quality.</p>
        <p>We implement secure technologies, SSL encryption, and restricted internal access to protect your personal and transaction data.</p>
        <p>Customer data is never sold. Limited sharing may occur only with payment processors, shipping carriers, and legal authorities when required.</p>
      </div>
    </div>
  );
}
