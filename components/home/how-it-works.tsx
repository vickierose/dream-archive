import { Network, Pencil, Sparkles, Tag } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Heading } from "@/components/ui/heading";
import recordImage from "@/public/card_01.png";
import symbolsImage from "@/public/card_02.png";
import connectionsImage from "@/public/card_03.png";

const steps = [
  { key: "record", image: recordImage, icon: Pencil },
  { key: "symbols", image: symbolsImage, icon: Tag },
  { key: "connections", image: connectionsImage, icon: Network },
] as const;

export function HowItWorks() {
  const t = useTranslations("Home");

  return (
    <section id="how-it-works" aria-labelledby="how-it-works-title" className="mx-auto max-w-7xl scroll-mt-6 px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
      <div className="mb-8 flex items-center justify-center gap-3 text-center sm:gap-5">
        <Sparkles aria-hidden="true" size={18} className="shrink-0 text-lavender-dark" />
        <Heading as="h2" id="how-it-works-title" className="text-4xl sm:text-5xl">
          {t("howItWorks")}
        </Heading>
        <Sparkles aria-hidden="true" size={18} className="shrink-0 text-lavender-dark" />
      </div>
      <ol className="mx-auto grid max-w-md gap-8 md:max-w-none md:grid-cols-3 md:gap-5 lg:gap-8">
        {steps.map(({ key, image, icon: Icon }) => (
          <li key={key}>
            <Image
              src={image}
              alt={t(`steps.${key}.imageAlt`)}
              sizes="(min-width: 80rem) 24rem, (min-width: 48rem) 32vw, (min-width: 32rem) 28rem, 100vw"
              className="h-auto w-full rounded-2xl shadow-paper"
            />
            <div className="mt-5 flex items-start gap-3">
              <Icon aria-hidden="true" size={24} className="mt-0.5 shrink-0 text-purple" />
              <div>
                <h3 className="text-lg leading-snug font-extrabold sm:text-xl">{t(`steps.${key}.title`)}</h3>
                <p className="mt-1 leading-relaxed text-ink-soft">{t(`steps.${key}.description`)}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
