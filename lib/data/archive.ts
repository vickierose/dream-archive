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
export const getArchive = cache(async () => {
  const archive = await getUserArchiveRepository();
  return archive.getArchive();
});

export async function getDream(id: string) {
  const archive = await getArchive();
  return archive.dreams.find((dream) => dream.id === id);
}
