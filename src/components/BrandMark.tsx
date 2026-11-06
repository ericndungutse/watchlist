import { BookmarkCheck } from "lucide-react";

interface BrandMarkProps {
  className?: string;
}

export default function BrandMark({
  className = "h-9 w-9",
}: BrandMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-xl border border-teal-700/20 bg-gradient-to-br from-teal-500 to-emerald-700 text-white shadow-sm ${className}`}
    >
      <BookmarkCheck className="h-1/2 w-1/2" strokeWidth={2.2} />
    </span>
  );
}
