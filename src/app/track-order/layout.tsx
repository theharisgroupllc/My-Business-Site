import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Track Order | Everon Global Trades LLC",
  description: "Look up your order with your order ID and email address.",
};

export default function TrackOrderLayout({ children }: { children: ReactNode }) {
  return children;
}
