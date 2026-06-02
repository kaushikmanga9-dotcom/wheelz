import Link from "next/link";
import { CarFront } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-black py-10 text-white">
      <div className="page-wrap grid gap-8 md:grid-cols-[1.1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-3 font-black">
            <span className="grid h-9 w-9 place-items-center rounded-card bg-white text-brand-black">
              <CarFront size={20} />
            </span>
            Wheelz
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
            A modern comparison workspace for finding better used-car deals with transparent mock data.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm font-bold text-slate-200">
          <Link href="/search">Search cars</Link>
          <Link href="/compare">Compare</Link>
          <Link href="/saved">Saved cars</Link>
          <Link href="/login">Login</Link>
          <Link href="/admin">Admin</Link>
          <Link href="/">Inspection</Link>
          <Link href="/">Support</Link>
        </div>
        <div className="border-t border-white/10 pt-5 text-sm text-slate-400 md:col-span-2">
          © 2026 Wheelz. Mock frontend only.
        </div>
      </div>
    </footer>
  );
}
