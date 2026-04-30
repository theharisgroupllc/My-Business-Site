import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { CartProvider } from "@/components/cart/CartContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://everonglobaltrades.com"),
  title: "Everon Global Trades LLC | Trusted Global Retail Partner",
  description:
    "Everon Global Trades LLC is a US-based retail and wholesale company delivering quality products across home essentials, personal care, tools, and more.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <BackToTop />
        </CartProvider>
      </body>
    </html>
  );
}
