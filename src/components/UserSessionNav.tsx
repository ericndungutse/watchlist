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
          <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
            <User className="h-3.5 w-3.5 text-teal-700" />
            <span>{currentUser.fullName}</span>
          </div>
          <div className="flex items-center justify-end gap-1.5 text-xs text-slate-500">
            <span>{currentUser.email}</span>
            <span className="rounded-md border border-teal-200 bg-teal-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-teal-800">
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
        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900"
      >
        <LogIn className="h-3.5 w-3.5 text-slate-500" />
        <span>Sign In</span>
      </Link>
      <Link
        href="/signup"
        className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
      >
        <UserPlus className="h-3.5 w-3.5" />
        <span>Sign Up</span>
      </Link>
    </div>
  );
}
