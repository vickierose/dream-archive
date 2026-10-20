"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { ConstellationData } from "@/lib/explore/constellation";

const ConstellationCanvas = dynamic(() => import("./constellation-canvas"), {
  ssr: false,
  loading: () => <ChartLoading />,
});

function ChartLoading() {
  const t = useTranslations("Explore");
  return <div role="status" className="flex h-[65svh] min-h-96 items-center justify-center text-sm text-ink-soft">{t("loading")}</div>;
}

export function SymbolConstellation({ data }: { data: ConstellationData }) {
  return <ConstellationCanvas data={data} />;
}
