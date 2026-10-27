import Link from "next/link";
import { useTranslations } from "next-intl";
import { listHref, type ListSearchParams } from "@/lib/archive-list";

export function Pagination({
  path,
  params,
  page,
  pages,
}: {
  path: string;
  params: ListSearchParams;
  page: number;
  pages: number;
}) {
  const t = useTranslations("ArchiveList");
  if (pages <= 1) return null;
  const numbers = Array.from(new Set([1, page - 1, page, page + 1, pages]))
    .filter((value) => value >= 1 && value <= pages)
    .sort((a, b) => a - b);
  const classes =
    "control-interaction inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-line px-3 text-sm text-ink hover:bg-lavender-light focus-visible:outline-purple";
  return (
    <nav
      aria-label={t("pagination")}
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 && (
        <Link className={classes} href={listHref(path, params, page - 1)}>
          {t("previous")}
        </Link>
      )}
      {numbers.map((number, index) => (
        <span key={number} className="contents">
          {index > 0 && number - numbers[index - 1] > 1 && (
            <span aria-hidden="true" className="px-1">
              …
            </span>
          )}
          <Link
            className={`${classes} ${number === page ? "bg-purple text-white hover:bg-purple-dark" : ""}`}
            href={listHref(path, params, number)}
            aria-label={t("page", { page: number })}
            aria-current={number === page ? "page" : undefined}
          >
            {number}
          </Link>
        </span>
      ))}
      {page < pages && (
        <Link className={classes} href={listHref(path, params, page + 1)}>
          {t("next")}
        </Link>
      )}
    </nav>
  );
}
