import { MoonStar } from "lucide-react";

export function ComingSoon() {
  return (
    <div className="flex min-h-[calc(100dvh-2rem)] flex-col items-center justify-center gap-2 lg:min-h-[calc(100dvh-4rem)]">
      <span className="text-ink">
        <MoonStar size={36} />
      </span>
      <h1 className="text-ink text-6xl font-handwritten">Coming soon...</h1>
    </div>
  );
}
