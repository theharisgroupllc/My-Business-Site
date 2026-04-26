import type { Metadata } from "next";
import Link from "next/link";
import { SocialAuthPanel } from "@/components/SocialAuthPanel";

export const metadata: Metadata = {
  title: "Login | Everon Global Trades LLC",
  description: "Sign in to your Everon Global Trades LLC account.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto mt-12 max-w-md px-4 md:px-6">
      <h1 className="text-3xl font-bold text-brand-navy">Customer Login</h1>
      <form className="mt-6 rounded-xl border border-slate-200 p-5 shadow-sm sm:p-6">
        <div className="space-y-3">
          <input type="email" placeholder="Email address" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input type="password" placeholder="Password" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <button type="button" className="w-full rounded-md bg-brand-navy px-4 py-3 text-sm font-semibold text-white hover:bg-brand-slate">
            Sign In
          </button>
        </div>
        <p className="mt-4 text-xs text-slate-600">
          New customer? <Link href="/account" className="text-brand-teal hover:underline">Create account</Link>
        </p>
      </form>
      <SocialAuthPanel mode="login" />
    </div>
  );
}
