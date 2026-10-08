"use server";

import { revalidatePath } from "next/cache";
import { getUserArchiveRepository } from "@/lib/data/archive";
import { ArchiveError } from "@/lib/db/archive";
import { dreamSchema, type DreamFormValues } from "@/lib/validation/dream";

export async function createDream(values: DreamFormValues) {
  const archive = await getUserArchiveRepository();
  const parsed = dreamSchema.safeParse(values);
  if (!parsed.success) return { error: "Check the dream fields and try again." };
  try {
    const id = await archive.saveDream(parsed.data);
    revalidatePath("/", "layout");
    return { id };
  } catch (error) {
    return { error: error instanceof ArchiveError ? error.message : "Could not save your dream. Please try again." };
  }
}

export async function updateDream(id: string, values: DreamFormValues) {
  const archive = await getUserArchiveRepository();
  // Server Action arguments are untrusted even though TypeScript declares a string.
  if (typeof id !== "string") return { error: "This dream could not be found." };
  const parsed = dreamSchema.safeParse(values);
  if (!parsed.success) return { error: "Check the dream fields and try again." };
  try {
    await archive.saveDream(parsed.data, id);
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { error: error instanceof ArchiveError ? error.message : "Could not save your dream. Please try again." };
  }
}

export async function deleteDream(id: string) {
  const archive = await getUserArchiveRepository();
  try {
    await archive.deleteDream(id);
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { error: error instanceof ArchiveError ? error.message : "Could not delete your dream. Please try again." };
  }
}
