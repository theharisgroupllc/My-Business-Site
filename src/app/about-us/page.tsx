import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Everon Global Trades LLC",
  description: "Learn about Everon Global Trades LLC, a registered US-based retail and wholesale distribution company.",
};

export default function AboutUsPage() {
  return (
    <div className="mx-auto mt-10 max-w-4xl px-4 md:px-6">
      <h1 className="text-3xl font-bold text-brand-navy">About Us</h1>
      <p className="mt-4 text-sm leading-7 text-slate-700">
        Everon Global Trades LLC is a registered US-based retail and wholesale distribution company. We specialize in sourcing and delivering
        high-quality products across multiple categories including home essentials, industrial supplies, personal care, and more. Our mission is to
        provide reliable products through trusted supplier networks while maintaining excellence in customer service and logistics.
      </p>
      <p className="mt-4 text-sm leading-7 text-slate-700">
        Our business model focuses on long-term supplier relationships, transparent operations, and scalable fulfillment designed for both end customers
        and B2B partners. Through quality assurance and secure transaction processes, we support confident purchasing at every stage.
      </p>
    </div>
  );
}
