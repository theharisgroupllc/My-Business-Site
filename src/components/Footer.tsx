import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-14 bg-brand-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-8 md:grid-cols-[1.1fr_1fr_0.9fr_1fr] md:px-6">
        <div>
          <h3 className="text-lg font-semibold">Everon Global Trades LLC</h3>
          <p className="mt-2 text-sm leading-5 text-slate-300">
            Registered US-based retail and wholesale distribution company trusted by customers and suppliers.
          </p>
          <p className="mt-2 text-sm leading-5 text-slate-200">
            Email:{" "}
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=info@everonglobaltrades.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-200 underline decoration-teal-300/80 underline-offset-2 transition hover:text-white hover:decoration-white"
            >
              info@everonglobaltrades.com
            </a>
          </p>
          <p className="text-sm leading-5 text-slate-200">
            Phone:{" "}
            <a href="tel:+12147952842" className="text-teal-200 underline decoration-teal-300/80 underline-offset-2 transition hover:text-white hover:decoration-white">
              +1 214 795 2842
            </a>
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Quick Links</h4>
          <div className="mt-2 grid grid-cols-2 gap-x-5 text-sm leading-6 text-slate-300">
            <ul>
              <li><Link href="/" className="underline-offset-2 hover:text-white hover:underline">Home</Link></li>
              <li><Link href="/cart/" className="underline-offset-2 hover:text-white hover:underline">Cart</Link></li>
              <li><Link href="/about-us/" className="underline-offset-2 hover:text-white hover:underline">About Us</Link></li>
              <li><Link href="/track-order/" className="underline-offset-2 hover:text-white hover:underline">Track Order</Link></li>
            </ul>
            <ul>
              <li><Link href="/shop/" className="underline-offset-2 hover:text-white hover:underline">Shop</Link></li>
              <li><Link href="/checkout/" className="underline-offset-2 hover:text-white hover:underline">Checkout</Link></li>
              <li><Link href="/contact-us/" className="underline-offset-2 hover:text-white hover:underline">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Policies</h4>
          <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-300">
            <li><Link href="/privacy-policy/" className="underline-offset-2 hover:text-white hover:underline">Privacy Policy</Link></li>
            <li><Link href="/terms-and-conditions/" className="underline-offset-2 hover:text-white hover:underline">Terms & Conditions</Link></li>
            <li><Link href="/refund-policy/" className="underline-offset-2 hover:text-white hover:underline">Refund Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Trust & Payments</h4>
          <div className="mt-2 space-y-2 text-sm leading-5 text-slate-300">
            <p className="w-full max-w-[240px] rounded border border-teal-400/30 bg-teal-400/10 px-3 py-2 text-center">SSL Secured Checkout</p>
            <div className="flex w-full max-w-[240px] flex-wrap items-center gap-2">
              <Image src="/assets/payment-visa.svg" alt="Visa" width={72} height={24} className="h-6 max-w-full flex-1 object-contain" />
              <Image src="/assets/payment-mastercard.svg" alt="MasterCard" width={72} height={24} className="h-6 max-w-full flex-1 object-contain" />
              <Image src="/assets/payment-paypal.svg" alt="PayPal" width={72} height={24} className="h-6 max-w-full flex-1 object-contain" />
            </div>
            <p>Business registration and supplier verification available upon request.</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700 px-4 py-3 text-center text-xs leading-5 text-slate-400 md:px-6">
        © {new Date().getFullYear()} Everon Global Trades LLC. All rights reserved.
      </div>
    </footer>
  );
}
