import { LockKeyhole } from "lucide-react";
import { useTranslations } from "next-intl";
import { ArchiveButton } from "./archive-button";

export function PrivacyCallout() {
  const t = useTranslations("Home");

  return (
    <section aria-labelledby="home-privacy-title" className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4 rounded-3xl border border-line bg-paper-light/55 p-5 shadow-paper sm:p-7">
        <span className="grid size-12 shrink-0 place-items-center rounded-full border border-line bg-lavender-pale text-purple sm:size-14">
          <LockKeyhole aria-hidden="true" size={24} />
        </span>
        <div className="min-w-0 flex-1 basis-48">
          <h2 id="home-privacy-title" className="text-xl font-extrabold sm:text-2xl">{t("privacyTitle")}</h2>
          <p className="mt-1 text-ink-soft">{t("privacyDescription")}</p>
        </div>
        <ArchiveButton />
      </div>
    </section>
  );
}
