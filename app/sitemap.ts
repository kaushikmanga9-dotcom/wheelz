import type { MetadataRoute } from "next";
import { fetchCars } from "@/lib/supabase/cars";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const cars = await fetchCars({ sortBy: "value_score" });
  const now = new Date();

  const staticRoutes = ["", "/search", "/compare", "/saved", "/login"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7
  }));

  const carRoutes = cars.map((car) => ({
    url: `${siteUrl}/cars/${car.id}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.8
  }));

  return [...staticRoutes, ...carRoutes];
}
