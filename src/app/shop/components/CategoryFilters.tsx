"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type CategoryFiltersProps = {
  selectedCategory: string;
  categories: Array<{ id: string; name: string }>;
  minPrice: number;
  maxPrice: number;
  selectedPrice: string;
  selectedRating: string;
  onCategoryChange: (value: string) => void;
  onPriceChange: (value: string) => void;
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
};

function DesktopDropdown({ id, label, value, options, onChange, openId, setOpenId, showScrollIndicator = false }: DesktopDropdownProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isOpen = openId === id;
  const selectedLabel = options.find((option) => option.value === value)?.label ?? options[0]?.label ?? "Select";

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
        className="mt-2 inline-flex min-h-[44px] w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-left text-sm text-slate-700 transition-[color,background-color,border-color,transform] duration-150 ease-out hover:scale-[1.02] hover:border-brand-teal hover:bg-slate-100 hover:text-brand-teal"
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
            role="listbox"
            aria-labelledby={`${id}-btn`}
            className={`space-y-1 overflow-x-hidden ${
              showScrollIndicator
                ? "filter-dropdown-list max-h-40 overflow-y-scroll"
                : "max-h-64 overflow-y-auto"
            }`}
          >
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  className={`inline-block min-h-[40px] w-full origin-center rounded px-2 py-2 text-left text-sm transition-[transform,color,background-color] duration-150 ease-out hover:scale-[1.03] hover:bg-slate-100 hover:text-brand-teal ${
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
        </div>
      )}
    </div>
  );
}

export function CategoryFilters({
  selectedCategory,
  categories,
  minPrice,
  maxPrice,
  selectedPrice,
  selectedRating,
  onCategoryChange,
  onPriceChange,
  onRatingChange,
}: CategoryFiltersProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const categoryOptions = useMemo<DropdownOption[]>(
    () => [{ value: "all", label: "All Categories" }, ...categories.map((category) => ({ value: category.id, label: category.name }))],
    [categories],
  );
  const priceOptions = useMemo<DropdownOption[]>(
    () => [
      { value: "all", label: "All prices" },
      { value: "budget", label: `$${minPrice} - $${(minPrice + maxPrice) / 2}` },
      { value: "premium", label: `$${Math.floor((minPrice + maxPrice) / 2)} - $${maxPrice}` },
    ],
    [minPrice, maxPrice],
  );
  const ratingOptions: DropdownOption[] = [
    { value: "0", label: "All ratings" },
    { value: "4", label: "4.0 and above" },
    { value: "4.3", label: "4.3 and above" },
    { value: "4.5", label: "4.5 and above" },
  ];

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
        />
      </div>

      <div className="mt-4 space-y-2">
        <DesktopDropdown
          id="price-filter"
          label="Price Range"
          value={selectedPrice}
          options={priceOptions}
          onChange={onPriceChange}
          openId={openId}
          setOpenId={setOpenId}
        />
      </div>

      <div className="mt-4 space-y-2">
        <DesktopDropdown
          id="rating-filter"
          label="Minimum Rating"
          value={selectedRating}
          options={ratingOptions}
          onChange={onRatingChange}
          openId={openId}
          setOpenId={setOpenId}
        />
      </div>
    </aside>
  );
}
