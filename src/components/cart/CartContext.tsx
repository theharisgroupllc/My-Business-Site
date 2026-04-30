"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { Product, productFromAdminRow, products } from "@/lib/catalog";

type CartItem = {
  productId: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  detailedItems: Array<{ product: Product; quantity: number; lineTotal: number }>;
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  /** Sets cart line quantity; 0 removes the line. Persists via localStorage like other cart updates. */
  setItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

type CartAction =
  | { type: "add"; productId: string }
  | { type: "remove"; productId: string }
  | { type: "updateQuantity"; productId: string; quantity: number }
  | { type: "setQuantity"; productId: string; quantity: number }
  | { type: "hydrate"; payload: CartState }
  | { type: "clear" };

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "everon-cart-v1";

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const existing = state.items.find((item) => item.productId === action.productId);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.productId === action.productId ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        };
      }
      return { items: [...state.items, { productId: action.productId, quantity: 1 }] };
    }
    case "remove":
      return { items: state.items.filter((item) => item.productId !== action.productId) };
    case "updateQuantity":
      return {
        items: state.items
          .map((item) => (item.productId === action.productId ? { ...item, quantity: Math.max(1, action.quantity) } : item))
          .filter((item) => item.quantity > 0),
      };
    case "setQuantity": {
      if (action.quantity <= 0) {
        return { items: state.items.filter((item) => item.productId !== action.productId) };
      }
      const existingSet = state.items.find((item) => item.productId === action.productId);
      if (existingSet) {
        return {
          items: state.items.map((item) =>
            item.productId === action.productId ? { ...item, quantity: action.quantity } : item,
          ),
        };
      }
      return { items: [...state.items, { productId: action.productId, quantity: action.quantity }] };
    }
    case "clear":
      return { items: [] };
    case "hydrate":
      return action.payload;
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/products")
      .then(async (response) => (response.ok ? ((await response.json()) as { products?: Array<Record<string, unknown>> }) : { products: [] }))
      .then((data) => {
        if (cancelled) return;
        const rows = data.products ?? [];
        setLiveProducts(
          rows.map((row) =>
            productFromAdminRow({
              id: String(row.id),
              slug: row.slug != null ? String(row.slug) : undefined,
              name: String(row.name ?? "Product"),
              category_id: String(row.category_id ?? row.categoryId ?? ""),
              price: row.price as number | string,
              inventory: row.inventory as number | string | undefined,
              description: row.description != null ? String(row.description) : undefined,
              image_url: row.image_url != null ? String(row.image_url) : undefined,
              gallery_json: row.gallery_json != null ? String(row.gallery_json) : undefined,
              rating: row.rating as number | string | undefined,
            }),
          ),
        );
      })
      .catch(() => {
        if (!cancelled) setLiveProducts([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as CartState;
      if (Array.isArray(parsed.items)) {
        dispatch({ type: "hydrate", payload: parsed });
      }
    } catch {
      // Ignore malformed storage
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const liveById = useMemo(() => {
    const map = new Map<string, Product>();
    for (const product of liveProducts) map.set(product.id, product);
    return map;
  }, [liveProducts]);

  const detailedItems = useMemo(
    () =>
      state.items
        .map((item) => {
          const product = liveById.get(item.productId) ?? products.find((p) => p.id === item.productId);
          if (!product) return null;
          return { product, quantity: item.quantity, lineTotal: Number((product.price * item.quantity).toFixed(2)) };
        })
        .filter((item): item is { product: Product; quantity: number; lineTotal: number } => item !== null),
    [state.items, liveById],
  );

  const subtotal = useMemo(() => Number(detailedItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2)), [detailedItems]);
  const totalItems = useMemo(() => state.items.reduce((sum, item) => sum + item.quantity, 0), [state.items]);

  const value: CartContextType = {
    items: state.items,
    totalItems,
    subtotal,
    detailedItems,
    addItem: (productId) => dispatch({ type: "add", productId }),
    removeItem: (productId) => dispatch({ type: "remove", productId }),
    updateQuantity: (productId, quantity) => dispatch({ type: "updateQuantity", productId, quantity }),
    setItemQuantity: (productId, quantity) => dispatch({ type: "setQuantity", productId, quantity }),
    clearCart: () => dispatch({ type: "clear" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
