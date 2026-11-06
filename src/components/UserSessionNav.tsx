import Link from "next/link";
import { User, LogIn, UserPlus } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

export default async function UserSessionNav() {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
            <User className="h-3.5 w-3.5 text-indigo-400" />
            <span>{currentUser.fullName}</span>
          </div>
          <div className="flex items-center justify-end gap-1.5 text-xs text-zinc-400">
            <span>{currentUser.email}</span>
            <span className="rounded bg-indigo-500/20 px-1 py-0.2 text-[10px] font-medium text-indigo-300 uppercase">
              {currentUser.role}
            </span>
          </div>
        </div>
        <LogoutButton />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 px-3.5 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-700 hover:text-white"
      >
        <LogIn className="h-3.5 w-3.5" />
        <span>Sign In</span>
      </Link>
      <Link
        href="/signup"
        className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <UserPlus className="h-3.5 w-3.5" />
        <span>Sign Up</span>
      </Link>
    </div>
  );
}
