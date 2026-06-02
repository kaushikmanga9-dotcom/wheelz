import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Award,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  Gauge,
  GitCompare,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Footer } from "@/components/Footer";
import { formatKm, formatPrice, type Car } from "@/lib/cars";
import { fetchCars } from "@/lib/supabase/cars";

export const metadata: Metadata = {
  title: "Compare Cars",
  description: "Compare up to four used cars side by side across price, value score, mileage, ownership, history, and seller trust."
};

type ComparePageProps = {
  searchParams?: {
    car?: string | string[];
  };
};

type CompareMetric = {
  key: string;
  label: string;
  value: (car: Car) => string;
  best: (cars: Car[]) => Set<string>;
};

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const allCars = await fetchCars({ sortBy: "value_score" });
  const selectedIds = normalizeSelectedIds(searchParams?.car);
  const compared = selectComparedCars(allCars, selectedIds);
  const recommendation = getRecommendation(compared);
  const rows = getRows();

  return (
    <div className="min-h-screen bg-soft">
      <AppHeader />
      <main className="page-wrap py-6 md:py-8">
        <section className="rounded-card bg-white p-5 shadow-card md:p-7">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-black uppercase text-brand-blue">
                <GitCompare size={18} />
                Compare cars
              </p>
              <h1 className="mt-2 text-3xl font-black md:text-5xl">Compare up to 4 cars side by side</h1>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-muted">
                Compare price, value, ownership, history, and seller signals. Best values in each row are highlighted.
              </p>
            </div>
            <Link
              href="/search"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-card bg-brand-blue px-5 font-black text-white"
            >
              <Plus size={18} />
              Add car
            </Link>
          </div>
        </section>

        <RecommendationCard cars={compared} recommendation={recommendation} />

        <section className="mt-6 overflow-x-auto rounded-card border border-line bg-white shadow-card">
          <div
            className="grid min-w-[980px]"
            style={{ gridTemplateColumns: `190px repeat(${compared.length}, minmax(190px, 1fr))` }}
          >
            <div className="sticky left-0 z-10 border-b border-r border-line bg-soft p-4 font-black">Cars</div>
            {compared.map((car) => (
              <div key={car.id} className="border-b border-r border-line bg-white p-4 last:border-r-0">
                <div className="relative h-32 overflow-hidden rounded-card bg-slate-100">
                  <Image
                    src={car.imageUrls[0] ?? "/images/hero-cars.svg"}
                    alt={`${car.brand} ${car.model}`}
                    fill
                    sizes="240px"
                    className="scale-110 object-cover"
                    style={{ objectPosition: car.imagePosition }}
                  />
                  {recommendation.id === car.id && (
                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">
                      <Award size={13} />
                      Best overall
                    </span>
                  )}
                </div>
                <h2 className="mt-3 font-black">
                  {car.brand} {car.model}
                </h2>
                <p className="text-sm font-bold text-muted">{car.variant}</p>
                <Link
                  href={`/cars/${car.id}`}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-black text-brand-blue"
                >
                  View details
                  <ChevronRight size={16} />
                </Link>
              </div>
            ))}

            {rows.map((row) => {
              const bestIds = row.best(compared);

              return (
                <div key={row.key} className="contents">
                  <div className="sticky left-0 z-10 border-b border-r border-line bg-soft p-4 text-sm font-black">
                    {row.label}
                  </div>
                  {compared.map((car) => {
                    const isBest = bestIds.has(car.id);

                    return (
                      <div
                        key={`${car.id}-${row.key}`}
                        className={`border-b border-r border-line p-4 text-sm font-bold last:border-r-0 ${
                          isBest ? "bg-emerald-50 text-emerald-900" : "bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span>{row.value(car)}</span>
                          {isBest && (
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-2 py-1 text-[0.68rem] font-black text-emerald-700">
                              <CheckCircle2 size={13} />
                              Best
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-5 rounded-card border border-line bg-white p-5 shadow-card md:hidden">
          <div className="flex items-center gap-2 text-sm font-black text-muted">
            <Minus size={16} />
            Swipe horizontally to compare every field.
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function RecommendationCard({ cars, recommendation }: { cars: Car[]; recommendation: ReturnType<typeof getRecommendation> }) {
  const car = cars.find((item) => item.id === recommendation.id) ?? cars[0];

  return (
    <section className="mt-6 rounded-card border border-emerald-100 bg-white p-5 shadow-premium md:p-6">
      <div className="grid gap-5 lg:grid-cols-[1fr_320px] lg:items-center">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-black uppercase text-emerald-700">
            <Sparkles size={18} />
            Final recommendation
          </p>
          <h2 className="mt-2 text-2xl font-black md:text-4xl">
            {car.brand} {car.model} is the best overall choice
          </h2>
          <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-muted">{recommendation.reason}</p>
        </div>
        <div className="grid grid-cols-3 gap-2 rounded-card bg-soft p-3 text-center">
          <SummaryStat label="Score" value={`${car.valueScore}/100`} />
          <SummaryStat label="Price" value={formatPrice(car.price)} />
          <SummaryStat label="KM" value={formatKm(car.mileage)} />
        </div>
      </div>
    </section>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card bg-white p-3">
      <p className="text-sm font-black">{value}</p>
      <p className="mt-1 text-[0.68rem] font-black uppercase text-muted">{label}</p>
    </div>
  );
}

function normalizeSelectedIds(carParam: string | string[] | undefined) {
  if (!carParam) return [];
  return (Array.isArray(carParam) ? carParam : [carParam])
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 4);
}

function selectComparedCars(allCars: Car[], selectedIds: string[]) {
  const selectedCars = selectedIds.map((id) => allCars.find((car) => car.id === id)).filter(Boolean) as Car[];
  const fallbackCars = allCars.filter((car) => !selectedCars.some((selected) => selected.id === car.id));

  return [...selectedCars, ...fallbackCars].slice(0, 4);
}

function getRows(): CompareMetric[] {
  return [
    { key: "price", label: "Price", value: (car) => formatPrice(car.price), best: lowest((car) => car.price) },
    { key: "value", label: "Value score", value: (car) => `${car.valueScore}/100`, best: highest((car) => car.valueScore) },
    { key: "year", label: "Year", value: (car) => String(car.year), best: highest((car) => car.year) },
    { key: "km", label: "Kilometers driven", value: (car) => formatKm(car.mileage), best: lowest((car) => car.mileage) },
    { key: "fuel", label: "Fuel type", value: (car) => car.fuel, best: highest((car) => fuelRank(car.fuel)) },
    {
      key: "transmission",
      label: "Transmission",
      value: (car) => car.transmission,
      best: highest((car) => (car.transmission === "Automatic" ? 2 : 1))
    },
    { key: "owner", label: "Owner number", value: (car) => car.ownership, best: lowest((car) => ownerCount(car)) },
    { key: "insurance", label: "Insurance", value: insuranceStatus, best: highest((car) => car.inspection.documents) },
    { key: "service", label: "Service history", value: serviceHistoryStatus, best: highest((car) => serviceRank(car)) },
    { key: "accident", label: "Accident history", value: accidentStatus, best: highest((car) => accidentRank(car)) },
    { key: "city", label: "City", value: (car) => car.location, best: highest((car) => cityDemandRank(car.location)) },
    { key: "source", label: "Source platform", value: (car) => car.sourcePlatform, best: highest((car) => sourceRank(car.sourcePlatform)) }
  ];
}

function getRecommendation(cars: Car[]) {
  const ranked = cars
    .map((car) => ({
      car,
      total:
        car.valueScore * 0.38 +
        normalizeInverse(car.price, cars.map((item) => item.price)) * 18 +
        normalizeInverse(car.mileage, cars.map((item) => item.mileage)) * 14 +
        normalize(car.year, cars.map((item) => item.year)) * 10 +
        serviceRank(car) * 5 +
        accidentRank(car) * 5 +
        sourceRank(car.sourcePlatform) * 3
    }))
    .sort((a, b) => b.total - a.total);

  const best = ranked[0].car;
  const priceText =
    best.marketDelta < 0
      ? `${formatPrice(Math.abs(best.marketDelta))} below market`
      : `${formatPrice(best.marketDelta)} above market`;

  return {
    id: best.id,
    reason: `${best.brand} ${best.model} has the strongest overall mix: a ${best.valueScore}/100 value score, ${priceText}, ${formatKm(best.mileage)}, ${best.ownership.toLowerCase()}, and ${serviceHistoryStatus(best).toLowerCase()}.`
  };
}

function highest(getValue: (car: Car) => number) {
  return (cars: Car[]) => {
    const bestValue = Math.max(...cars.map(getValue));
    return new Set(cars.filter((car) => getValue(car) === bestValue).map((car) => car.id));
  };
}

function lowest(getValue: (car: Car) => number) {
  return (cars: Car[]) => {
    const bestValue = Math.min(...cars.map(getValue));
    return new Set(cars.filter((car) => getValue(car) === bestValue).map((car) => car.id));
  };
}

function ownerCount(car: Car) {
  return Number.parseInt(car.ownership, 10) || 1;
}

function insuranceStatus(car: Car) {
  if (car.inspection.documents >= 99) return "Comprehensive active";
  if (car.inspection.documents >= 95) return "Active, verify transfer";
  return "Needs document review";
}

function serviceHistoryStatus(car: Car) {
  if (car.highlights.some((highlight) => highlight.toLowerCase().includes("full service"))) return "Full service history";
  if (car.highlights.some((highlight) => highlight.toLowerCase().includes("service"))) return "Partial service history";
  return "Service history not listed";
}

function accidentStatus(car: Car) {
  if (car.highlights.some((highlight) => highlight.toLowerCase().includes("no accident"))) return "No accident record";
  return "Not disclosed";
}

function serviceRank(car: Car) {
  const status = serviceHistoryStatus(car);
  if (status === "Full service history") return 3;
  if (status === "Partial service history") return 2;
  return 1;
}

function accidentRank(car: Car) {
  return accidentStatus(car) === "No accident record" ? 2 : 1;
}

function fuelRank(fuel: Car["fuel"]) {
  if (fuel === "EV") return 4;
  if (fuel === "CNG") return 3;
  if (fuel === "Petrol") return 2;
  return 1;
}

function cityDemandRank(city: string) {
  if (["Bengaluru", "Mumbai", "Delhi NCR", "Pune"].includes(city)) return 3;
  if (["Hyderabad", "Chennai"].includes(city)) return 2;
  return 1;
}

function sourceRank(source: string) {
  if (["Cars24", "Spinny"].includes(source)) return 3;
  if (["CarTrade", "Dealer Direct"].includes(source)) return 2;
  return 1;
}

function normalize(value: number, values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) return 1;
  return (value - min) / (max - min);
}

function normalizeInverse(value: number, values: number[]) {
  return 1 - normalize(value, values);
}
