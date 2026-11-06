"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Tv,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic frontend validations
    if (!fullName.trim()) {
      setError("Please enter your full name");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      setSuccess(
        `Welcome aboard, ${data.user.fullName}! Your account has been created.`
      );
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
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
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Sign up to start tracking your TV series, seasons, and watchlists
          </p>
        </div>

        {/* Form Container */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl backdrop-blur-md sm:p-8">
          {success ? (
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Account Created!</h3>
                <p className="text-sm text-zinc-300">{success}</p>
              </div>
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
                  <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-300"
                >
                  Full Name
                </label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    className="block w-full rounded-xl border border-zinc-800 bg-zinc-950/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

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
                <p className="mt-1 text-xs text-zinc-500">
                  Must be at least 6 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-300"
                >
                  Confirm Password
                </label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full rounded-xl border border-zinc-800 bg-zinc-950/80 py-2.5 pl-10 pr-10 text-sm text-white placeholder-zinc-500 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-500 hover:text-zinc-300"
                  >
                    {showConfirmPassword ? (
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
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Login and Home Links */}
        <div className="space-y-2 text-center text-xs text-zinc-500">
          <p>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-indigo-400 hover:text-indigo-300 underline"
            >
              Sign in here
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
