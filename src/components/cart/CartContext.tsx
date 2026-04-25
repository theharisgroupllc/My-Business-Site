"use client";

import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { Product, products } from "@/lib/catalog";

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
  clearCart: () => void;
};

type CartAction =
  | { type: "add"; productId: string }
  | { type: "remove"; productId: string }
  | { type: "updateQuantity"; productId: string; quantity: number }
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

  const detailedItems = useMemo(
    () =>
      state.items
        .map((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (!product) return null;
          return { product, quantity: item.quantity, lineTotal: Number((product.price * item.quantity).toFixed(2)) };
        })
        .filter((item): item is { product: Product; quantity: number; lineTotal: number } => item !== null),
    [state.items],
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
