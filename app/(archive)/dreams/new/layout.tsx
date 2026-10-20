import type { ReactNode } from "react";
import { getPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return getPageMetadata("newDream");
}

export default function NewDreamLayout({ children }: { children: ReactNode }) {
  return children;
}
