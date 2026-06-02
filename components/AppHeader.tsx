import Link from "next/link";
import { CarFront, Heart, LockKeyhole, UserRound } from "lucide-react";

const navItems = [
  { href: "/search", label: "Buy" },
  { href: "/compare", label: "Compare" },
  { href: "/saved", label: "Saved" },
  { href: "/admin", label: "Admin" }
];

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/90 backdrop-blur-xl">
      <div className="page-wrap flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 font-black tracking-normal">
          <span className="grid h-9 w-9 place-items-center rounded-card bg-brand-black text-white shadow-sm">
            <CarFront size={20} strokeWidth={2.6} />
          </span>
          <span>Wheelz</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-bold text-muted md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/saved"
            className="hidden h-11 items-center gap-2 rounded-full bg-soft px-4 text-sm font-extrabold md:inline-flex"
          >
            <Heart size={17} />
            Saved
          </Link>
          <Link
            href="/login"
            className="hidden h-11 items-center gap-2 rounded-full bg-brand-blue px-5 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(7,93,245,0.22)] md:inline-flex"
          >
            <UserRound size={17} />
            Login
          </Link>
          <Link href="/admin" className="grid h-11 w-11 place-items-center rounded-full bg-soft md:hidden" aria-label="Open admin">
            <LockKeyhole size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
}
