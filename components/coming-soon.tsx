import { MoonStar } from "lucide-react";

export function ComingSoon() {
  return (
    <section className=" min-h-full flex flex-col items-center justify-center gap-2">
      <span className="text-ink">
        <MoonStar size={36} />
      </span>
      <h1 className="text-ink text-6xl font-handwritten">Coming soon...</h1>
    </section>
  );
}
