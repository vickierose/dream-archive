"use client";

import { BookOpen, Compass, LogOut, MoonStar, Shapes } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/dreams", label: "Dreams", icon: BookOpen },
  { href: "/symbols", label: "Symbols", icon: Shapes },
  { href: "/explore", label: "Explore", icon: Compass },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col overflow-hidden border-r border-line bg-lavender-pale px-4 py-6">
      <Link
        className="flex items-center gap-2 px-3 font-handwritten font-medium text-xl text-ink "
        href="/dreams"
      >
        <MoonStar aria-hidden="true" className="text-purple" size={20} />
        Dream Archive
      </Link>

      <nav aria-label="Archive navigation" className="mt-9 space-y-1">
        {navigation.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-base text-sm transition ${
                isActive
                  ? "bg-lavender-light font-semibold text-ink"
                  : "text-ink-soft hover:bg-lavender-light hover:text-ink"
              }`}
              href={href}
              key={href}
            >
              <Icon aria-hidden="true" size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <button
        className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2.5 font-base text-sm text-ink-soft transition hover:bg-lavender-pale hover:text-ink"
        type="button"
      >
        <LogOut aria-hidden="true" size={18} />
        Log out
      </button>
    </aside>
  );
}
