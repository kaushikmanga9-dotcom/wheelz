import { ArrowDownUp } from "lucide-react";
import { sortOptions } from "@/lib/filters";

export function SortBar({ count }: { count: number }) {
  return (
    <div className="flex flex-col gap-3 rounded-card border border-line bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-black">{count} cars found</p>
        <p className="text-xs font-bold text-muted">Mock results matching your search</p>
      </div>
      <label className="flex h-11 items-center gap-2 rounded-card border border-line bg-soft px-3 text-sm font-extrabold">
        <ArrowDownUp size={17} />
        <select className="bg-transparent outline-none">
          {sortOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
