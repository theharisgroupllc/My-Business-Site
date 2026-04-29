import type { D1Database } from "@cloudflare/workers-types";
import { products } from "./lib/catalog";

const SHIPPING_FLAT = 9.99;
const TAX_RATE = 0.07;

export type OrderLineComputed = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  managedInventory: boolean;
};

export type ComputedCheckout = {
  lines: OrderLineComputed[];
  merchandiseSubtotal: number;
  discountCode: string | null;
  discountAmount: number;
  taxableSubtotal: number;
  shipping: number;
  tax: number;
  total: number;
};

const roundMoney = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

const sanitize = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

export async function computeCheckoutTotals(
  db: D1Database,
  body: Record<string, unknown>,
): Promise<{ ok: true; data: ComputedCheckout } | { ok: false; status: number; error: string }> {
  const rawItems = Array.isArray(body.items) ? body.items : [];
  if (rawItems.length === 0) {
    return { ok: false, status: 400, error: "Cart is empty." };
  }

  const lines: OrderLineComputed[] = [];
  let merchandiseSubtotal = 0;

  for (const raw of rawItems) {
    const row = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
    const productId = sanitize(row.productId ?? row.id, 120);
    const quantity = Math.max(1, Math.floor(Number(row.quantity)));
    if (!productId || !Number.isFinite(quantity) || quantity < 1) {
      return { ok: false, status: 400, error: "Each item needs a valid productId and quantity." };
    }

    const nameFromClient = sanitize(row.name, 200);
    const adminRow = await db
      .prepare("SELECT id, name, price, inventory FROM products_admin WHERE id = ? AND status = 'active'")
      .bind(productId)
      .first<{ id: string; name: string; price: number; inventory: number }>();

    if (adminRow) {
      if (quantity > adminRow.inventory) {
        return {
          ok: false,
          status: 409,
          error: `Insufficient stock for "${adminRow.name}". Available: ${adminRow.inventory}.`,
        };
      }
      const unitPrice = Number(adminRow.price);
      if (!Number.isFinite(unitPrice) || unitPrice < 0) {
        return { ok: false, status: 400, error: "Invalid product price in catalog." };
      }
      const lineTotal = roundMoney(unitPrice * quantity);
      merchandiseSubtotal += lineTotal;
      lines.push({
        productId,
        name: nameFromClient || adminRow.name,
        quantity,
        unitPrice,
        lineTotal,
        managedInventory: true,
      });
      continue;
    }

    const catalogProduct = products.find((p) => p.id === productId);
    if (!catalogProduct) {
      return { ok: false, status: 400, error: `Unknown product: ${productId}.` };
    }
    if (!catalogProduct.inStock) {
      return { ok: false, status: 409, error: `"${catalogProduct.name}" is not available.` };
    }
    const unitPrice = catalogProduct.price;
    const lineTotal = roundMoney(unitPrice * quantity);
    merchandiseSubtotal += lineTotal;
    lines.push({
      productId,
      name: nameFromClient || catalogProduct.name,
      quantity,
      unitPrice,
      lineTotal,
      managedInventory: false,
    });
  }

  merchandiseSubtotal = roundMoney(merchandiseSubtotal);

  const discountCodeRaw = sanitize(body.discountCode, 40).toUpperCase();
  let discountAmount = 0;
  let discountCode: string | null = null;

  if (discountCodeRaw) {
    const disc = await db
      .prepare("SELECT code, discount_type, value, status FROM discounts WHERE code = ? LIMIT 1")
      .bind(discountCodeRaw)
      .first<{ code: string; discount_type: string; value: number; status: string }>();

    if (!disc || disc.status !== "active") {
      return { ok: false, status: 400, error: "Invalid or inactive discount code." };
    }
    const value = Number(disc.value);
    if (!Number.isFinite(value) || value <= 0) {
      return { ok: false, status: 400, error: "Discount is misconfigured." };
    }
    if (disc.discount_type === "percent") {
      discountAmount = roundMoney(merchandiseSubtotal * (value / 100));
    } else if (disc.discount_type === "fixed") {
      discountAmount = roundMoney(Math.min(value, merchandiseSubtotal));
    } else {
      return { ok: false, status: 400, error: "Unsupported discount type." };
    }
    discountAmount = Math.min(discountAmount, merchandiseSubtotal);
    discountCode = disc.code;
  }

  const taxableSubtotal = roundMoney(merchandiseSubtotal - discountAmount);
  const shipping = lines.length > 0 ? SHIPPING_FLAT : 0;
  const tax = lines.length > 0 ? roundMoney(taxableSubtotal * TAX_RATE) : 0;
  const total = roundMoney(taxableSubtotal + shipping + tax);

  return {
    ok: true,
    data: {
      lines,
      merchandiseSubtotal,
      discountCode,
      discountAmount,
      taxableSubtotal,
      shipping,
      tax,
      total,
    },
  };
}
