import { Suspense } from "react";
import Link from "next/link";
import {
  Tv,
  Database,
  ShieldCheck,
  Activity,
  CheckCircle2,
  Code2,
} from "lucide-react";
import UserSessionNav from "@/components/UserSessionNav";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6 text-zinc-100 sm:p-12">
      <main className="w-full max-w-3xl space-y-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur-sm sm:p-10">
        {/* Header / Brand & Auth Actions */}
        <div className="flex flex-col items-start justify-between gap-4 border-b border-zinc-800/80 pb-6 sm:flex-row sm:items-center">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
              <Tv className="h-3.5 w-3.5" />
              <span>Entertainment Tracker</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              EntTracker
            </h1>
            <p className="text-sm text-zinc-400">
              Track your TV series, watched seasons, and show statuses.
            </p>
          </div>

          {/* User Status / Action Buttons streamed via Suspense */}
          <Suspense
            fallback={
              <div className="h-9 w-28 animate-pulse rounded-xl bg-zinc-800/60" />
            }
          >
            <UserSessionNav />
          </Suspense>
        </div>

        {/* Stack Overview */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
            <div className="flex items-center gap-2 font-semibold text-zinc-200">
              <Code2 className="h-4 w-4 text-indigo-400" />
              <h3>Next.js 16</h3>
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              App Router, Server Components & Tailwind CSS v4
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
            <div className="flex items-center gap-2 font-semibold text-zinc-200">
              <Database className="h-4 w-4 text-emerald-400" />
              <h3>MongoDB & Mongoose</h3>
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              Cached connection pooling & Series/User schemas
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
            <div className="flex items-center gap-2 font-semibold text-zinc-200">
              <ShieldCheck className="h-4 w-4 text-purple-400" />
              <h3>JWT & Cookies</h3>
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              HTTP-only secure cookie session management
            </p>
          </div>
        </div>

        {/* Authentication & Session Modules */}
        <div className="space-y-3 rounded-xl border border-zinc-800/80 bg-zinc-950/50 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
            Authentication & Session Architecture
          </h2>
          <ul className="space-y-2.5 text-sm text-zinc-400">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Login API:</strong>{" "}
                <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-indigo-300">
                  POST /api/auth/login
                </code>{" "}
                — validates credentials and sets HTTP-only session cookie
              </span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Logout API:</strong>{" "}
                <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-indigo-300">
                  POST /api/auth/logout
                </code>{" "}
                — clears the secure session cookie
              </span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Session Verification API:</strong>{" "}
                <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-indigo-300">
                  GET /api/auth/me
                </code>{" "}
                — checks active session state
              </span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Frontend Pages:</strong>{" "}
                <Link
                  href="/login"
                  className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-indigo-300 underline hover:text-indigo-200"
                >
                  /login
                </Link>{" "}
                and{" "}
                <Link
                  href="/signup"
                  className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-indigo-300 underline hover:text-indigo-200"
                >
                  /signup
                </Link>{" "}
                with password visibility toggle and instant feedback
              </span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-zinc-800/80 pt-6 text-xs text-zinc-500 sm:flex-row">
          <span>Full-stack entertainment tracker</span>
          <div className="flex items-center gap-3">
            <a
              href="/api/health"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-1.5 font-medium text-zinc-300 transition hover:bg-zinc-700"
            >
              <Activity className="h-3.5 w-3.5 text-emerald-400" />
              <span>Health Check</span>
            </a>
            <Link
              href="/login"
              className="rounded-lg bg-indigo-600 px-3 py-1.5 font-medium text-white transition hover:bg-indigo-500"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
