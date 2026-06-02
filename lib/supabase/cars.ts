import { cars as mockCars, type Car } from "@/lib/cars";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CarRow } from "@/lib/supabase/types";

export type CarFilters = {
  brand?: string;
  model?: string;
  city?: string;
  fuel?: Car["fuel"][];
  transmission?: Car["transmission"][];
  ownership?: Car["ownership"][];
  bodyType?: Car["bodyType"][];
  minPrice?: number;
  maxPrice?: number;
  minValueScore?: number;
  sortBy?: "price_asc" | "price_desc" | "value_score" | "mileage" | "newest";
};

export function mapCarRow(row: CarRow): Car {
  return {
    id: row.id,
    brand: row.brand,
    model: row.model,
    variant: row.variant,
    year: row.year,
    price: row.price,
    location: row.location,
    mileage: row.mileage,
    fuel: row.fuel,
    transmission: row.transmission,
    ownership: row.ownership,
    valueScore: row.value_score,
    marketDelta: row.market_delta,
    added: row.added_label,
    bodyType: row.body_type,
    color: row.color,
    sourcePlatform: row.source_platform,
    sourceListingUrl: row.source_listing_url,
    dealerName: row.dealer_name,
    insuranceValid: row.insurance_valid,
    serviceHistory: row.service_history,
    accidentHistory: row.accident_history,
    imageUrls: row.image_urls,
    priceDropped: row.price_dropped,
    imagePosition: row.image_position,
    highlights: row.highlights,
    inspection: row.inspection
  };
}

export async function fetchCars(filters: CarFilters = {}) {
  if (!hasSupabaseEnv) {
    return filterCars(mockCars, filters);
  }

  const supabase = createSupabaseServerClient();
  let query = supabase.from("cars").select("*");

  if (filters.brand && filters.brand !== "Any brand") query = query.eq("brand", filters.brand);
  if (filters.model && filters.model !== "Any model") query = query.eq("model", filters.model);
  if (filters.city) query = query.eq("location", filters.city);
  if (filters.fuel?.length) query = query.in("fuel", filters.fuel);
  if (filters.transmission?.length) query = query.in("transmission", filters.transmission);
  if (filters.ownership?.length) query = query.in("ownership", filters.ownership);
  if (filters.bodyType?.length) query = query.in("body_type", filters.bodyType);
  if (filters.minPrice) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice) query = query.lte("price", filters.maxPrice);
  if (filters.minValueScore) query = query.gte("value_score", filters.minValueScore);

  query = applySupabaseSort(query, filters.sortBy);

  const { data, error } = await query;

  if (error) {
    throw new Error(`Unable to fetch cars: ${error.message}`);
  }

  return (data ?? []).map(mapCarRow);
}

export function filterCars(sourceCars: Car[], filters: CarFilters = {}) {
  const filtered = sourceCars.filter((car) => {
    if (filters.brand && filters.brand !== "Any brand" && car.brand !== filters.brand) return false;
    if (filters.model && filters.model !== "Any model" && car.model !== filters.model) return false;
    if (filters.city && car.location !== filters.city) return false;
    if (filters.fuel?.length && !filters.fuel.includes(car.fuel)) return false;
    if (filters.transmission?.length && !filters.transmission.includes(car.transmission)) return false;
    if (filters.ownership?.length && !filters.ownership.includes(car.ownership)) return false;
    if (filters.bodyType?.length && !filters.bodyType.includes(car.bodyType)) return false;
    if (filters.minPrice && car.price < filters.minPrice) return false;
    if (filters.maxPrice && car.price > filters.maxPrice) return false;
    if (filters.minValueScore && car.valueScore < filters.minValueScore) return false;

    return true;
  });

  return sortCars(filtered, filters.sortBy);
}

export async function fetchCarById(id: string) {
  if (!hasSupabaseEnv) {
    return mockCars.find((car) => car.id === id) ?? null;
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("cars").select("*").eq("id", id).maybeSingle();

  if (error) {
    throw new Error(`Unable to fetch car: ${error.message}`);
  }

  return data ? mapCarRow(data) : null;
}

function sortCars(sourceCars: Car[], sortBy: CarFilters["sortBy"] = "value_score") {
  return [...sourceCars].sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "mileage") return a.mileage - b.mileage;
    if (sortBy === "newest") return b.year - a.year;
    return b.valueScore - a.valueScore;
  });
}

function applySupabaseSort<TQuery extends { order: (column: string, options?: { ascending?: boolean }) => TQuery }>(
  query: TQuery,
  sortBy: CarFilters["sortBy"] = "value_score"
) {
  if (sortBy === "price_asc") return query.order("price", { ascending: true });
  if (sortBy === "price_desc") return query.order("price", { ascending: false });
  if (sortBy === "mileage") return query.order("mileage", { ascending: true });
  if (sortBy === "newest") return query.order("created_at", { ascending: false });
  return query.order("value_score", { ascending: false });
}
