"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { PricePreset } from "./priceFilterUtils";

export type { PricePreset };

type CategoryFiltersProps = {
  selectedCategory: string;
  categories: Array<{ id: string; name: string }>;
  selectedRating: string;
  pricePreset: PricePreset;
  priceMinInput: string;
  priceMaxInput: string;
  onCategoryChange: (value: string) => void;
  onPricePresetChange: (preset: PricePreset) => void;
  onPriceMinInputChange: (value: string) => void;
  onPriceMaxInputChange: (value: string) => void;
  onApplyCustomPriceRange: () => void;
  onRatingChange: (value: string) => void;
};

type DropdownOption = {
  value: string;
  label: string;
};

type DesktopDropdownProps = {
  id: string;
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  openId: string | null;
  setOpenId: (id: string | null) => void;
  showScrollIndicator?: boolean;
  scrollHintText?: string;
};

function DesktopDropdown({
  id,
  label,
  value,
  options,
  onChange,
  openId,
  setOpenId,
  showScrollIndicator = false,
  scrollHintText = "Swipe down for more",
}: DesktopDropdownProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const isOpen = openId === id;
  const selectedLabel = options.find((option) => option.value === value)?.label ?? options[0]?.label ?? "Select";
  const [showMoreHint, setShowMoreHint] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const node = wrapperRef.current;
      if (node && !node.contains(event.target as Node)) setOpenId(null);
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenId(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [isOpen, setOpenId]);

  useEffect(() => {
    if (!isOpen || !showScrollIndicator) {
      setShowMoreHint(false);
      return;
    }
    const node = listRef.current;
    if (!node) return;

    const updateHint = () => {
      const canScroll = node.scrollHeight > node.clientHeight + 1;
      const nearBottom = node.scrollTop + node.clientHeight >= node.scrollHeight - 2;
      setShowMoreHint(canScroll && !nearBottom);
    };

    updateHint();
    node.addEventListener("scroll", updateHint, { passive: true });
    window.addEventListener("resize", updateHint);
    return () => {
      node.removeEventListener("scroll", updateHint);
      window.removeEventListener("resize", updateHint);
    };
  }, [isOpen, showScrollIndicator, options]);

  return (
    <div ref={wrapperRef} className="relative">
      <label htmlFor={`${id}-btn`} className="text-xs font-medium text-slate-600">
        {label}
      </label>
      <button
        id={`${id}-btn`}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="mt-2 inline-flex min-h-[44px] w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-left text-sm text-slate-700 transition-[color,background-color,border-color] duration-150 ease-out md:transition-[color,background-color,border-color,transform] md:hover:scale-[1.02] hover:border-brand-teal hover:bg-slate-100 hover:text-brand-teal"
        onClick={() => setOpenId(isOpen ? null : id)}
      >
        <span className="truncate">{selectedLabel}</span>
        <svg
          className={`ml-2 h-3.5 w-3.5 shrink-0 text-current transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-40 mt-1 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
          <ul
            ref={listRef}
            role="listbox"
            aria-labelledby={`${id}-btn`}
            className={`space-y-1 overflow-x-hidden ${
              showScrollIndicator
                ? "filter-dropdown-list category-scroll-hint max-h-40 overflow-y-scroll overscroll-contain [scrollbar-gutter:stable] [touch-action:pan-y] [-webkit-overflow-scrolling:touch]"
                : "max-h-64 overflow-y-auto overscroll-contain [touch-action:pan-y]"
            }`}
            onTouchMove={(event) => {
              event.stopPropagation();
            }}
          >
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  className={`inline-block min-h-[40px] w-full origin-center rounded px-2 py-2 text-left text-sm transition-[color,background-color] duration-150 ease-out md:transition-[transform,color,background-color] md:hover:scale-[1.03] hover:bg-slate-100 hover:text-brand-teal ${
                    option.value === value ? "bg-slate-100 text-brand-teal" : "text-slate-700"
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setOpenId(null);
                  }}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
          {showScrollIndicator && showMoreHint && (
            <div className="pointer-events-none absolute inset-x-2 bottom-2 rounded bg-white/95 py-1 text-center text-[11px] font-medium text-slate-500">
              {scrollHintText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PriceRangeSection({
  pricePreset,
  priceMinInput,
  priceMaxInput,
  onPricePresetChange,
  onPriceMinInputChange,
  onPriceMaxInputChange,
  onApplyCustomPriceRange,
}: {
  pricePreset: PricePreset;
  priceMinInput: string;
  priceMaxInput: string;
  onPricePresetChange: (preset: PricePreset) => void;
  onPriceMinInputChange: (value: string) => void;
  onPriceMaxInputChange: (value: string) => void;
  onApplyCustomPriceRange: () => void;
}) {
  const presetBtn = (preset: PricePreset, label: string) => (
    <button
      key={preset}
      type="button"
      className={`w-full rounded-md border px-3 py-2.5 text-left text-sm font-medium transition-colors md:py-2 ${
        pricePreset === preset
          ? "border-brand-teal bg-brand-teal/10 text-brand-navy"
          : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
      }`}
      onClick={() => onPricePresetChange(preset)}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-slate-600">Price Range</p>
      <button
        type="button"
        className={`w-full rounded-md border px-3 py-2.5 text-left text-sm font-medium transition-colors md:py-2 ${
          pricePreset === "all"
            ? "border-brand-teal bg-brand-teal/10 text-brand-navy"
            : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
        }`}
        onClick={() => onPricePresetChange("all")}
      >
        All Prices
      </button>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="filter-price-min" className="sr-only">
            Minimum price
          </label>
          <input
            id="filter-price-min"
            inputMode="decimal"
            placeholder="Min $"
            value={priceMinInput}
            onChange={(e) => onPriceMinInputChange(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
          />
        </div>
        <div>
          <label htmlFor="filter-price-max" className="sr-only">
            Maximum price
          </label>
          <input
            id="filter-price-max"
            inputMode="decimal"
            placeholder="Max $"
            value={priceMaxInput}
            onChange={(e) => onPriceMaxInputChange(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
          />
        </div>
      </div>
      <button
        type="button"
        className="w-full rounded-md bg-brand-navy px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-slate md:py-2"
        onClick={onApplyCustomPriceRange}
      >
        Apply custom range
      </button>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {presetBtn("under50", "Under $50")}
        {presetBtn("50_100", "$50 - $100")}
        {presetBtn("101_150", "$101 - $150")}
        {presetBtn("above150", "Above $150")}
      </div>
    </div>
  );
}

export function CategoryFilters({
  selectedCategory,
  categories,
  selectedRating,
  pricePreset,
  priceMinInput,
  priceMaxInput,
  onCategoryChange,
  onPricePresetChange,
  onPriceMinInputChange,
  onPriceMaxInputChange,
  onApplyCustomPriceRange,
  onRatingChange,
}: CategoryFiltersProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (openId !== "category-filter") return;
    if (!window.matchMedia("(max-width: 768px)").matches) return;

    const body = document.body;
    const scrollY = window.scrollY;
    const prevOverflow = body.style.overflow;
    const prevPosition = body.style.position;
    const prevTop = body.style.top;
    const prevWidth = body.style.width;

    // iOS Safari/Chrome body-lock pattern to prevent background page scroll while
    // interacting with an inner scrollable dropdown.
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    return () => {
      body.style.overflow = prevOverflow;
      body.style.position = prevPosition;
      body.style.top = prevTop;
      body.style.width = prevWidth;
      window.scrollTo(0, scrollY);
    };
  }, [openId]);

  const categoryOptions = useMemo<DropdownOption[]>(
    () => [{ value: "all", label: "All Categories" }, ...categories.map((category) => ({ value: category.id, label: category.name }))],
    [categories],
  );

  const ratingBtn = (value: string, label: string) => (
    <button
      key={value}
      type="button"
      className={`w-full rounded-md border px-3 py-2.5 text-left text-sm font-medium transition-colors md:py-2 ${
        selectedRating === value
          ? "border-brand-teal bg-brand-teal/10 text-brand-navy"
          : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
      }`}
      onClick={() => onRatingChange(value)}
    >
      {label}
    </button>
  );

  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-navy">Filters</h3>

      <div className="mt-4 space-y-2">
        <DesktopDropdown
          id="category-filter"
          label="Category"
          value={selectedCategory}
          options={categoryOptions}
          onChange={onCategoryChange}
          openId={openId}
          setOpenId={setOpenId}
          showScrollIndicator
          scrollHintText="Swipe down for more"
        />
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4">
        <PriceRangeSection
          pricePreset={pricePreset}
          priceMinInput={priceMinInput}
          priceMaxInput={priceMaxInput}
          onPricePresetChange={onPricePresetChange}
          onPriceMinInputChange={onPriceMinInputChange}
          onPriceMaxInputChange={onPriceMaxInputChange}
          onApplyCustomPriceRange={onApplyCustomPriceRange}
        />
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4">
        <p className="text-xs font-medium text-slate-600">Rating</p>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {ratingBtn("0", "All ratings")}
          {ratingBtn("3.5", "3.5 and above")}
          {ratingBtn("4", "4 and above")}
          {ratingBtn("4.5", "4.5 and above")}
        </div>
      </div>
    </aside>
  );
}
