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
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50/60 to-white p-6 sm:p-8 text-center shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3.5 py-1 text-xs font-semibold text-indigo-700 shadow-xs">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
          <span>Track 35+ TV Shows & Seasons</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Your Personal TV Watchlist & Season Progress
        </h2>
        <p className="max-w-xl mx-auto text-sm text-slate-600 leading-relaxed">
          Log what you’ve watched, count completed seasons, and track ongoing,
          ended, canceled, or unknown-status TV series in one clean, centralized
          dashboard.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <UserPlus className="h-4 w-4" />
            <span>Create Free Account</span>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900"
          >
            <LogIn className="h-4 w-4 text-slate-500" />
            <span>Sign In</span>
          </Link>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
            <Clock className="h-4 w-4 text-sky-600" />
            <h3>Continuing Series</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Follow active shows like <em>Silo</em>, <em>Dark Matter</em>, <em>The Night Agent</em>, and <em>House of the Dragon</em>.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <h3>Ended & Completed</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Catalog completed series like <em>The Last Kingdom</em>, <em>Daredevil (2015)</em>, and <em>SEAL Team</em>.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
            <XCircle className="h-4 w-4 text-rose-600" />
            <h3>Canceled & Discontinued</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Keep track of shows that concluded early such as <em>Warrior Nun</em> and <em>In From the Cold</em>.
          </p>
        </div>
      </div>
    </div>
  );
}
