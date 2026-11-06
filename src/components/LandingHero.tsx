import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  XCircle,
  UserPlus,
  LogIn,
  Sparkles,
} from "lucide-react";

export default function LandingHero() {
  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-500/10 to-transparent p-6 sm:p-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/20 px-3.5 py-1 text-xs font-semibold text-indigo-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Track 35+ TV Shows & Seasons</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Your Personal TV Watchlist & Season Progress
        </h2>
        <p className="max-w-xl mx-auto text-sm text-zinc-400 leading-relaxed">
          Log what you’ve watched, count completed seasons, and track ongoing,
          ended, or canceled TV series in one centralized dashboard.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
          >
            <UserPlus className="h-4 w-4" />
            <span>Create Free Account</span>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-700"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </Link>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-white text-sm">
            <Clock className="h-4 w-4 text-sky-400" />
            <h3>Continuing Series</h3>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Follow active shows like <em>Silo</em>, <em>Dark Matter</em>, <em>The Night Agent</em>, and <em>House of the Dragon</em>.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-white text-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <h3>Ended & Completed</h3>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Catalog completed masterpieces like <em>The Last Kingdom</em>, <em>Daredevil (2015)</em>, and <em>SEAL Team</em>.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-white text-sm">
            <XCircle className="h-4 w-4 text-rose-400" />
            <h3>Canceled & Discontinued</h3>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Keep track of shows that concluded early such as <em>Warrior Nun</em> and <em>In From the Cold</em>.
          </p>
        </div>
      </div>
    </div>
  );
}
