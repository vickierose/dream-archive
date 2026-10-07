"use server";

import { revalidatePath } from "next/cache";
import { mockDreams } from "@/data/mock-dreams";
import { requireUser } from "@/lib/auth/session";
import { dreamSchema, type DreamFormValues } from "@/lib/validation/dream";

function formatDreamDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  });
}

export async function createDream(values: DreamFormValues) {
  await requireUser();
  const parsed = dreamSchema.safeParse(values);
  if (!parsed.success) return { error: "Check the dream fields and try again." };

  const id = crypto.randomUUID();
  mockDreams.push({
    ...parsed.data,
    id,
    date: formatDreamDate(parsed.data.date),
  });
  revalidatePath("/", "layout");
  return { id };
}

export async function deleteDream(id: string) {
  await requireUser();
  const index = mockDreams.findIndex((dream) => dream.id === id);
  if (index !== -1) mockDreams.splice(index, 1);
  revalidatePath("/", "layout");
}

export async function updateDream(id: string, values: DreamFormValues) {
  await requireUser();
  const parsed = dreamSchema.safeParse(values);
  if (!parsed.success) return { error: "Check the dream fields and try again." };
  const dream = mockDreams.find((dream) => dream.id === id);
  if (!dream) return { error: "This dream could not be found." };
  Object.assign(dream, parsed.data, {
    date: formatDreamDate(parsed.data.date),
  });
  revalidatePath("/", "layout");
  return { success: true };
}
