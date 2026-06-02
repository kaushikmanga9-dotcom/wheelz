"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function saveCarForCurrentUser(carId: string) {
  if (!hasSupabaseEnv) {
    redirect("/login?error=Add%20Supabase%20environment%20variables%20before%20saving%20cars");
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in to save a car.");
  }

  const { error } = await supabase.from("saved_cars").upsert(
    {
      user_id: user.id,
      car_id: carId
    },
    { onConflict: "user_id,car_id" }
  );

  if (error) {
    throw new Error(`Unable to save car: ${error.message}`);
  }

  revalidatePath("/saved");
}

export async function createPriceAlert(carId: string, targetPrice: number) {
  if (!hasSupabaseEnv) {
    redirect("/login?error=Add%20Supabase%20environment%20variables%20before%20creating%20price%20alerts");
  }

  if (!Number.isFinite(targetPrice) || targetPrice <= 0) {
    throw new Error("Target price must be greater than zero.");
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in to create a price alert.");
  }

  const { error } = await supabase.from("price_alerts").insert({
    user_id: user.id,
    car_id: carId,
    target_price: targetPrice,
    is_active: true
  });

  if (error) {
    throw new Error(`Unable to create price alert: ${error.message}`);
  }

  revalidatePath("/saved");
}

export async function saveCarFormAction(formData: FormData) {
  const carId = String(formData.get("carId") ?? "");

  if (!carId) {
    throw new Error("Missing car id.");
  }

  await saveCarForCurrentUser(carId);
  redirect(`/cars/${carId}?saved=1`);
}

export async function createPriceAlertFormAction(formData: FormData) {
  const carId = String(formData.get("carId") ?? "");
  const targetPrice = Number(formData.get("targetPrice"));

  if (!carId) {
    throw new Error("Missing car id.");
  }

  await createPriceAlert(carId, targetPrice);
  redirect(`/cars/${carId}?alert=1`);
}
