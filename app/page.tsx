import { MoonStar, MoveRight } from "lucide-react";
import Link from "next/link";

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
          className="absolute left-8 top-6 font-handwritten text-xl text-white flex gap-1 items-center"
        >
          <MoonStar color="white" size={20} />
          Dream Archive
        </Link>
      </section>

      {/* Paper */}
      <section className="flex min-h-screen flex-col justify-center bg-paper px-8 py-12 md:px-12 lg:px-16">
        <div className="max-w-md">
          <h1 className="mt-3 font-handwritten text-5xl text-ink">
            Dream Archive
          </h1>

          <p className="mt-5 font-base text-base text-ink-soft max-w-60">
            A private place for the things your sleeping mind invents.
          </p>

          <Link
            href="/login"
            className="mt-8 inline-flex items-center gap-2 rounded-full
                       bg-purple px-6 py-3
                       font-base text-sm text-white
                       transition hover:bg-purple-dark"
          >
            Enter the archive
            <MoveRight color="white" size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
