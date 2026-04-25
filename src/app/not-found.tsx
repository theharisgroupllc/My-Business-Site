import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="mx-auto mt-16 max-w-xl px-4 text-center md:px-6">
      <h1 className="text-3xl font-bold text-brand-navy">Page Not Found</h1>
      <p className="mt-3 text-sm text-slate-600">The page you are looking for does not exist or may have moved.</p>
      <Link href="/" className="mt-6 inline-block rounded-md bg-brand-navy px-5 py-3 text-sm font-semibold text-white hover:bg-brand-slate">
        Return to Home
      </Link>
    </div>
  );
}
