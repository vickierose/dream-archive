import { MoveRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function ArchiveButton({ inHeader = false }: { inHeader?: boolean }) {
  const t = useTranslations("Home");

  return (
    <Button href="/dreams" size={inHeader ? "sm" : "md"}>
      {t(inHeader ? "goToArchive" : "enter")}
      {!inHeader && <MoveRight aria-hidden="true" size={18} />}
    </Button>
  );
}
