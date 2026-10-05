"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { mockSymbols } from "@/data/mock-symbols";

const symbolSchema = z.object({
  name: z.string().trim().min(1).max(80),
  emoji: z.string().trim().min(1).max(32),
});

export async function getSymbols() {
  return mockSymbols;
}

export async function createSymbol(values: { name: string; emoji: string }) {
  const parsed = symbolSchema.safeParse(values);
  if (!parsed.success) return { error: "Enter a name and choose an emoji." };
  const existing = mockSymbols.find((symbol) =>
    symbol.name.toLowerCase() === parsed.data.name.toLowerCase());
  if (existing) return { symbol: existing };

  const symbol = { id: crypto.randomUUID(), ...parsed.data };
  mockSymbols.push(symbol);
  revalidatePath("/", "layout");
  return { symbol };
}
