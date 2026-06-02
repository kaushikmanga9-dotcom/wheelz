import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CarFront, Mail, ShieldCheck } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { sendEmailLoginLink } from "@/app/login/actions";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to Wheelz with email to save cars and manage price alerts."
};

type LoginPageProps = {
  searchParams?: {
    sent?: string;
    error?: string;
  };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <AppHeader />
      <main className="page-wrap grid min-h-[calc(100vh-64px)] items-center gap-8 py-8 lg:grid-cols-[1fr_460px]">
        <section className="relative min-h-[520px] overflow-hidden rounded-card bg-brand-black p-7 text-white shadow-premium md:p-10">
          <Image
            src="/images/hero-cars.svg"
            alt=""
            fill
            sizes="(min-width: 1024px) 720px, 100vw"
            className="object-cover opacity-95"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,12,18,0.06),rgba(9,12,18,0.84))]" />
          <div className="relative z-10 max-w-lg">
            <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-black backdrop-blur">
              Secure buyer workspace
            </span>
            <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">Save, compare, and track better deals</h1>
            <p className="mt-4 text-sm font-semibold leading-6 text-slate-200 md:text-base">
              Sign in to keep your shortlist and future price alerts ready for the backend connection.
            </p>
          </div>
        </section>

        <section className="rounded-card border border-line bg-white p-5 shadow-card md:p-7">
          <div className="grid h-12 w-12 place-items-center rounded-card bg-brand-black text-white">
            <CarFront size={23} />
          </div>
          <h2 className="mt-5 text-3xl font-black">Welcome back</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-muted">
            Continue with email. Supabase will send a secure magic link.
          </p>

          {searchParams?.sent && (
            <div className="mt-5 rounded-card border border-emerald-100 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
              Login link sent to {searchParams.sent}. Check your inbox to continue.
            </div>
          )}

          {searchParams?.error && (
            <div className="mt-5 rounded-card border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">
              {searchParams.error}
            </div>
          )}

          <form action={sendEmailLoginLink} className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-black">
              Email address
              <span className="flex h-12 items-center gap-3 rounded-card border border-line px-4">
                <Mail size={18} className="text-muted" />
                <input
                  className="w-full bg-transparent font-bold outline-none"
                  name="email"
                  placeholder="you@example.com"
                  required
                  type="email"
                />
              </span>
            </label>
            <button className="h-12 rounded-card bg-brand-blue font-black text-white">Send login link</button>
          </form>

          <div className="mt-5 flex items-start gap-3 rounded-card bg-soft p-4 text-sm font-semibold leading-6 text-muted">
            <ShieldCheck className="mt-0.5 text-brand-blue" size={19} />
            Your saved cars and price alerts are protected by Supabase Row Level Security.
          </div>

          <p className="mt-5 text-center text-sm font-bold text-muted">
            New to Wheelz?{" "}
            <Link href="/search" className="text-brand-blue">
              Start searching
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
