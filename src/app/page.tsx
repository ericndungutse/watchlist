import { Suspense } from "react";
import Link from "next/link";
import { Tv, Activity, Loader2 } from "lucide-react";
import UserSessionNav from "@/components/UserSessionNav";
import MainContent from "@/components/MainContent";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/90 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-200/60 text-indigo-600 shadow-xs">
              <Tv className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-slate-900 sm:text-lg">
                EntTracker
              </span>
              <span className="hidden text-[11px] font-medium text-slate-500 sm:inline ml-2">
                TV Series & Season Tracker
              </span>
            </div>
          </Link>

          {/* User Nav (Streamed) */}
          <Suspense
            fallback={
              <div className="h-8 w-28 animate-pulse rounded-xl bg-slate-200" />
            }
          >
            <UserSessionNav />
          </Suspense>
        </div>
      </header>

      {/* Main Body */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <p className="text-sm font-medium text-slate-500">
                Loading your TV tracker...
              </p>
            </div>
          }
        >
          <MainContent />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <span>
            EntTracker &bull; Personal TV Series and Season Progress Tracker
          </span>
          <div className="flex items-center gap-4">
            <a
              href="/api/health"
              className="inline-flex items-center gap-1.5 font-medium text-slate-500 hover:text-slate-800 transition"
            >
              <Activity className="h-3.5 w-3.5 text-emerald-600" />
              <span>DB Health</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
