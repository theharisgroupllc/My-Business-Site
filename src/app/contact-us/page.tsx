import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Everon Global Trades LLC",
  description: "Reach Everon Global Trades LLC for product inquiries, wholesale support, and customer service.",
};

export default function ContactUsPage() {
  return (
    <div className="mx-auto mt-10 max-w-5xl px-4 md:px-6">
      <h1 className="text-3xl font-bold text-brand-navy">Contact Us</h1>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-brand-navy">Business Contact Details</h2>
          <p className="mt-3 text-sm text-slate-700">Email: info@everonglobaltrades.com</p>
          <p className="text-sm text-slate-700">Phone: +1 214 795 2842</p>
          <p className="mt-3 text-sm text-slate-600">For supplier onboarding, wholesale inquiries, and order support, please use the contact form.</p>
        </div>

        <form className="rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-brand-navy">Send a Message</h2>
          <div className="mt-4 space-y-3">
            <input placeholder="Full name" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <input type="email" placeholder="Email address" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <input placeholder="Phone number" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <textarea placeholder="Your message" rows={5} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <button className="rounded-md bg-brand-navy px-5 py-3 text-sm font-semibold text-white hover:bg-brand-slate">Submit Inquiry</button>
          </div>
        </form>
      </div>
    </div>
  );
}
