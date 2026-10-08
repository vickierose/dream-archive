import { MoonStar, MoveRight } from "lucide-react";
import Link from "next/link";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="grid min-h-screen grid-cols-1 md:grid-cols-3">
      {/* Illustration */}
      <section
        className="relative min-h-[50vh] bg-cover bg-center md:col-span-2 md:min-h-screen"
        style={{ backgroundImage: "url('/night-view.png')" }}
      >
        <Link
          href="/"
          className="focus-ring absolute left-8 top-6 font-handwritten text-xl text-white flex gap-1 items-center"
        >
          <MoonStar color="white" size={20} />
          Dream Archive
        </Link>
      </section>

      {/* Paper */}
      <section className="flex min-h-screen flex-col justify-center bg-paper px-8 py-12 md:px-12 lg:px-16">
        <div className="max-w-md">
          <Heading as="h1">Dream Archive</Heading>

          <p className="mt-4 max-w-60 text-sm leading-relaxed text-ink-soft">
            A private place for the things your sleeping mind invents.
          </p>

          <Button href="/login" className="mt-8">
            Enter the archive
            <MoveRight color="white" size={16} />
          </Button>
        </div>
      </section>
    </main>
  );
}
