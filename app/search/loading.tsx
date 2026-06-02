import { AppHeader } from "@/components/AppHeader";

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-soft">
      <AppHeader />
      <main className="page-wrap py-6 md:py-8">
        <div className="sticky top-16 z-20 rounded-card bg-brand-black p-4 shadow-premium md:p-6">
          <div className="h-4 w-32 animate-pulse rounded-full bg-white/20" />
          <div className="mt-4 h-10 w-full max-w-xl animate-pulse rounded-card bg-white/20" />
          <div className="mt-5 grid gap-2 lg:grid-cols-[1fr_1fr_0.9fr_0.9fr_auto]">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-card bg-white/15" />
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="hidden rounded-card border border-line bg-white p-5 shadow-card lg:block">
            <div className="h-6 w-36 animate-pulse rounded bg-slate-200" />
            <div className="mt-6 grid gap-3">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="h-5 animate-pulse rounded bg-slate-100" />
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="h-20 animate-pulse rounded-card border border-line bg-white" />
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="grid overflow-hidden rounded-card border border-line bg-white shadow-card md:grid-cols-[250px_1fr]">
                <div className="h-56 animate-pulse bg-slate-200 md:h-full" />
                <div className="p-4">
                  <div className="h-5 w-48 animate-pulse rounded bg-slate-200" />
                  <div className="mt-3 h-4 w-28 animate-pulse rounded bg-slate-100" />
                  <div className="mt-5 grid grid-cols-4 gap-2">
                    {Array.from({ length: 4 }).map((_, itemIndex) => (
                      <div key={itemIndex} className="h-8 animate-pulse rounded-full bg-slate-100" />
                    ))}
                  </div>
                  <div className="mt-5 h-20 animate-pulse rounded-card bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
