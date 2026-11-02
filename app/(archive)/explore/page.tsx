import { getPageMetadata } from "@/lib/metadata";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { SymbolConstellation } from "@/components/explore/symbol-constellation";
import { getExploreArchive } from "@/lib/data/archive";
import { buildConstellation } from "@/lib/explore/constellation";

export default async function ExplorePage() {
  const t = await getTranslations();
  const { dreams, symbols } = await getExploreArchive();
  const data = buildConstellation(dreams, symbols);
  return (
    <div>
      <PageHeader
        title={t("Navigation.explore")}
        description={t("Explore.description")}
      />
      {data.nodes.length ? (
        <SymbolConstellation
          data={data}
          dreams={dreams.map(({ id, title, date, symbols }) => ({
            id,
            title,
            date,
            symbols,
          }))}
        />
      ) : (
        <EmptyState
          title={t("Explore.empty")}
          description={t("Explore.emptyDescription")}
        />
      )}
    </div>
  );
}

export async function generateMetadata() {
  return getPageMetadata("explore");
}
