import type { Metadata } from "next";
import Link from "next/link";
import { CarFront, ImagePlus, LockKeyhole, Save, Sparkles } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { createUsedCarListing } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "Admin Add Listing",
  description: "Add verified used-car listings to Supabase and calculate value scores automatically."
};

type AdminPageProps = {
  searchParams?: {
    error?: string;
  };
};

export default function AdminPage({ searchParams }: AdminPageProps) {
  return (
    <div className="min-h-screen bg-soft">
      <AppHeader />
      <main className="page-wrap py-6 md:py-8">
        <section className="rounded-card bg-brand-black p-5 text-white shadow-premium md:p-7">
          <p className="inline-flex items-center gap-2 text-sm font-black uppercase text-blue-200">
            <LockKeyhole size={18} />
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-black md:text-5xl">Add used-car listing</h1>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-300">
            Manually add inventory to Supabase. The value score is calculated automatically when the listing is saved.
          </p>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          <form action={createUsedCarListing} className="rounded-card border border-line bg-white p-5 shadow-card md:p-7">
            {searchParams?.error && (
              <div className="mb-5 rounded-card border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">
                {searchParams.error}
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Brand" name="brand" placeholder="Honda" required />
              <Field label="Model" name="model" placeholder="City" required />
              <Field label="Variant" name="variant" placeholder="ZX CVT" required />
              <Field label="Year" name="year" type="number" placeholder="2021" required />
              <Field label="Price" name="price" type="number" placeholder="1085000" required />
              <Field label="City" name="city" placeholder="Bengaluru" required />
              <Field label="Kilometers driven" name="kilometersDriven" type="number" placeholder="29000" required />
              <Select label="Fuel type" name="fuelType" options={["Petrol", "Diesel", "CNG", "EV"]} />
              <Select label="Transmission" name="transmission" options={["Automatic", "Manual"]} />
              <Field label="Owner number" name="ownerNumber" type="number" placeholder="1" required />
              <Select label="Insurance valid" name="insuranceValid" options={["yes", "no"]} />
              <Select label="Service history" name="serviceHistory" options={["full", "partial", "missing"]} />
              <Select label="Accident history" name="accidentHistory" options={["none", "minor", "major"]} />
              <Field label="Source platform" name="sourcePlatform" placeholder="Cars24" required />
              <Field label="Source URL" name="sourceUrl" type="url" placeholder="https://www.cars24.com/" required />
              <Field label="Dealer name" name="dealerName" placeholder="Cars24 Whitefield Hub" required />
            </div>

            <label className="mt-5 grid gap-2 text-sm font-black">
              Images
              <span className="flex min-h-28 items-center justify-center rounded-card border border-dashed border-line bg-soft px-4 text-center text-sm font-bold text-muted">
                <span>
                  <ImagePlus className="mx-auto mb-2 text-brand-blue" size={26} />
                  Upload up to 8 listing images
                </span>
              </span>
              <input className="text-sm font-bold" name="images" type="file" accept="image/*" multiple />
            </label>

            <button className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-card bg-brand-blue font-black text-white md:w-auto md:px-6">
              <Save size={18} />
              Save listing
            </button>
          </form>

          <aside className="h-fit rounded-card border border-line bg-white p-5 shadow-card">
            <span className="grid h-12 w-12 place-items-center rounded-card bg-blue-50 text-brand-blue">
              <Sparkles size={23} />
            </span>
            <h2 className="mt-4 text-xl font-black">Automatic value score</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-muted">
              The submit action estimates market average from similar Supabase listings, then scores price, kilometers,
              age, owners, insurance, service history, accident history, and city demand.
            </p>
            <div className="mt-5 rounded-card bg-soft p-4 text-sm font-bold leading-6 text-slate-700">
              Admin access is enforced by Supabase RLS. Set the user&apos;s `app_metadata.role` to `admin`.
            </div>
            <Link href="/search" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-brand-blue">
              <CarFront size={17} />
              View public inventory
            </Link>
          </aside>
        </section>
      </main>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-black">
      {label}
      <input
        className="h-12 rounded-card border border-line bg-white px-4 font-bold outline-none focus:border-brand-blue"
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </label>
  );
}

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <label className="grid gap-2 text-sm font-black">
      {label}
      <select className="h-12 rounded-card border border-line bg-white px-4 font-bold outline-none focus:border-brand-blue" name={name}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
