import Image from "next/image";
import Link from "next/link";
import { SectionTitle } from "@/components/SectionTitle";
import { ReviewCarousel } from "@/components/ReviewCarousel";
import { NewsletterForm } from "@/components/NewsletterForm";
import { HomeBestSellersSection } from "@/components/HomeBestSellersSection";
import { categories } from "@/lib/catalog";

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
            <Link
              href="/shop/art-craft-sewing"
              className="inline-block origin-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-brand-navy transition-[transform,color,background-color] duration-150 ease-out hover:scale-[1.06] hover:bg-slate-100 hover:text-brand-teal"
            >
              Start Shopping
            </Link>
            <Link
              href="/about-us"
              className="inline-block origin-center rounded-md border border-white/70 px-5 py-3 text-sm font-semibold text-white transition-[transform,background-color] duration-150 ease-out hover:scale-[1.06] hover:bg-white/10"
            >
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
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop/${category.id}/`}
              className="group block origin-center rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-[transform,box-shadow,background-color] duration-150 ease-out hover:scale-[1.06] hover:bg-brand-teal/10 hover:shadow-md sm:p-5"
            >
              <h3 className="text-sm font-semibold leading-5 text-brand-navy transition-colors duration-150 group-hover:text-brand-teal sm:text-base">
                {category.name}
              </h3>
              <p className="mt-2 text-xs leading-5 text-slate-600 transition-colors duration-150 group-hover:text-brand-teal sm:text-sm">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionTitle eyebrow="Popular Picks" title="Best Selling Products" subtitle="Trusted products chosen by customers and retail buyers." />
        <HomeBestSellersSection />
      </section>

      <section className="mt-14 rounded-2xl bg-slate-50 p-8">
        <SectionTitle title="Why Choose Us" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {["Fast Shipping", "Quality Products", "Trusted Suppliers", "Secure Payments"].map((item) => (
            <div key={item} className="rounded-lg border border-slate-200 bg-slate-100 p-4 text-center text-sm font-medium text-brand-navy">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionTitle title="Trusted by Thousands of Customers" subtitle="What buyers and partners say about their experience with Everon Global Trades LLC." />
        <ReviewCarousel />
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
        <NewsletterForm />
      </section>
    </div>
  );
}
