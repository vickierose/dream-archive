import { useTranslations } from "next-intl";
import { Heading } from "@/components/ui/heading";

export function DreamPatterns() {
  const t = useTranslations("Home");

  return (
    <section
      aria-labelledby="dream-patterns-title"
      className="rounded-[2.5rem] bg-linear-to-br from-lavender-light via-paper-lilac to-lavender-light"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-6 px-5 py-9 sm:px-8 md:grid-cols-[1.25fr_1fr] lg:gap-16 lg:px-12 lg:py-12">
        <div
          aria-hidden="true"
          className="aspect-video rounded-2xl border border-line bg-paper-light/55 max-md:row-start-2"
        />
        <div>
          <div className="flex items-center gap-3">
            <Heading
              as="h2"
              id="dream-patterns-title"
              className="max-w-sm text-4xl text-balance sm:text-5xl"
            >
              {t("patternsTitle")}
            </Heading>
          </div>
          <p className="mt-4 max-w-sm leading-relaxed text-ink-soft sm:text-lg">
            {t("patternsDescription")}
          </p>
        </div>
      </div>
    </section>
  );
}
