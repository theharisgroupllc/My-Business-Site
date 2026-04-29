import { Suspense } from "react";
import { ShopLiveItemContent } from "./ShopLiveItemContent";

export default function ShopLiveItemPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
          <p className="text-sm text-slate-600">Loading…</p>
        </div>
      }
    >
      <ShopLiveItemContent />
    </Suspense>
  );
}
