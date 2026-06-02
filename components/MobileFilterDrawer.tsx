"use client";

import { useState } from "react";
import { ArrowDownUp, SlidersHorizontal, X } from "lucide-react";
import { FilterPanel } from "@/components/FilterPanel";
import { sortOptions } from "@/lib/filters";

export function MobileFilterDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 p-3 shadow-[0_-18px_50px_rgba(7,17,31,0.12)] backdrop-blur md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-card bg-brand-black font-black text-white"
        >
          <SlidersHorizontal size={19} />
          Filters and sort
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button className="absolute inset-0 bg-ink/50" aria-label="Close filters" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[86vh] overflow-y-auto rounded-t-2xl bg-white p-4 shadow-premium">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-black">Filters</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full bg-soft"
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>
            <label className="mb-5 flex h-12 items-center gap-2 rounded-card border border-line bg-soft px-3 text-sm font-extrabold">
              <ArrowDownUp size={17} />
              <select className="w-full bg-transparent outline-none">
                {sortOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <FilterPanel framed={false} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-5 h-12 w-full rounded-card bg-brand-blue font-black text-white"
            >
              Show cars
            </button>
          </div>
        </div>
      )}
    </>
  );
}
