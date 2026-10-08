"use server";

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
  const archive = await getUserArchiveRepository();
  const parsed = symbolSchema.safeParse(values);
  if (!parsed.success) return { error: "Enter a name and choose an emoji." };
  try {
    const symbol = await archive.createSymbol(parsed.data);
    // The form updates its symbol selection from the returned record. Do not
    // refresh its active layout while a modal is open and the dream is unsaved.
    revalidatePath("/symbols");
    revalidatePath("/dreams");
    return { symbol };
  } catch {
    return { error: "Could not add the symbol. Please try again." };
  }
}
