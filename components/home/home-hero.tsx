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
      className="relative grid items-center md:min-h-[clamp(40rem,54vw,52rem)]"
    >
      <div
        className={`relative h-[clamp(23rem,75vw,33rem)] overflow-hidden bg-night md:absolute md:inset-0 md:h-auto ${styles.illustration}`}
      >
        <Illustration
          sizes="100vw"
          showBrand={false}
        />
      </div>
      <div className="px-5 py-4 sm:px-8 md:relative md:z-1 md:my-28 md:mr-8 md:flex md:min-h-96 md:w-[calc(100%-4rem)] md:max-w-md md:flex-col md:justify-center md:justify-self-end md:p-10 lg:mr-[max(3rem,calc((100vw-74rem)/2))] lg:max-w-lg xl:p-14">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 hidden -rotate-2 rounded-paper bg-paper-dark shadow-paper md:block"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 hidden rounded-paper bg-paper-light shadow-paper-raised md:block"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-4 right-8 hidden h-10 w-28 rotate-6 bg-tape/65 shadow-tape md:block"
        />
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
