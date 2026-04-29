"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { categories } from "@/lib/catalog";
import { useCart } from "@/components/cart/CartContext";
import { HeaderSearch } from "@/components/HeaderSearch";
import { usePathname } from "next/navigation";

export function Header() {
  const { totalItems } = useCart();
  const pathname = usePathname() ?? "";
  const [shopOpen, setShopOpen] = useState(false);
  const shopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shopOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const el = shopRef.current;
      if (el && !el.contains(event.target as Node)) setShopOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShopOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [shopOpen]);

  // Hover background highlight without affecting layout (no padding/box-size changes).
  const navItemClass =
    "relative inline-block origin-center text-sm font-medium text-slate-700 transition-[transform,color] duration-150 ease-out will-change-transform hover:scale-[1.06] hover:text-brand-teal " +
    // Extend slightly beyond the text bounds so the grey doesn't look like it is "inside" the letters.
    "before:absolute before:content-[''] before:-z-10 before:inset-x-[-0.25rem] before:inset-y-[-0.125rem] before:rounded-md before:bg-slate-100 before:opacity-0 before:transition-opacity before:duration-150 " +
    "before:pointer-events-none hover:before:opacity-100";

  const isHome = pathname === "/";
  const isShop = pathname.startsWith("/shop");
  const isAbout = pathname.startsWith("/about-us");
  const isContact = pathname.startsWith("/contact-us");
  const isTrack = pathname.startsWith("/track-order");

  const navItemActiveClass = (active: boolean) =>
    // `!` important so active green wins over base `text-slate-700`.
    active ? "before:opacity-100 !text-brand-teal scale-[1.06]" : "";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col items-stretch gap-3 px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center md:px-6 lg:flex-nowrap lg:items-center lg:gap-6">
        <div className="flex min-w-0 w-full flex-1 flex-wrap items-center gap-x-6 sm:flex-1 lg:w-auto lg:max-w-none lg:flex-1 lg:flex-nowrap">
          <Link href="/" className="inline-flex max-w-full shrink-0 items-center self-start sm:self-center">
            <Image src="/assets/logo-everon.svg" alt="Everon Global Trades LLC" width={280} height={46} className="h-10 max-w-full w-auto" priority />
          </Link>

          <nav className="flex min-w-0 flex-1 flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium lg:flex-none lg:flex-nowrap">
            <Link href="/" className={`${navItemClass} ${navItemActiveClass(isHome)}`}>
              Home
            </Link>
            <div
              ref={shopRef}
              className="relative"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <button
                type="button"
                aria-expanded={shopOpen}
                aria-haspopup="true"
                onClick={() => setShopOpen((o) => !o)}
                className={`${navItemClass} ${navItemActiveClass(isShop)} inline-flex cursor-pointer list-none items-center gap-1 border-0 bg-transparent p-0`}
              >
                Shop
                <svg
                  className={`h-3.5 w-3.5 shrink-0 text-current transition-transform duration-150 ${shopOpen ? "rotate-180" : ""}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.2}
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {shopOpen && (
                <div className="absolute left-0 top-full z-50 pt-1">
                  <div className="grid w-[min(20rem,calc(100vw-2rem))] grid-cols-1 gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-lg sm:grid-cols-2">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/shop/${category.id}`}
                        className="inline-block origin-center rounded px-2 py-1 text-xs text-slate-700 transition-[transform,color,background-color] duration-150 ease-out hover:scale-[1.06] hover:bg-slate-100 hover:text-brand-teal"
                        onClick={() => setShopOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link href="/about-us" className={`${navItemClass} ${navItemActiveClass(isAbout)}`}>
              About Us
            </Link>
            <Link href="/contact-us" className={`${navItemClass} ${navItemActiveClass(isContact)}`}>
              Contact Us
            </Link>
            <Link href="/track-order" className={`${navItemClass} ${navItemActiveClass(isTrack)}`}>
              Track Order
            </Link>
          </nav>
        </div>

        <div className="grid w-full grid-cols-2 items-stretch gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3 lg:ml-auto lg:w-auto lg:flex-nowrap lg:shrink-0">
          <HeaderSearch />
          <Link
            href="/cart"
            aria-label="Cart"
            className="inline-flex min-w-0 origin-center items-center justify-center gap-1 rounded-md border border-slate-300 px-3 py-2 text-center text-sm font-medium text-slate-700 transition-[transform,color,border-color] duration-150 ease-out hover:scale-[1.06] hover:border-brand-teal hover:text-brand-teal"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2Zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2ZM7.17 14h9.92c.75 0 1.41-.41 1.75-1.03L22 7H6.21l-.94-2H2v2h2l3.6 7.59-1.35 2.45C5.52 18.37 6.48 20 8 20h12v-2H8l1.17-2Z" />
            </svg>
            Cart ({totalItems})
          </Link>
          <Link
            href="/account"
            className="inline-flex min-w-0 origin-center items-center justify-center rounded-md bg-brand-navy px-4 py-2 text-center text-sm font-medium text-white transition-[transform,background-color] duration-150 ease-out hover:scale-[1.06] hover:bg-brand-slate"
          >
            Account
          </Link>
          <Link
            href="/login"
            className="col-span-2 inline-flex min-w-0 origin-center items-center justify-center rounded-md border border-brand-navy px-4 py-2 text-center text-sm font-medium text-brand-navy transition-[transform,background-color] duration-150 ease-out hover:scale-[1.06] hover:bg-slate-100 sm:col-span-1"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
