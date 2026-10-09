import type { ReactNode } from "react";
import { MoonStar } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-paper md:grid md:grid-cols-2">
      <header className="px-6 py-5 pb-1 sm:px-10 sm:py-6 md:hidden">
        <Link
          href="/"
          className="focus-ring inline-flex items-center gap-2 font-handwritten text-2xl text-purple"
        >
          <MoonStar aria-hidden="true" size={20} />
          Dream Archive
        </Link>
      </header>

      <section
        className="relative hidden min-h-svh bg-cover bg-center md:block"
        style={{ backgroundImage: "url('/night-view.png')" }}
      >
        <Link
          href="/"
          className="focus-ring absolute left-8 top-6 flex items-center gap-1 font-handwritten text-xl text-white"
        >
          <MoonStar aria-hidden="true" size={20} />
          Dream Archive
        </Link>
      </section>

      <main className="flex flex-1 items-start justify-center px-6 pt-6 pb-10 sm:items-center sm:px-10 sm:py-12 md:px-12 lg:px-16">
        {children}
      </main>
    </div>
  );
}
