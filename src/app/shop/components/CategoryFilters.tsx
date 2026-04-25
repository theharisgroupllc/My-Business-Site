"use client";

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
  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-navy">Filters</h3>

      <div className="mt-4 space-y-2">
        <label htmlFor="category-filter" className="text-xs font-medium text-slate-600">
          Category
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 space-y-2">
        <label htmlFor="price-filter" className="text-xs font-medium text-slate-600">
          Price Range
        </label>
        <select
          id="price-filter"
          value={selectedPrice}
          onChange={(event) => onPriceChange(event.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="all">All prices</option>
          <option value="budget">${minPrice} - ${(minPrice + maxPrice) / 2}</option>
          <option value="premium">${Math.floor((minPrice + maxPrice) / 2)} - ${maxPrice}</option>
        </select>
      </div>

      <div className="mt-4 space-y-2">
        <label htmlFor="rating-filter" className="text-xs font-medium text-slate-600">
          Minimum Rating
        </label>
        <select
          id="rating-filter"
          value={selectedRating}
          onChange={(event) => onRatingChange(event.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="0">All ratings</option>
          <option value="4">4.0 and above</option>
          <option value="4.3">4.3 and above</option>
          <option value="4.5">4.5 and above</option>
        </select>
      </div>
    </aside>
  );
}
