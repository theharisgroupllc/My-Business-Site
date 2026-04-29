export type PricePreset = "all" | "under50" | "50_100" | "101_150" | "above150" | "custom";

export function parsePriceInput(raw: string): number | null {
  const n = Number(String(raw).replace(/[^0-9.-]/g, ""));
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

export function productPassesPriceFilter(price: number, preset: PricePreset, minInput: string, maxInput: string): boolean {
  if (preset === "all") return true;
  if (preset === "under50") return price < 50;
  if (preset === "50_100") return price >= 50 && price <= 100;
  if (preset === "101_150") return price >= 101 && price <= 150;
  if (preset === "above150") return price > 150;
  if (preset === "custom") {
    const lo = parsePriceInput(minInput);
    const hi = parsePriceInput(maxInput);
    if (lo != null && hi != null) {
      const a = Math.min(lo, hi);
      const b = Math.max(lo, hi);
      return price >= a && price <= b;
    }
    if (lo != null) return price >= lo;
    if (hi != null) return price <= hi;
    return true;
  }
  return true;
}

export function appendPriceSearchParams(params: URLSearchParams, preset: PricePreset, minInput: string, maxInput: string) {
  if (preset === "all") return;
  if (preset === "under50") {
    params.set("maxExclusive", "50");
    return;
  }
  if (preset === "50_100") {
    params.set("minPrice", "50");
    params.set("maxPrice", "100");
    return;
  }
  if (preset === "101_150") {
    params.set("minPrice", "101");
    params.set("maxPrice", "150");
    return;
  }
  if (preset === "above150") {
    params.set("minExclusive", "150");
    return;
  }
  if (preset === "custom") {
    const lo = parsePriceInput(minInput);
    const hi = parsePriceInput(maxInput);
    if (lo != null && hi != null) {
      const a = Math.min(lo, hi);
      const b = Math.max(lo, hi);
      params.set("minPrice", String(a));
      params.set("maxPrice", String(b));
      return;
    }
    if (lo != null) params.set("minPrice", String(lo));
    if (hi != null) params.set("maxPrice", String(hi));
  }
}

/** When > 0, adds minRating for D1-backed product API filtering. */
export function appendRatingSearchParams(params: URLSearchParams, selectedRating: string) {
  const v = Number(selectedRating);
  if (Number.isFinite(v) && v > 0) params.set("minRating", String(v));
}
