import { Heading } from "@/components/ui/heading";
import { MoonStar } from "lucide-react";

export function ComingSoon() {
  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center gap-3">
      <span className="text-ink">
        <MoonStar size={36} />
      </span>
      <Heading as="h1">Coming soon...</Heading>
    </div>
  );
}
