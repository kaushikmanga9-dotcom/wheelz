"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDownUp, Grid2X2, List, SearchX } from "lucide-react";
import { CarCard } from "@/components/CarCard";
import { formatPrice, type Car } from "@/lib/cars";

type SearchResultsPanelProps = {
  cars: Car[];
};

type SortValue = "value_score" | "price_asc" | "price_desc" | "mileage" | "newest";
type ViewMode = "grid" | "list";

const sortLabels: Record<SortValue, string> = {
  value_score: "Value score",
  price_asc: "Price: low to high",
  price_desc: "Price: high to low",
  mileage: "Mileage",
  newest: "Newest"
};

export function SearchResultsPanel({ cars }: SearchResultsPanelProps) {
  const [sortBy, setSortBy] = useState<SortValue>("value_score");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const sortedCars = useMemo(() => sortCars(cars, sortBy), [cars, sortBy]);
  const bestPrice = sortedCars.length ? Math.min(...sortedCars.map((car) => car.price)) : null;

  return (
    <div className="space-y-4">
      <div className="rounded-card border border-line bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-black">{sortedCars.length} cars found</p>
            <p className="text-xs font-bold text-muted">
              {bestPrice ? `Best starting price ${formatPrice(bestPrice)}` : "Try adjusting your filters"}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="flex h-11 items-center gap-2 rounded-card border border-line bg-soft px-3 text-sm font-extrabold">
              <ArrowDownUp size={17} />
              <select
                className="min-w-0 bg-transparent outline-none"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortValue)}
              >
                {Object.entries(sortLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 rounded-card border border-line bg-soft p-1">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-black ${
                  viewMode === "list" ? "bg-white text-ink shadow-sm" : "text-muted"
                }`}
              >
                <List size={16} />
                List
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-black ${
                  viewMode === "grid" ? "bg-white text-ink shadow-sm" : "text-muted"
                }`}
              >
                <Grid2X2 size={16} />
                Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      {sortedCars.length === 0 ? (
        <EmptyState />
      ) : (
        <div className={viewMode === "grid" ? "grid gap-4 xl:grid-cols-2" : "grid gap-4"}>
          {sortedCars.map((car) => (
            <CarCard key={car.id} car={car} layout={viewMode} />
          ))}
        </div>
      )}
    </div>
  );
}

function sortCars(cars: Car[], sortBy: SortValue) {
  return [...cars].sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "mileage") return a.mileage - b.mileage;
    if (sortBy === "newest") return b.year - a.year;
    return b.valueScore - a.valueScore;
  });
}

function EmptyState() {
  return (
    <div className="grid min-h-[420px] place-items-center rounded-card border border-dashed border-line bg-white p-8 text-center shadow-sm">
      <div>
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-card bg-soft text-brand-blue">
          <SearchX size={25} />
        </span>
        <h2 className="mt-5 text-2xl font-black">No cars match these filters</h2>
        <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-muted">
          Try expanding your budget, changing the city, or removing a few filters to see more listings.
        </p>
        <Link href="/search" className="mt-5 inline-flex rounded-full bg-brand-blue px-5 py-3 text-sm font-black text-white">
          Reset search
        </Link>
      </div>
    </div>
  );
}
