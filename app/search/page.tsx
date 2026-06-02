import type { Metadata } from "next";
import { AppHeader } from "@/components/AppHeader";
import { FilterPanel } from "@/components/FilterPanel";
import { Footer } from "@/components/Footer";
import { MobileFilterDrawer } from "@/components/MobileFilterDrawer";
import { SearchBar } from "@/components/SearchBar";
import { SearchResultsPanel } from "@/components/SearchResultsPanel";
import { fetchCars, type CarFilters } from "@/lib/supabase/cars";

export const metadata: Metadata = {
  title: "Search Used Cars",
  description: "Filter and sort used cars by brand, model, city, budget, value score, mileage, fuel, and ownership."
};

type SearchResultsPageProps = {
  searchParams?: {
    brand?: string;
    model?: string;
    city?: string;
    sort?: CarFilters["sortBy"];
  };
};

export default async function SearchResultsPage({ searchParams }: SearchResultsPageProps) {
  const cars = await fetchCars({
    brand: searchParams?.brand,
    model: searchParams?.model,
    city: searchParams?.city,
    sortBy: searchParams?.sort ?? "value_score"
  });

  return (
    <div className="min-h-screen bg-soft pb-20 md:pb-0">
      <AppHeader />
      <main className="page-wrap py-6 md:py-8">
        <div className="sticky top-16 z-20 rounded-card bg-brand-black p-4 text-white shadow-premium md:p-6">
          <p className="text-sm font-black uppercase text-blue-200">Search used cars</p>
          <h1 className="mt-2 text-3xl font-black md:text-5xl">Compare the strongest deals first</h1>
          <div className="mt-5">
            <SearchBar />
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="hidden lg:sticky lg:top-[292px] lg:block lg:self-start">
            <FilterPanel />
          </div>

          <SearchResultsPanel cars={cars} />
        </div>
      </main>
      <MobileFilterDrawer />
      <Footer />
    </div>
  );
}
