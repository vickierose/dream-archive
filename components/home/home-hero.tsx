import { useTranslations } from "next-intl";
import { Illustration } from "@/components/layout/illustration";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { ArchiveButton } from "./archive-button";
import styles from "./home-hero.module.css";

export function HomeHero() {
  const t = useTranslations();

  return (
    <section
      aria-labelledby="home-title"
      className="grid items-center md:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
    >
      <div
        className={`relative h-[clamp(23rem,75vw,33rem)] overflow-hidden bg-night md:col-start-1 md:row-start-1 md:h-full md:min-h-[clamp(36rem,52vw,49rem)] ${styles.illustration}`}
      >
        <Illustration sizes="(min-width: 64rem) 66.67vw, (min-width: 48rem) 50vw, 100vw" />
      </div>
      <div className="px-5 py-4 sm:px-8 md:col-start-2 md:row-start-1 md:pt-24 md:pb-12 lg:px-12">
        <Heading as="h1" id="home-title" className="text-5xl">
          {t("Common.appName")}
        </Heading>
        <p className="mt-4 max-w-md text-lg leading-snug font-semibold text-pretty">
          {t("Home.intro")}
        </p>
        <p className="mt-4 max-w-sm leading-relaxed text-pretty text-ink-soft">
          {t("Home.description")}
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <ArchiveButton />
          <Button href="#how-it-works" variant="secondary">
            {t("Home.seeHowItWorks")}
          </Button>
        </div>
      </div>
    </section>
  );
}
