"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Tv,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to log in");
      }

      // Successfully logged in; redirect to home/dashboard
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 py-12 text-zinc-100 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Brand / Header */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300 transition hover:bg-indigo-500/20"
          >
            <Tv className="h-4 w-4" />
            <span>EntTracker</span>
          </Link>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Sign in to access your TV series watchlist and season progress
          </p>
        </div>

        {/* Login Form Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl backdrop-blur-md sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-300"
              >
                Email Address
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-950/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-300"
              >
                Password
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-950/80 py-2.5 pl-10 pr-10 text-sm text-white placeholder-zinc-500 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Links to Signup and Home */}
        <div className="space-y-2 text-center text-xs text-zinc-500">
          <p>
            Don&apos;t have an account yet?{" "}
            <Link
              href="/signup"
              className="font-medium text-indigo-400 hover:text-indigo-300 underline"
            >
              Sign up here
            </Link>
          </p>
          <p>
            <Link
              href="/"
              className="text-zinc-500 hover:text-zinc-400 transition"
            >
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
