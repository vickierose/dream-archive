"use server";

import { getTranslations } from "next-intl/server";

import { revalidatePath } from "next/cache";
import { getUserArchiveRepository } from "@/lib/data/archive";
import { translateArchiveError } from "@/i18n/archive-error";
import { dreamSchema, type DreamFormValues } from "@/lib/validation/dream";

export async function createDream(values: DreamFormValues) {
  const t = await getTranslations();
  const archive = await getUserArchiveRepository();
  const parsed = dreamSchema.safeParse(values);
  if (!parsed.success) return { error: t("Errors.dreamFields") };
  try {
    const id = await archive.saveDream(parsed.data);
    revalidatePath("/", "layout");
    return { id };
  } catch (error) {
    return { error: await translateArchiveError(error, "saveDream") };
  }
}

export async function updateDream(id: string, values: DreamFormValues) {
  const t = await getTranslations();
  const archive = await getUserArchiveRepository();
  // Server Action arguments are untrusted even though TypeScript declares a string.
  if (typeof id !== "string") return { error: t("Errors.dreamNotFound") };
  const parsed = dreamSchema.safeParse(values);
  if (!parsed.success) return { error: t("Errors.dreamFields") };
  try {
    await archive.saveDream(parsed.data, id);
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { error: await translateArchiveError(error, "saveDream") };
  }
}

export async function deleteDream(id: string) {
  const archive = await getUserArchiveRepository();
  try {
    await archive.deleteDream(id);
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { error: await translateArchiveError(error, "deleteDream") };
  }
}
