import Image from "next/image";
import Link from "next/link";
import { SectionTitle } from "@/components/SectionTitle";
import { ProductCard } from "@/components/ProductCard";
import { categories, products } from "@/lib/catalog";

const testimonials = [
  {
    name: "Morgan Lewis",
    company: "Independent Retail Buyer",
    quote: "Everon Global Trades consistently delivers quality products with professional fulfillment and responsive support.",
  },
  {
    name: "Jessica Tran",
    company: "Home Goods Customer",
    quote: "Reliable shipping, secure checkout, and products that match the descriptions. I trust them for recurring purchases.",
  },
  {
    name: "Daniel Brooks",
    company: "Small Business Owner",
    quote: "Their multi-category sourcing helped us expand inventory confidently with dependable supplier-backed products.",
  },
];

const bestSellers = products.slice(0, 8);

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <section className="mt-8 grid items-center gap-8 rounded-2xl bg-gradient-to-r from-brand-navy to-brand-teal p-8 text-white md:grid-cols-2 md:p-12">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-teal-100">Everon Global Trades LLC</p>
          <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">Your Trusted Global Retail Partner</h1>
          <p className="mt-4 max-w-lg text-sm text-slate-100 md:text-base">
            Premium retail and wholesale sourcing across essential categories with secure checkout, dependable delivery, and verified supplier networks.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/shop/art-craft-sewing" className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-brand-navy hover:bg-slate-100">
              Start Shopping
            </Link>
            <Link href="/about-us" className="rounded-md border border-white/70 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Learn More
            </Link>
          </div>
        </div>
        <Image
          src="https://picsum.photos/seed/everon-hero/900/620"
          alt="Warehouse and retail operations"
          width={900}
          height={620}
          className="h-72 w-full rounded-xl object-cover md:h-[340px]"
        />
      </section>

      <section className="mt-14">
        <SectionTitle eyebrow="Shop By Category" title="Featured Categories" subtitle="Explore professionally sourced products across our top retail segments." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 8).map((category) => (
            <Link key={category.id} href={`/shop/${category.id}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md">
              <h3 className="text-base font-semibold text-brand-navy">{category.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionTitle eyebrow="Popular Picks" title="Best Selling Products" subtitle="Trusted products chosen by customers and retail buyers." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-2xl bg-slate-50 p-8">
        <SectionTitle title="Why Choose Us" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {["Fast Shipping", "Quality Products", "Trusted Suppliers", "Secure Payments"].map((item) => (
            <div key={item} className="rounded-lg border border-slate-200 bg-white p-4 text-center text-sm font-medium text-brand-navy">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionTitle title="Trusted by Thousands of Customers" subtitle="What buyers and partners say about their experience with Everon Global Trades LLC." />
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-700">"{testimonial.quote}"</p>
              <p className="mt-4 text-sm font-semibold text-brand-navy">{testimonial.name}</p>
              <p className="text-xs text-slate-500">{testimonial.company}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-2">
        <div className="rounded-lg bg-emerald-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Security Badge</p>
          <p className="mt-1 text-sm font-semibold text-emerald-800">SSL Secured Checkout</p>
          <p className="mt-1 text-xs text-emerald-700">Encrypted transactions and protected customer data.</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">Payments Accepted</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Image src="/assets/payment-visa.svg" alt="Visa" width={72} height={24} />
            <Image src="/assets/payment-mastercard.svg" alt="MasterCard" width={72} height={24} />
            <Image src="/assets/payment-paypal.svg" alt="PayPal" width={72} height={24} />
          </div>
          <p className="mt-2 text-xs text-slate-600">Business registration and supplier verification available.</p>
        </div>
      </section>

      <section className="mt-14 rounded-2xl border border-slate-200 bg-white p-8">
        <SectionTitle title="Stay Updated" subtitle="Get exclusive product launches, supplier updates, and offers directly in your inbox." />
        <form className="flex flex-col gap-3 sm:flex-row">
          <input type="email" placeholder="Enter your email address" className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm outline-none ring-brand-teal focus:ring sm:max-w-md" />
          <button className="rounded-md bg-brand-teal px-5 py-3 text-sm font-semibold text-white hover:bg-teal-700">Subscribe Newsletter</button>
        </form>
      </section>
    </div>
  );
}
