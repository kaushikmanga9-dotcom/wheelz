import { SlidersHorizontal } from "lucide-react";
import { fuelOptions, ownershipOptions, transmissionOptions } from "@/lib/filters";

const bodyTypes = ["Hatchback", "Sedan", "SUV", "EV"];
const budgets = ["Under Rs 8L", "Rs 8L - Rs 12L", "Rs 12L - Rs 18L", "Rs 18L+"];

export function FilterPanel({ framed = true }: { framed?: boolean }) {
  return (
    <aside className={framed ? "rounded-card border border-line bg-white p-5 shadow-card" : "p-1"}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase text-muted">Filters</p>
          <h2 className="mt-1 text-xl font-black">Refine deals</h2>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-card bg-soft text-brand-blue">
          <SlidersHorizontal size={20} />
        </span>
      </div>

      <div className="mt-6 space-y-6">
        <FilterGroup title="Budget" items={budgets} />
        <FilterGroup title="Fuel" items={fuelOptions} />
        <FilterGroup title="Transmission" items={transmissionOptions} />
        <FilterGroup title="Ownership" items={ownershipOptions} />
        <FilterGroup title="Body type" items={bodyTypes} />

        <div>
          <div className="mb-3 flex items-center justify-between text-sm font-extrabold">
            <span>Value score</span>
            <span className="text-brand-blue">80+</span>
          </div>
          <input className="w-full accent-brand-blue" type="range" min="60" max="100" defaultValue="80" />
        </div>
      </div>
    </aside>
  );
}

function FilterGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-black">{title}</legend>
      <div className="grid gap-2">
        {items.map((item) => (
          <label key={item} className="flex items-center gap-3 text-sm font-bold text-slate-700">
            <input type="checkbox" className="h-4 w-4 rounded border-line accent-brand-blue" />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
