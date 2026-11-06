export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-100 p-6 sm:p-12">
      <main className="w-full max-w-3xl space-y-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur-sm sm:p-10">
        {/* Header / Brand */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
            <span>📺</span>
            <span>Entertainment Tracker</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            EntTracker
          </h1>
          <p className="text-base text-zinc-400">
            Full-stack Next.js application bootstrapped for tracking TV series, watched
            seasons, and show statuses (continuing, ended, or canceled).
          </p>
        </div>

        {/* Stack Overview */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
            <h3 className="font-semibold text-zinc-200">Next.js</h3>
            <p className="mt-1 text-xs text-zinc-400">
              App Router with TypeScript & React 19
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
            <h3 className="font-semibold text-zinc-200">Tailwind CSS</h3>
            <p className="mt-1 text-xs text-zinc-400">
              Utility-first styling with modern design tokens
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
            <h3 className="font-semibold text-zinc-200">MongoDB & Mongoose</h3>
            <p className="mt-1 text-xs text-zinc-400">
              Cached connection utility & starter schema
            </p>
          </div>
        </div>

        {/* Quick Check & Next Steps */}
        <div className="space-y-3 rounded-xl border border-zinc-800/80 bg-zinc-950/50 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
            Project Bootstrap Status
          </h2>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span>
                <strong>Database helper:</strong> Configured at{" "}
                <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-200">
                  src/lib/mongodb.ts
                </code>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span>
                <strong>Starter Model:</strong> Series schema defined at{" "}
                <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-200">
                  src/models/Series.ts
                </code>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span>
                <strong>Health Check API:</strong> Ready at{" "}
                <a
                  href="/api/health"
                  className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-indigo-300 underline hover:text-indigo-200"
                >
                  /api/health
                </a>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span>
                <strong>Environment:</strong> Set your connection string in{" "}
                <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-200">
                  .env.local
                </code>
              </span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-zinc-800/80 pt-6 text-xs text-zinc-500 sm:flex-row">
          <span>Ready to build your tracking features</span>
          <a
            href="/api/health"
            className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-500"
          >
            Test Database Health
          </a>
        </div>
      </main>
    </div>
  );
}
