import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Dream } from "@/types/dream";

type DreamLinkProps = {
  dream: Dream;
  sharedSymbols?: string[];
  thumbnailSrc?: string;
};

export function DreamLink({ dream, sharedSymbols = [] }: DreamLinkProps) {
  return (
    <Link
      className="flex items-center gap-4 border-b border-line px-5 py-4 transition last:border-b-0 hover:bg-lavender-pale"
      href={`/dreams/${dream.id}`}
    >
      <div className="min-w-0 flex-1">
        <p className="font-handwritten text-xl font-semibold text-ink">
          {dream.title}
        </p>
        <p className="mt-1 font-base text-xs text-ink-soft">
          {dream.date}
          {sharedSymbols.length > 0 && ` · Shared: ${sharedSymbols.join(", ")}`}
        </p>
      </div>
      <ChevronRight
        aria-hidden="true"
        className="size-4 shrink-0 text-ink-muted"
      />
    </Link>
  );
}
