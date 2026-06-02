import Link from "next/link";
import { Search } from "lucide-react";
import { brands, budgets, cities, models } from "@/lib/filters";

type SearchBarProps = {
  compact?: boolean;
};

export function SearchBar({ compact = false }: SearchBarProps) {
  const fieldClass =
    "grid min-h-[66px] content-center gap-1 rounded-card border border-line bg-white px-4 text-ink";

  return (
    <form className="rounded-card border border-line bg-white/95 p-2 shadow-premium backdrop-blur" action="/search">
      <div className={`grid gap-2 ${compact ? "lg:grid-cols-[1fr_1fr_1fr_auto]" : "lg:grid-cols-[1fr_1fr_0.9fr_0.9fr_auto]"}`}>
        <label className={fieldClass}>
          <span className="text-[0.72rem] font-black uppercase text-muted">Brand</span>
          <select name="brand" className="w-full bg-transparent font-extrabold outline-none">
            {brands.map((brand) => (
              <option key={brand}>{brand}</option>
            ))}
          </select>
        </label>

        <label className={fieldClass}>
          <span className="text-[0.72rem] font-black uppercase text-muted">Model</span>
          <select name="model" className="w-full bg-transparent font-extrabold outline-none">
            {models.map((model) => (
              <option key={model}>{model}</option>
            ))}
          </select>
        </label>

        <label className={fieldClass}>
          <span className="text-[0.72rem] font-black uppercase text-muted">Budget</span>
          <select name="budget" className="w-full bg-transparent font-extrabold outline-none">
            {budgets.map((budget) => (
              <option key={budget}>{budget}</option>
            ))}
          </select>
        </label>

        {!compact && (
          <label className={fieldClass}>
            <span className="text-[0.72rem] font-black uppercase text-muted">City</span>
            <select name="city" className="w-full bg-transparent font-extrabold outline-none">
              {cities.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
          </label>
        )}

        <button className="inline-flex min-h-[58px] items-center justify-center gap-2 rounded-card bg-brand-blue px-5 font-black text-white shadow-[0_14px_28px_rgba(7,93,245,0.23)] lg:min-h-[66px]">
          <Search size={19} />
          Search
        </button>
      </div>
    </form>
  );
}

export function PopularSearches() {
  const searches = [
    "SUVs under Rs 10L",
    "Automatic hatchbacks",
    "Diesel 7-seaters",
    "Low km sedans",
    "Single-owner cars",
    "EVs under Rs 15L"
  ];

  return (
    <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-2">
      {searches.map((item) => (
        <Link
          key={item}
          href="/search"
          className="min-w-max rounded-full border border-line bg-white px-4 py-2 text-sm font-extrabold text-ink shadow-sm"
        >
          {item}
        </Link>
      ))}
    </div>
  );
}
