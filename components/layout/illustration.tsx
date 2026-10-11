import { MoonStar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Fireflies from "@/components/ui/fireflies";

export function Illustration({ sizes }: { sizes: string }) {
  return (
    <>
      <Image
        src="/night-view.png"
        alt=""
        fill
        sizes={sizes}
        loading="eager"
        className="object-cover object-center"
      />
      <Fireflies />
      <Link
        href="/"
        className="focus-ring absolute left-6 top-5 flex items-center gap-1 rounded-full bg-night/40 px-3 py-1 font-handwritten text-xl text-white md:left-8 md:top-6"
      >
        <MoonStar aria-hidden="true" size={20} />
        Dream Archive
      </Link>
    </>
  );
}
