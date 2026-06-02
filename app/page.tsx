import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { CarCard } from "@/components/CarCard";
import { Footer } from "@/components/Footer";
import { PopularSearches, SearchBar } from "@/components/SearchBar";
import { fetchCars } from "@/lib/supabase/cars";

const trustItems = [
  { icon: ShieldCheck, title: "Verified cars", text: "Documents, ownership, and inspection checks shown upfront." },
  { icon: BadgeCheck, title: "Fair-price ranking", text: "Every listing is compared with similar cars in the same market." },
  { icon: Sparkles, title: "Clean comparison", text: "Shortlists, scorecards, and side-by-side specs with no backend yet." }
];

export default async function HomePage() {
  const cars = await fetchCars({ sortBy: "value_score" });

  return (
    <div className="min-h-screen bg-white">
      <AppHeader />
      <main>
        <section className="relative isolate grid min-h-[84vh] items-end overflow-hidden py-8 md:items-center md:py-16">
          <Image
            src="/images/hero-cars.svg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover object-[61%_center] md:object-center"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.2),#fff_90%),linear-gradient(90deg,#fff_0%,rgba(255,255,255,0.96)_38%,rgba(255,255,255,0.08)_100%)]" />
          <div className="page-wrap">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-black text-brand-navy backdrop-blur">
                Used-car comparison, ranked by real value
              </span>
              <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[0.96] tracking-normal text-ink md:text-7xl">
                Find the best used car deal
              </h1>
              <p className="mt-5 max-w-xl text-base font-medium leading-7 text-slate-700 md:text-lg">
                Search like Skyscanner, compare like a premium car marketplace, and shortlist cars by price,
                mileage, condition, ownership, and value score.
              </p>
            </div>

            <div className="mt-8 max-w-5xl">
              <SearchBar />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {["No hidden fees", "Inspection reports", "Compare up to 4 cars"].map((item) => (
                <span key={item} className="rounded-full border border-line bg-white/85 px-4 py-2 text-sm font-black">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="page-wrap">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black md:text-4xl">Popular searches</h2>
                <p className="mt-2 text-sm font-semibold text-muted">Quick routes into high-intent comparisons.</p>
              </div>
              <Link href="/search" className="hidden text-sm font-black text-brand-blue md:inline-flex">
                View all
              </Link>
            </div>
            <PopularSearches />
          </div>
        </section>

        <section className="border-y border-line bg-soft py-12">
          <div className="page-wrap">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black md:text-4xl">Best value cars</h2>
                <p className="mt-2 text-sm font-semibold text-muted">Top mock listings by deal strength.</p>
              </div>
              <Link href="/search" className="hidden items-center gap-2 text-sm font-black text-brand-blue md:inline-flex">
                Search results <ArrowRight size={17} />
              </Link>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {cars.slice(0, 3).map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="page-wrap grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="rounded-card bg-brand-black p-6 text-white shadow-premium md:p-8">
              <div className="grid h-24 w-24 place-items-center rounded-card bg-white text-3xl font-black text-emerald-700">
                94
              </div>
              <h2 className="mt-6 text-3xl font-black md:text-5xl">How value score works</h2>
              <p className="mt-4 leading-7 text-slate-300">
                Wheelz scores each mock listing against comparable cars, then adjusts for mileage,
                ownership, inspection health, price gap, and seller trust.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {trustItems.map((item) => (
                <article key={item.title} className="rounded-card border border-line bg-white p-5 shadow-card">
                  <span className="grid h-11 w-11 place-items-center rounded-card bg-blue-50 text-brand-blue">
                    <item.icon size={21} />
                  </span>
                  <h3 className="mt-4 font-black">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
