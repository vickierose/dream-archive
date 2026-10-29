import { useTranslations } from "next-intl";
import { Spinner } from "@/components/ui/spinner";

export function PageLoader({ fullScreen = false }: { fullScreen?: boolean }) {
  const t = useTranslations("Common");

  return (
    <div
      role="status"
      className={`flex items-center justify-center gap-3 text-purple ${fullScreen ? "min-h-svh bg-paper" : "min-h-64"}`}
    >
      <Spinner className="size-7" />
      <span className="sr-only">{t("wait")}</span>
    </div>
  );
}
