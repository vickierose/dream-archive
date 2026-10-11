import "server-only";
import { getTranslations } from "next-intl/server";
import { ArchiveError } from "@/lib/db/archive";
import messages from "@/messages/en.json";

export async function translateArchiveError(error: unknown, fallback: "saveDream" | "deleteDream") {
  const t = await getTranslations("Errors");
  if (error instanceof ArchiveError) {
    for (const key of ["dreamNotFound", "ownSymbols", "addSymbol"] as const) {
      if (error.message === messages.Errors[key]) return t(key);
    }
  }
  return t(fallback);
}
