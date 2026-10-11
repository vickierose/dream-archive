import { MoveRight } from "lucide-react";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Illustration } from "@/components/layout/illustration";

export default function Home() {
  return (
    <main className="flex min-h-svh flex-col bg-paper md:grid md:grid-cols-3">
      <section className="relative h-[clamp(10rem,32svh,20rem)] shrink-0 md:col-span-2 md:h-auto md:min-h-svh">
        <Illustration sizes="(min-width: 48rem) 66.67vw, 100vw" />
      </section>

      <section
        className="relative flex flex-1 flex-col justify-center bg-paper px-6 py-8 sm:px-10 md:px-8 md:py-12 md:shadow-paper-edge lg:px-12 xl:px-16"
      >
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
