"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { calculateValueScore } from "@/lib/value-score";
import type { Car } from "@/lib/cars";

export async function createUsedCarListing(formData: FormData): Promise<void> {
  if (!hasSupabaseEnv) {
    redirectWithError("Add Supabase environment variables before creating listings.");
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirectWithError("You must be logged in as an admin to add listings.");
  }

  if (user.app_metadata?.role !== "admin") {
    redirectWithError("Your account is not marked as an admin in Supabase app_metadata.");
  }

  const brand = readText(formData, "brand");
  const model = readText(formData, "model");
  const variant = readText(formData, "variant");
  const year = readNumber(formData, "year");
  const price = readNumber(formData, "price");
  const city = readText(formData, "city");
  const kilometersDriven = readNumber(formData, "kilometersDriven");
  const fuel = readText(formData, "fuelType") as Car["fuel"];
  const transmission = readText(formData, "transmission") as Car["transmission"];
  const ownerNumber = readNumber(formData, "ownerNumber");
  const insuranceValid = readText(formData, "insuranceValid") === "yes";
  const serviceHistory = readText(formData, "serviceHistory") as Car["serviceHistory"];
  const accidentHistory = readText(formData, "accidentHistory") as Car["accidentHistory"];
  const sourcePlatform = readText(formData, "sourcePlatform");
  const sourceUrl = readText(formData, "sourceUrl");
  const dealerName = readText(formData, "dealerName");

  const validationError = validateListing({
    brand,
    model,
    variant,
    year,
    price,
    city,
    kilometersDriven,
    sourceUrl,
    ownerNumber
  });

  if (validationError) {
    redirectWithError(validationError);
  }

  const marketAveragePrice = await estimateMarketAveragePrice({ brand, model, city, price });
  const carAgeYears = Math.max(0, new Date().getFullYear() - year);
  const valueResult = calculateValueScore({
    listedPrice: price,
    marketAveragePrice,
    kilometersDriven,
    carAgeYears,
    numberOfOwners: ownerNumber,
    fuelType: fuel,
    transmission,
    accidentHistory,
    serviceHistory,
    cityDemand: ["Bengaluru", "Mumbai", "Delhi NCR", "Pune"].includes(city) ? "high" : "medium"
  });

  const id = createListingId([brand, model, variant, String(year)]);
  const imageResult = await uploadImages(formData, id);

  if (imageResult.error) {
    redirectWithError(imageResult.error);
  }

  const imageUrls = imageResult.urls;
  const ownership = toOwnership(ownerNumber);
  const highlights = buildHighlights({ insuranceValid, serviceHistory, accidentHistory });
  const inspection = buildInspection({ insuranceValid, serviceHistory, accidentHistory });

  const { error } = await supabase.from("cars").insert({
    id,
    brand,
    model,
    variant,
    year,
    price,
    location: city,
    mileage: kilometersDriven,
    fuel,
    transmission,
    ownership,
    value_score: valueResult.score,
    market_delta: price - marketAveragePrice,
    added_label: "Just added",
    body_type: inferBodyType(model),
    color: "White",
    source_platform: sourcePlatform,
    source_listing_url: sourceUrl,
    dealer_name: dealerName,
    insurance_valid: insuranceValid,
    service_history: serviceHistory,
    accident_history: accidentHistory,
    image_urls: imageUrls,
    price_dropped: false,
    image_position: "50% 62%",
    highlights,
    inspection
  });

  if (error) {
    redirectWithError(`Unable to create listing: ${error.message}`);
  }

  revalidatePath("/search");
  revalidatePath("/compare");
  redirect(`/cars/${id}`);
}

async function estimateMarketAveragePrice({
  brand,
  model,
  city,
  price
}: {
  brand: string;
  model: string;
  city: string;
  price: number;
}) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("cars")
    .select("price")
    .eq("brand", brand)
    .eq("model", model)
    .eq("location", city)
    .limit(20);

  const prices = (data ?? []).map((row) => row.price).filter((value) => Number.isFinite(value));

  if (prices.length === 0) {
    return Math.round(price * 1.04);
  }

  return Math.round(prices.reduce((sum, value) => sum + value, 0) / prices.length);
}

async function uploadImages(formData: FormData, carId: string): Promise<{ urls: string[]; error?: string }> {
  const supabase = createSupabaseServerClient();
  const files = formData
    .getAll("images")
    .filter((item): item is File => item instanceof File && item.size > 0)
    .slice(0, 8);

  const urls: string[] = [];

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${carId}/${Date.now()}-${index}.${extension}`;
    const { error } = await supabase.storage.from("car-images").upload(path, file, {
      contentType: file.type || "image/jpeg",
      upsert: false
    });

    if (error) {
      return { urls, error: `Unable to upload image ${file.name}: ${error.message}` };
    }

    const { data } = supabase.storage.from("car-images").getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return { urls };
}

function redirectWithError(message: string): never {
  redirect(`/admin?error=${encodeURIComponent(message)}`);
}

function validateListing(input: {
  brand: string;
  model: string;
  variant: string;
  year: number;
  price: number;
  city: string;
  kilometersDriven: number;
  sourceUrl: string;
  ownerNumber: number;
}) {
  if (!input.brand || !input.model || !input.variant || !input.city) return "Brand, model, variant, and city are required.";
  if (input.year < 1980 || input.year > new Date().getFullYear() + 1) return "Year is outside the allowed range.";
  if (input.price <= 0) return "Price must be greater than zero.";
  if (input.kilometersDriven < 0) return "Kilometers driven cannot be negative.";
  if (input.ownerNumber < 1) return "Owner number must be at least 1.";

  try {
    new URL(input.sourceUrl);
  } catch {
    return "Source URL must be a valid URL.";
  }

  return null;
}

function readText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function readNumber(formData: FormData, key: string) {
  return Number(formData.get(key));
}

function createListingId(parts: string[]) {
  const slug = parts
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${slug}-${Date.now()}`;
}

function toOwnership(ownerNumber: number): Car["ownership"] {
  if (ownerNumber <= 1) return "1st owner";
  if (ownerNumber === 2) return "2nd owner";
  if (ownerNumber === 3) return "3rd owner";
  return "4th+ owner";
}

function inferBodyType(model: string): Car["bodyType"] {
  const normalized = model.toLowerCase();
  if (["seltos", "nexon", "creta", "xuv", "harrier"].some((term) => normalized.includes(term))) return "SUV";
  if (["baleno", "i20", "swift", "alto"].some((term) => normalized.includes(term))) return "Hatchback";
  return "Sedan";
}

function buildHighlights({
  insuranceValid,
  serviceHistory,
  accidentHistory
}: {
  insuranceValid: boolean;
  serviceHistory: Car["serviceHistory"];
  accidentHistory: Car["accidentHistory"];
}) {
  return [
    insuranceValid ? "Insurance valid" : "Insurance needs renewal",
    serviceHistory === "full"
      ? "Full service history"
      : serviceHistory === "partial"
        ? "Partial service history"
        : "Service history not listed",
    accidentHistory === "none"
      ? "No accident record"
      : accidentHistory === "minor"
        ? "Minor accident history"
        : "Major accident history"
  ];
}

function buildInspection({
  insuranceValid,
  serviceHistory,
  accidentHistory
}: {
  insuranceValid: boolean;
  serviceHistory: Car["serviceHistory"];
  accidentHistory: Car["accidentHistory"];
}) {
  return {
    engine: serviceHistory === "full" ? 92 : serviceHistory === "partial" ? 84 : 72,
    exterior: accidentHistory === "none" ? 90 : accidentHistory === "minor" ? 76 : 55,
    tyres: 82,
    documents: insuranceValid ? 98 : 72
  };
}
