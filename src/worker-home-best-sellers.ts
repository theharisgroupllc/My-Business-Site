import type { D1Database } from "@cloudflare/workers-types";
import { products } from "./lib/catalog";

/** Default homepage “template” slots when DB has no overrides. */
export const DEFAULT_HOME_BEST_SELLER_IDS = [
  "art-craft-sewing-1",
  "beauty-personal-care-1",
  "baby-products-1",
  "home-decor-1",
  "kitchen-dining-1",
  "office-products-1",
  "pet-supplies-1",
  "sports-outdoors-1",
];

export async function getHomeBestSellerProductIds(db: D1Database): Promise<string[]> {
  const { results } = await db.prepare("SELECT slot, static_product_id FROM homepage_best_sellers ORDER BY slot").all();
  const out = [...DEFAULT_HOME_BEST_SELLER_IDS];
  const rows = (results ?? []) as Array<{ slot: number; static_product_id: string }>;
  for (const row of rows) {
    if (row.slot >= 0 && row.slot < 8 && row.static_product_id) {
      out[row.slot] = row.static_product_id;
    }
  }
  return out;
}

export function validateStaticProductIds(ids: string[]): string | null {
  if (ids.length !== 8) return "Exactly 8 product IDs are required.";
  for (let i = 0; i < 8; i++) {
    if (!ids[i] || !products.some((p) => p.id === ids[i])) {
      return `Invalid catalog product id at slot ${i}: ${ids[i] ?? ""}`;
    }
  }
  return null;
}
