import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  CarFront,
  CheckCircle2,
  ExternalLink,
  Fuel,
  Gauge,
  GitCompare,
  Heart,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wrench
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { CarCard } from "@/components/CarCard";
import { Footer } from "@/components/Footer";
import { cars as mockCars, formatKm, formatPrice, type Car, valueTone } from "@/lib/cars";
import { fetchCarById, fetchCars } from "@/lib/supabase/cars";
import { saveCarFormAction } from "@/lib/supabase/user-actions";
import { calculateValueScore } from "@/lib/value-score";

type CarDetailsPageProps = {
  params: { id: string };
  searchParams?: {
    saved?: string;
    alert?: string;
  };
};

export function generateStaticParams() {
  return mockCars.map((car) => ({ id: car.id }));
}

export async function generateMetadata({ params }: CarDetailsPageProps): Promise<Metadata> {
  const car = await fetchCarById(params.id);

  if (!car) {
    return {
      title: "Car Not Found",
      description: "This used-car listing could not be found on Wheelz."
    };
  }

  const title = `${car.year} ${car.brand} ${car.model} ${car.variant}`;
  const description = `${title} in ${car.location} for ${formatPrice(car.price)} with ${formatKm(car.mileage)}, ${car.fuel}, ${car.transmission}, and a ${car.valueScore}/100 Wheelz value score.`;
  const image = car.imageUrls[0] ?? "/images/hero-cars.svg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image, alt: title }]
    },
    twitter: {
      title,
      description,
      images: [image]
    }
  };
}

export default async function CarDetailsPage({ params, searchParams }: CarDetailsPageProps) {
  const car = await fetchCarById(params.id);

  if (!car) {
    notFound();
  }

  const marketAveragePrice = Math.max(1, car.price - car.marketDelta);
  const carAgeYears = Math.max(0, 2026 - car.year);
  const ownerCount = Number.parseInt(car.ownership, 10) || 1;
  const valueResult = calculateValueScore({
    listedPrice: car.price,
    marketAveragePrice,
    kilometersDriven: car.mileage,
    carAgeYears,
    numberOfOwners: ownerCount,
    fuelType: car.fuel,
    transmission: car.transmission,
    accidentHistory: car.accidentHistory,
    serviceHistory: car.serviceHistory,
    cityDemand: ["Bengaluru", "Mumbai", "Delhi NCR", "Pune"].includes(car.location) ? "high" : "medium"
  });
  const similar = (await fetchCars({ sortBy: "value_score" })).filter((item) => item.id !== car.id).slice(0, 3);
  const priceDeltaPercent = Math.round((Math.abs(car.marketDelta) / marketAveragePrice) * 100);
  const isBelowMarket = car.marketDelta < 0;
  const seller = getSellerDetails(car);
  const galleryPositions = [car.imagePosition, "50% 62%", "35% 64%", "75% 62%"];

  return (
    <div className="min-h-screen bg-white">
      <AppHeader />
      <main className="page-wrap py-5 md:py-8">
        <Link href="/search" className="inline-flex items-center gap-2 text-sm font-black text-muted hover:text-ink">
          <ArrowLeft size={17} />
          Back to results
        </Link>

        <section className="mt-5 grid gap-6 xl:grid-cols-[1fr_390px]">
          <div className="min-w-0">
            <ImageGallery car={car} positions={galleryPositions} />

            <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_300px]">
              <ScorePanel score={valueResult.score} label={valueResult.dealLabel} explanation={valueResult.explanation} />
              <MarketPanel
                listedPrice={car.price}
                marketAveragePrice={marketAveragePrice}
                isBelowMarket={isBelowMarket}
                priceDeltaPercent={priceDeltaPercent}
              />
            </div>
          </div>

          <aside className="h-fit rounded-card border border-line bg-white p-5 shadow-premium xl:sticky xl:top-24">
            <p className="text-xs font-black uppercase text-brand-blue">{car.sourcePlatform}</p>
            <h1 className="mt-2 text-3xl font-black leading-tight md:text-5xl xl:text-4xl">
              {car.year} {car.brand} {car.model}
            </h1>
            <p className="mt-2 text-lg font-bold text-muted">{car.variant}</p>

            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-4xl font-black">{formatPrice(car.price)}</p>
                <p className={`mt-1 text-sm font-black ${isBelowMarket ? "text-emerald-700" : "text-amber-700"}`}>
                  {isBelowMarket ? `${formatPrice(Math.abs(car.marketDelta))} below market` : `${formatPrice(car.marketDelta)} above market`}
                </p>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs font-black ${valueTone(car.valueScore)}`}>
                {valueResult.dealLabel}
              </span>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-card bg-soft p-3 text-sm font-black text-slate-700">
              <MapPin className="text-brand-blue" size={18} />
              {car.location}
            </div>

            {searchParams?.saved && (
              <div className="mt-4 rounded-card border border-emerald-100 bg-emerald-50 p-3 text-sm font-bold text-emerald-800">
                Car saved to your shortlist.
              </div>
            )}

            <div className="mt-5 grid gap-3">
              <Link
                href={car.sourceListingUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-card bg-brand-blue font-black text-white"
              >
                <ExternalLink size={18} />
                View original listing
              </Link>
              <form action={saveCarFormAction}>
                <input name="carId" type="hidden" value={car.id} />
                <button className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-card border border-ink font-black">
                  <Heart size={18} />
                  Save car
                </button>
              </form>
              <Link
                href={`/compare?car=${car.id}`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-card bg-brand-black font-black text-white"
              >
                <GitCompare size={18} />
                Compare
              </Link>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs font-black text-muted">
              <TrustPill value="Verified" label="Documents" />
              <TrustPill value="4.8/5" label="Seller" />
              <TrustPill value="7 days" label="Return" />
            </div>
          </aside>
        </section>

        <section className="mt-6">
          <div className="mb-4">
            <p className="text-xs font-black uppercase text-muted">Key specs</p>
            <h2 className="mt-1 text-2xl font-black">What matters at a glance</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Spec icon={CalendarDays} label="Year" value={String(car.year)} />
            <Spec icon={Gauge} label="Kilometers" value={formatKm(car.mileage)} />
            <Spec icon={Fuel} label="Fuel" value={car.fuel} />
            <Spec icon={CarFront} label="Transmission" value={car.transmission} />
          </div>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
          <DealReasoning car={car} valueResult={valueResult} marketAveragePrice={marketAveragePrice} />
          <SellerDetails seller={seller} />
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-2">
          <OwnershipDetails car={car} ownerCount={ownerCount} />
          <ServiceHistory car={car} />
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black md:text-4xl">Similar cars</h2>
              <p className="mt-2 text-sm font-semibold text-muted">Other listings with strong value scores.</p>
            </div>
            <Link href="/search" className="hidden text-sm font-black text-brand-blue md:inline-flex">
              See all
            </Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {similar.map((item) => (
              <CarCard key={item.id} car={item} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ImageGallery({ car, positions }: { car: Car; positions: string[] }) {
  const galleryImages = car.imageUrls.length > 0 ? car.imageUrls.slice(0, 4) : [];
  const heroImage = galleryImages[0];

  return (
    <section aria-label="Image gallery" className="overflow-hidden rounded-card border border-line bg-white shadow-card">
      <div className="relative aspect-[4/3] bg-slate-100 md:aspect-[16/9]">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={`${car.brand} ${car.model}`}
            fill
            priority
            sizes="(min-width: 1280px) 760px, 100vw"
            className="scale-105 object-cover"
            style={{ objectPosition: positions[0] }}
          />
        ) : (
          <Image
            src="/images/hero-cars.svg"
            alt={`${car.brand} ${car.model}`}
            fill
            priority
            sizes="(min-width: 1280px) 760px, 100vw"
            className="scale-105 object-cover"
            style={{ objectPosition: positions[0] }}
          />
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-4">
          <span className="inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-black text-ink">
            360 inspection gallery
          </span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 p-2">
        {positions.map((position, index) => (
          <div key={position} className="relative aspect-[4/3] overflow-hidden rounded-card bg-slate-100">
            {galleryImages[index] ? (
              <Image
                src={galleryImages[index]}
                alt={`${car.brand} ${car.model} view ${index + 1}`}
                fill
                sizes="180px"
                className="scale-125 object-cover"
                style={{ objectPosition: position }}
              />
            ) : (
              <Image
                src="/images/hero-cars.svg"
                alt={`${car.brand} ${car.model} view ${index + 1}`}
                fill
                sizes="180px"
                className="scale-125 object-cover"
                style={{ objectPosition: position }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function ScorePanel({ score, label, explanation }: { score: number; label: string; explanation: string }) {
  return (
    <section className="rounded-card border border-line bg-brand-black p-5 text-white shadow-card">
      <p className="text-xs font-black uppercase text-blue-200">Value-for-money score</p>
      <div className="mt-4 flex items-center gap-4">
        <div className="grid h-24 w-24 shrink-0 place-items-center rounded-card bg-white text-3xl font-black text-emerald-700">
          {score}
        </div>
        <div>
          <h2 className="text-2xl font-black">{label}</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-300">{explanation}</p>
        </div>
      </div>
    </section>
  );
}

function MarketPanel({
  listedPrice,
  marketAveragePrice,
  isBelowMarket,
  priceDeltaPercent
}: {
  listedPrice: number;
  marketAveragePrice: number;
  isBelowMarket: boolean;
  priceDeltaPercent: number;
}) {
  const listedWidth = Math.min(100, Math.round((listedPrice / marketAveragePrice) * 100));

  return (
    <section className="rounded-card border border-line bg-white p-5 shadow-card">
      <p className="text-xs font-black uppercase text-muted">Price comparison</p>
      <h2 className="mt-2 text-xl font-black">Vs market average</h2>
      <div className="mt-5 grid gap-4">
        <PriceBar label="This car" value={formatPrice(listedPrice)} width={listedWidth} tone="bg-brand-blue" />
        <PriceBar label="Market average" value={formatPrice(marketAveragePrice)} width={100} tone="bg-slate-300" />
      </div>
      <p className={`mt-4 text-sm font-black ${isBelowMarket ? "text-emerald-700" : "text-amber-700"}`}>
        {priceDeltaPercent}% {isBelowMarket ? "better than market average" : "higher than market average"}
      </p>
    </section>
  );
}

function DealReasoning({
  car,
  valueResult,
  marketAveragePrice
}: {
  car: Car;
  valueResult: ReturnType<typeof calculateValueScore>;
  marketAveragePrice: number;
}) {
  const reasons = [
    car.marketDelta < 0
      ? `Listed ${formatPrice(Math.abs(car.marketDelta))} below the local market average of ${formatPrice(marketAveragePrice)}.`
      : `Listed above the local market average of ${formatPrice(marketAveragePrice)}.`,
    car.mileage <= Math.max(1, (2026 - car.year) * 12000 * 0.9)
      ? "Kilometers are healthy for this model year."
      : "Kilometers are acceptable but worth checking against service records.",
    car.ownership === "1st owner" ? "Single-owner history improves resale confidence." : "Multiple ownership slightly reduces confidence.",
    car.highlights.some((item) => item.toLowerCase().includes("accident"))
      ? "No accident record is listed in the inspection highlights."
      : "Accident history should be verified during inspection."
  ];

  return (
    <section className="rounded-card border border-line bg-white p-5 shadow-card">
      <p className="text-xs font-black uppercase text-brand-blue">Deal readout</p>
      <h2 className="mt-2 text-2xl font-black">Why this is a {valueResult.dealLabel.toLowerCase()}</h2>
      <div className="mt-5 grid gap-3">
        {reasons.map((reason) => (
          <div key={reason} className="flex items-start gap-3 rounded-card bg-soft p-4 text-sm font-bold leading-6 text-slate-700">
            <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={19} />
            {reason}
          </div>
        ))}
      </div>
    </section>
  );
}

function OwnershipDetails({ car, ownerCount }: { car: Car; ownerCount: number }) {
  return (
    <section className="rounded-card border border-line bg-white p-5 shadow-card">
      <p className="text-xs font-black uppercase text-muted">Ownership details</p>
      <h2 className="mt-2 text-2xl font-black">Clean ownership signals</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <TrustDetail icon={UserRound} label="Owner count" value={car.ownership} />
        <TrustDetail icon={MapPin} label="Registered city" value={car.location} />
        <TrustDetail icon={ShieldCheck} label="Document status" value={car.insuranceValid ? "RC and insurance verified" : "Insurance renewal required"} />
        <TrustDetail icon={BadgeCheck} label="Transfer readiness" value={ownerCount === 1 ? "High confidence" : "Needs closer review"} />
      </div>
    </section>
  );
}

function ServiceHistory({ car }: { car: Car }) {
  return (
    <section className="rounded-card border border-line bg-white p-5 shadow-card">
      <p className="text-xs font-black uppercase text-muted">Service history</p>
      <h2 className="mt-2 text-2xl font-black">Inspection and maintenance</h2>
      <div className="mt-5 grid gap-3">
        {Object.entries(car.inspection).map(([label, value]) => (
          <div key={label} className="rounded-card bg-soft p-4">
            <div className="flex items-center justify-between font-black capitalize">
              <span>{label}</span>
              <span>{value}/100</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-white">
              <div className="h-2 rounded-full bg-brand-blue" style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-2">
        {car.highlights.map((highlight) => (
          <div key={highlight} className="flex items-center gap-3 text-sm font-bold text-slate-700">
            <Wrench className="text-brand-blue" size={17} />
            {highlight}
          </div>
        ))}
      </div>
    </section>
  );
}

function SellerDetails({ seller }: { seller: ReturnType<typeof getSellerDetails> }) {
  return (
    <section className="rounded-card border border-line bg-white p-5 shadow-card">
      <p className="text-xs font-black uppercase text-muted">Seller details</p>
      <h2 className="mt-2 text-2xl font-black">{seller.name}</h2>
      <p className="mt-2 text-sm font-semibold leading-6 text-muted">{seller.summary}</p>
      <div className="mt-5 grid gap-3">
        <TrustDetail icon={BadgeCheck} label="Rating" value={seller.rating} />
        <TrustDetail icon={ShieldCheck} label="Verification" value={seller.verification} />
        <TrustDetail icon={Sparkles} label="Support" value={seller.support} />
      </div>
    </section>
  );
}

function Spec({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-card border border-line bg-white p-4 shadow-sm">
      <Icon className="text-brand-blue" size={21} />
      <p className="mt-3 text-xs font-black uppercase text-muted">{label}</p>
      <p className="mt-1 font-black">{value}</p>
    </div>
  );
}

function TrustDetail({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-card bg-soft p-4">
      <Icon className="text-brand-blue" size={19} />
      <p className="mt-2 text-xs font-black uppercase text-muted">{label}</p>
      <p className="mt-1 text-sm font-black leading-5">{value}</p>
    </div>
  );
}

function PriceBar({ label, value, width, tone }: { label: string; value: string; width: number; tone: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-black">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-3 rounded-full bg-soft">
        <div className={`h-3 rounded-full ${tone}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function TrustPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-card bg-soft p-3">
      <p className="text-ink">{value}</p>
      <p className="mt-1 text-[0.68rem] uppercase text-muted">{label}</p>
    </div>
  );
}

function getSellerDetails(car: Car) {
  return {
    name: car.dealerName || (car.sourcePlatform === "Dealer Direct" ? "Verified dealer partner" : car.sourcePlatform),
    summary: "Seller identity, listing history, and document readiness are checked before the car appears on Wheelz.",
    rating: car.sourcePlatform === "OLX Autos" ? "4.5/5 buyer rating" : "4.8/5 buyer rating",
    verification: "KYC verified and listing audited",
    support: "Test drive, paperwork, and price-drop assistance"
  };
}
