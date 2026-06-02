import Link from "next/link";
import Image from "next/image";
import { Fuel, Gauge, Heart, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { Car, formatKm, formatPrice, valueTone } from "@/lib/cars";

type CarCardProps = {
  car: Car;
  compact?: boolean;
  layout?: "grid" | "list";
};

export function CarCard({ car, compact = false, layout }: CarCardProps) {
  const resolvedLayout = layout ?? (compact ? "list" : "grid");
  const isList = resolvedLayout === "list";
  const badges = getCarBadges(car);
  const imageUrl = car.imageUrls[0];

  return (
    <article className="overflow-hidden rounded-card border border-line bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-premium">
      <div className={isList ? "grid md:grid-cols-[250px_1fr]" : ""}>
        <Link href={`/cars/${car.id}`} className="block">
          <div className={isList ? "relative h-56 bg-slate-100 md:h-full" : "relative aspect-[16/10] bg-slate-100"}>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`${car.year} ${car.brand} ${car.model}`}
                fill
                sizes={isList ? "(min-width: 768px) 250px, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
                className="scale-105 object-cover"
                style={{ objectPosition: car.imagePosition }}
              />
            ) : (
              <Image
                src="/images/hero-cars.svg"
                alt={`${car.year} ${car.brand} ${car.model}`}
                fill
                sizes={isList ? "(min-width: 768px) 250px, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
                className="scale-105 object-cover"
                style={{ objectPosition: car.imagePosition }}
              />
            )}
            <span
              className={`absolute left-3 top-3 rounded-full border px-3 py-1 text-xs font-black ${valueTone(car.valueScore)}`}
            >
              Score {car.valueScore}
            </span>
          </div>
        </Link>

        <div className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="mb-1 text-xs font-black uppercase tracking-normal text-brand-blue">{car.sourcePlatform}</p>
              <Link href={`/cars/${car.id}`} className="text-lg font-black leading-tight hover:text-brand-blue">
                {car.year} {car.brand} {car.model}
              </Link>
              <p className="mt-1 text-sm font-bold text-muted">{car.variant}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-slate-700"
                aria-label={`Save ${car.brand} ${car.model}`}
              >
                <Heart size={17} />
              </button>
              <label className="hidden items-center gap-2 rounded-full border border-line px-3 py-2 text-xs font-black text-slate-700 sm:flex">
                <input type="checkbox" className="h-4 w-4 accent-brand-blue" />
                Compare
              </label>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black text-brand-navy"
              >
                <Sparkles size={13} />
                {badge}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs font-extrabold text-slate-700">
            <span className="inline-flex items-center gap-1 rounded-full bg-soft px-3 py-1.5">
              <MapPin size={14} />
              {car.location}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-soft px-3 py-1.5">{car.year}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-soft px-3 py-1.5">
              <Gauge size={14} />
              {formatKm(car.mileage)}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-soft px-3 py-1.5">
              <Fuel size={14} />
              {car.fuel}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-soft px-3 py-1.5">
              <ShieldCheck size={14} />
              {car.ownership}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 rounded-card bg-soft p-3 text-sm">
            <div>
              <p className="font-black">{car.transmission}</p>
              <p className="text-xs font-bold text-muted">Transmission</p>
            </div>
            <div>
              <p className="font-black">{car.bodyType}</p>
              <p className="text-xs font-bold text-muted">Body type</p>
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-2xl font-black">{formatPrice(car.price)}</p>
              <p className="text-sm font-extrabold text-emerald-700">
                {formatPrice(Math.abs(car.marketDelta))} below market
              </p>
            </div>
            <label className="flex items-center gap-2 rounded-full border border-line px-3 py-2 text-xs font-black text-slate-700 sm:hidden">
              <input type="checkbox" className="h-4 w-4 accent-brand-blue" />
              Compare
            </label>
            <Link
              href={`/cars/${car.id}`}
              className="hidden rounded-full bg-brand-black px-5 py-3 text-sm font-black text-white sm:inline-flex"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function getCarBadges(car: Car) {
  const badges: string[] = [];

  if (car.valueScore >= 90) badges.push("Great Deal");
  if (car.mileage <= 22000) badges.push("Low KM");
  if (car.ownership === "1st owner") badges.push("Single Owner");
  if (car.priceDropped) badges.push("Price Dropped");

  return badges.slice(0, 4);
}
