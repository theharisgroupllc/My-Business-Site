import type { Metadata } from "next";
import { AdminDashboard } from "@/components/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard | Everon Global Trades LLC",
  description: "Secure administration for Everon Global Trades LLC products, orders, reviews, reports, and discounts.",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
