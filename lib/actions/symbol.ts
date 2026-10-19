"use server";

import { getTranslations } from "next-intl/server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getUserArchiveRepository } from "@/lib/data/archive";

const symbolSchema = z.object({
  name: z.string().trim().min(1).max(80),
  emoji: z.string().trim().min(1).max(32),
});

export async function getSymbols() {
  const archive = await getUserArchiveRepository();
  return archive.getSymbols();
}

export async function createSymbol(values: { name: string; emoji: string }) {
  const t = await getTranslations();
  const archive = await getUserArchiveRepository();
  const parsed = symbolSchema.safeParse(values);
  if (!parsed.success) return { error: t("Errors.symbolFields") };
  try {
    const symbol = await archive.createSymbol(parsed.data);
    revalidatePath("/symbols");
    revalidatePath("/dreams");
    return { symbol };
  } catch {
    return { error: t("Errors.addSymbol") };
  }
}
