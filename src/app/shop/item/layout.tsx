import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Product | Everon Global Trades LLC",
  description: "View product details from the Everon Global Trades catalog.",
};

export default function ShopItemLayout({ children }: { children: ReactNode }) {
  return children;
}
