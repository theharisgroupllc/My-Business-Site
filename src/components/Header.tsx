"use client";

import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/catalog";
import { useCart } from "@/components/cart/CartContext";

export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col items-stretch gap-3 px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center md:px-6">
        <Link href="/" className="inline-flex max-w-full items-center self-start">
          <Image src="/assets/logo-everon.svg" alt="Everon Global Trades LLC" width={280} height={46} className="h-10 max-w-full w-auto" priority />
        </Link>

        <nav className="flex w-full min-w-0 flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium sm:flex-1 md:w-auto md:flex-none md:gap-x-5">
          <Link href="/" className="text-slate-700 hover:text-brand-teal">
            Home
          </Link>
          <details className="group relative">
            <summary className="cursor-pointer list-none text-slate-700 hover:text-brand-teal">Shop</summary>
            <div className="absolute left-0 mt-3 grid w-[min(20rem,calc(100vw-2rem))] grid-cols-1 gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-lg sm:grid-cols-2">
              {categories.map((category) => (
                <Link key={category.id} href={`/shop/${category.id}`} className="rounded px-2 py-1 text-xs text-slate-700 hover:bg-slate-100">
                  {category.name}
                </Link>
              ))}
            </div>
          </details>
          <Link href="/about-us" className="text-slate-700 hover:text-brand-teal">
            About Us
          </Link>
          <Link href="/contact-us" className="text-slate-700 hover:text-brand-teal">
            Contact Us
          </Link>
          <Link href="/track-order" className="text-slate-700 hover:text-brand-teal">
            Track Order
          </Link>
        </nav>

        <div className="grid w-full grid-cols-2 items-stretch gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3 lg:ml-auto lg:w-auto lg:flex-nowrap">
          <input
            aria-label="Search products"
            placeholder="Search products..."
            className="col-span-2 min-w-0 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-teal transition focus:ring sm:w-48 md:w-56"
          />
          <Link href="/cart" aria-label="Cart" className="inline-flex min-w-0 items-center justify-center gap-1 rounded-md border border-slate-300 px-3 py-2 text-center text-sm font-medium text-slate-700 hover:border-brand-teal hover:text-brand-teal">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2Zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2ZM7.17 14h9.92c.75 0 1.41-.41 1.75-1.03L22 7H6.21l-.94-2H2v2h2l3.6 7.59-1.35 2.45C5.52 18.37 6.48 20 8 20h12v-2H8l1.17-2Z" />
            </svg>
            Cart ({totalItems})
          </Link>
          <Link href="/account" className="inline-flex min-w-0 items-center justify-center rounded-md bg-brand-navy px-4 py-2 text-center text-sm font-medium text-white hover:bg-brand-slate">Account</Link>
          <Link href="/login" className="col-span-2 inline-flex min-w-0 items-center justify-center rounded-md border border-brand-navy px-4 py-2 text-center text-sm font-medium text-brand-navy hover:bg-slate-100 sm:col-span-1">Login</Link>
        </div>
      </div>
    </header>
  );
}
