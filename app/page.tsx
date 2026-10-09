import { MoonStar, MoveRight } from "lucide-react";
import Link from "next/link";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-svh flex-col bg-paper md:grid md:grid-cols-3">
      {/* Illustration */}
      <section
        className="relative h-[clamp(10rem,32svh,20rem)] shrink-0 bg-cover bg-center md:col-span-2 md:h-auto md:min-h-svh"
        style={{ backgroundImage: "url('/night-view.png')" }}
      >
        <Link
          href="/"
          className="focus-ring absolute left-6 top-5 flex items-center gap-1 rounded-full bg-night/40 px-3 py-1 font-handwritten text-xl text-white md:left-8 md:top-6"
        >
          <MoonStar aria-hidden="true" size={20} />
          Dream Archive
        </Link>
      </section>

      {/* Paper */}
      <section className="flex flex-1 flex-col justify-center px-6 py-8 sm:px-10 md:px-8 md:py-12 lg:px-12 xl:px-16">
        <div className="mx-auto w-full max-w-md">
          <Heading as="h1">Dream Archive</Heading>

          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
            A private place for the things your sleeping mind invents.
          </p>

          <Button href="/login" className="mt-8">
            Enter the archive
            <MoveRight aria-hidden="true" size={16} />
          </Button>
        </div>
      </section>
    </main>
  );
}
