"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { StarRating } from "@/components/StarRating";

const sessionKey = "everon-session-v1";

const reviews = [
  {
    name: "Morgan Lewis",
    company: "Independent Retail Buyer",
    rating: 4.8,
    quote: "Everon Global Trades consistently delivers quality products with professional fulfillment and responsive support.",
  },
  {
    name: "Jessica Tran",
    company: "Home Goods Customer",
    rating: 4.6,
    quote: "Reliable shipping, secure checkout, and products that match the descriptions. I trust them for recurring purchases.",
  },
  {
    name: "Daniel Brooks",
    company: "Small Business Owner",
    rating: 4.4,
    quote: "Their multi-category sourcing helped us expand inventory confidently with dependable supplier-backed products.",
  },
  {
    name: "Avery Stone",
    company: "Verified Customer",
    rating: 3.8,
    quote: "The catalog is broad, checkout is simple, and the customer care experience feels professional.",
  },
];

function subscribeToAuthChanges(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getAuthSnapshot() {
  return window.localStorage.getItem(sessionKey) === "authenticated";
}

function getServerAuthSnapshot() {
  return false;
}

export function ReviewCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const isAuthenticated = useSyncExternalStore(subscribeToAuthChanges, getAuthSnapshot, getServerAuthSnapshot);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % reviews.length);
    }, 4500);
    return () => window.clearInterval(interval);
  }, []);

  const trackStyle = useMemo(() => ({ transform: `translateX(-${activeIndex * 100}%)` }), [activeIndex]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex transition-transform duration-700 ease-out" style={trackStyle}>
        {reviews.map((review) => (
          <article key={review.name} className="min-w-full p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <StarRating rating={review.rating} />
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Verified review</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">&ldquo;{review.quote}&rdquo;</p>
            <p className="mt-4 text-sm font-semibold text-brand-navy">{review.name}</p>
            <p className="text-xs text-slate-500">{review.company}</p>
          </article>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
        <div className="flex gap-2">
          {reviews.map((review, index) => (
            <button
              key={review.name}
              type="button"
              aria-label={`Show review ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 w-2.5 rounded-full transition ${index === activeIndex ? "bg-brand-teal" : "bg-slate-300"}`}
            />
          ))}
        </div>
        <Link href="/login" className="text-sm font-semibold text-brand-teal hover:underline">
          See All
        </Link>
      </div>

      <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">
        {isAuthenticated ? (
          <form className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              aria-label="Write a review"
              placeholder="Share your review..."
              className="min-w-0 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-teal focus:ring"
            />
            <button type="button" className="rounded-md bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-slate">
              Submit Review
            </button>
          </form>
        ) : (
          <p className="text-sm text-slate-600">
            Only logged-in customers can submit reviews.{" "}
            <Link href="/login" className="font-semibold text-brand-teal hover:underline">
              Sign in to review
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
