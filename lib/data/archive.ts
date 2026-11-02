import "server-only";

import { cache } from "react";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { createArchiveRepository } from "@/lib/db/archive";

export async function getUserArchiveRepository() {
  const user = await requireUser();
  return createArchiveRepository(db, user.id);
}

// React cache deduplicates reads within a render, not across users or requests.
export const getExploreArchive = cache(async () => {
  return (await getUserArchiveRepository()).getExploreArchive();
});

export const getDream = cache(async (id: string) => {
  return (await getUserArchiveRepository()).getDream(id);
});

export const getSymbol = cache(async (id: string) => {
  return (await getUserArchiveRepository()).getSymbol(id);
});

export const getFormSymbols = cache(async () => {
  // Keep authentication failures and redirects outside the recoverable DB read.
  const archive = await getUserArchiveRepository();
  try {
    return await archive.getSymbols();
  } catch {
    // The form stays usable; opening the symbol popup retries this failed read.
    return null;
  }
});
