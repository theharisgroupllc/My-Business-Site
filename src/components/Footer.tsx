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
          <p className="mt-2 text-sm leading-5 text-slate-200">Email: info@everonglobaltrades.com</p>
          <p className="text-sm leading-5 text-slate-200">Phone: +1 214 795 2842</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Quick Links</h4>
          <div className="mt-2 grid grid-cols-2 gap-x-5 text-sm leading-6 text-slate-300">
            <ul>
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/cart" className="hover:text-white">Cart</Link></li>
              <li><Link href="/about-us" className="hover:text-white">About Us</Link></li>
              <li><Link href="/track-order" className="hover:text-white">Track Order</Link></li>
            </ul>
            <ul>
              <li><Link href="/shop" className="hover:text-white">Shop</Link></li>
              <li><Link href="/checkout" className="hover:text-white">Checkout</Link></li>
              <li><Link href="/contact-us" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Policies</h4>
          <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-300">
            <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms-and-conditions" className="hover:text-white">Terms & Conditions</Link></li>
            <li><Link href="/refund-policy" className="hover:text-white">Refund Policy</Link></li>
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
