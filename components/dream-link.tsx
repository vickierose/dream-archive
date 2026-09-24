import Link from "next/link";
import type { Dream } from "@/types/dream";

type DreamLinkProps = {
  dream: Dream;
  sharedSymbols?: string[];
};

export function DreamLink({ dream, sharedSymbols = [] }: DreamLinkProps) {
  return (
    <Link
      className="block border-b border-line px-5 py-4 transition last:border-b-0 hover:bg-lavender-pale focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-purple"
      href={`/dreams/${dream.id}`}
    >
      <p className="font-handwritten text-xl font-semibold text-ink">
        {dream.title}
      </p>
      <p className="mt-1 font-base text-xs text-ink-soft">
        {dream.date}
        {sharedSymbols.length > 0 && ` · Shared: ${sharedSymbols.join(", ")}`}
      </p>
    </Link>
  );
}
