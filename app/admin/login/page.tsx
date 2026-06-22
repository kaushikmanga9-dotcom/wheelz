import type { Metadata } from "next";
import Image from "next/image";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { hasValidAdminSession, sanitizeNextPath } from "@/lib/admin-auth";
import { signInToAdmin } from "@/app/admin/login/actions";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Private Wheelz admin access."
};

export const dynamic = "force-dynamic";

type AdminLoginPageProps = {
  searchParams?: {
    error?: string;
    next?: string;
  };
};

export default function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const next = sanitizeNextPath(searchParams?.next ?? "/admin");

  if (hasValidAdminSession()) {
    redirect(next);
  }

  return (
    <div className="min-h-screen bg-white">
      <AppHeader />
      <main className="page-wrap grid min-h-[calc(100vh-64px)] items-center gap-8 py-8 lg:grid-cols-[1fr_440px]">
        <section className="relative min-h-[520px] overflow-hidden rounded-card bg-brand-black p-7 text-white shadow-premium md:p-10">
          <Image
            src="/images/hero-cars.svg"
            alt=""
            fill
            sizes="(min-width: 1024px) 720px, 100vw"
            className="object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,12,18,0.1),rgba(9,12,18,0.88))]" />
          <div className="relative z-10 max-w-lg">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-black backdrop-blur">
              <ShieldCheck size={17} />
              Private inventory workspace
            </span>
            <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">Admin access</h1>
            <p className="mt-4 text-sm font-semibold leading-6 text-slate-200 md:text-base">
              Add listings and calculate value scores from a private email and passcode gate.
            </p>
          </div>
        </section>

        <section className="rounded-card border border-line bg-white p-5 shadow-card md:p-7">
          <div className="grid h-12 w-12 place-items-center rounded-card bg-brand-black text-white">
            <LockKeyhole size={23} />
          </div>
          <h2 className="mt-5 text-3xl font-black">Sign in to admin</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-muted">
            Use the private admin email and passcode configured in the server environment.
          </p>

          {searchParams?.error && (
            <div className="mt-5 rounded-card border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">
              {searchParams.error}
            </div>
          )}

          <form action={signInToAdmin} className="mt-6 grid gap-4">
            <input name="next" type="hidden" value={next} />
            <label className="grid gap-2 text-sm font-black">
              Email address
              <span className="flex h-12 items-center gap-3 rounded-card border border-line px-4">
                <Mail size={18} className="text-muted" />
                <input className="w-full bg-transparent font-bold outline-none" name="email" required type="email" />
              </span>
            </label>
            <label className="grid gap-2 text-sm font-black">
              Passcode
              <span className="flex h-12 items-center gap-3 rounded-card border border-line px-4">
                <LockKeyhole size={18} className="text-muted" />
                <input className="w-full bg-transparent font-bold outline-none" name="passcode" required type="password" />
              </span>
            </label>
            <button className="h-12 rounded-card bg-brand-blue font-black text-white">Open admin</button>
          </form>
        </section>
      </main>
    </div>
  );
}
