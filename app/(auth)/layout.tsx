import type { ReactNode } from "react";
import { MoonStar } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <section
        className="relative min-h-[35vh] bg-cover bg-center  md:min-h-screen"
        style={{ backgroundImage: "url('/night-view.png')" }}
      >
        <Link
          href="/"
          className="absolute left-8 top-6 flex items-center gap-1 font-handwritten text-xl text-white"
        >
          <MoonStar aria-hidden="true" size={20} />
          Dream Archive
        </Link>
      </section>

      <main className="flex min-h-screen items-center justify-center bg-paper px-8 py-12 md:px-12 lg:px-16">
        {children}
      </main>
    </div>
  );
}
