import type { Metadata } from "next";
import Link from "next/link";
import { Bell, Heart, Search } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { CarCard } from "@/components/CarCard";
import { Footer } from "@/components/Footer";
import { fetchCars } from "@/lib/supabase/cars";

export const metadata: Metadata = {
  title: "Saved Cars",
  description: "Review saved used cars and prepare price alerts for your shortlist."
};

export default async function SavedCarsPage() {
  const savedCars = (await fetchCars({ sortBy: "value_score" })).slice(0, 4);

  return (
    <div className="min-h-screen bg-soft">
      <AppHeader />
      <main className="page-wrap py-6 md:py-8">
        <section className="grid gap-4 rounded-card bg-white p-5 shadow-card md:grid-cols-[1fr_auto] md:items-center md:p-7">
          <div>
            <p className="text-sm font-black uppercase text-brand-blue">Saved cars</p>
            <h1 className="mt-2 text-3xl font-black md:text-5xl">Your shortlist</h1>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-muted">
              Mock saved state for cars you want to revisit, compare, or watch for price drops.
            </p>
          </div>
          <Link
            href="/search"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-card bg-brand-blue px-5 font-black text-white"
          >
            <Search size={18} />
            Find more
          </Link>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-4">
            {savedCars.map((car) => (
              <CarCard key={car.id} car={car} compact />
            ))}
          </div>

          <aside className="h-fit rounded-card border border-line bg-white p-5 shadow-card">
            <span className="grid h-11 w-11 place-items-center rounded-card bg-red-50 text-red-600">
              <Heart size={21} />
            </span>
            <h2 className="mt-4 text-xl font-black">Price watch</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-muted">
              Alerts are mocked for now. When backend is added, this panel can subscribe to inventory changes.
            </p>
            <button className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-card border border-line font-black">
              <Bell size={17} />
              Enable alerts
            </button>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}
