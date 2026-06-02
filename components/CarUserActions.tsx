import { Bell, Heart } from "lucide-react";
import { createPriceAlertFormAction, saveCarFormAction } from "@/lib/supabase/user-actions";

type CarUserActionsProps = {
  carId: string;
  price: number;
};

export function CarUserActions({ carId, price }: CarUserActionsProps) {
  const defaultTarget = Math.max(1, Math.round(price * 0.96));

  return (
    <div className="mt-6 grid gap-3">
      <form action={saveCarFormAction}>
        <input name="carId" type="hidden" value={carId} />
        <button className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-card border border-ink font-black">
          <Heart size={18} />
          Save car
        </button>
      </form>

      <form action={createPriceAlertFormAction} className="grid gap-2 rounded-card bg-soft p-3">
        <input name="carId" type="hidden" value={carId} />
        <label className="grid gap-2 text-sm font-black">
          Price alert target
          <input
            className="h-11 rounded-card border border-line bg-white px-3 font-bold outline-none"
            min="1"
            name="targetPrice"
            required
            type="number"
            defaultValue={defaultTarget}
          />
        </label>
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-card bg-brand-black font-black text-white">
          <Bell size={17} />
          Create alert
        </button>
      </form>
    </div>
  );
}
