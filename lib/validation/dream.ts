import { z } from "zod";
import { Mood } from "@/types/dream";
import messages from "@/messages/en.json";
import { MAX_DREAM_TITLE_LENGTH, MAX_DREAM_SYMBOLS } from "./dream-limits";

export function createDreamSchema(t: (key: "title" | "titleMax" | "date" | "plot" | "mood" | "symbolsMax") => string) {
  return z.object({
    title: z.string().trim().min(1, t("title")).max(MAX_DREAM_TITLE_LENGTH, t("titleMax")),
    date: z.iso.date(t("date")),
    plot: z.string().trim().min(1, t("plot")),
    mood: z.enum(Mood, { error: t("mood") }),
    symbols: z.array(z.string().min(1)).max(MAX_DREAM_SYMBOLS, t("symbolsMax")),
  });
}

export const dreamSchema = createDreamSchema((key) => messages.Validation[key]);

export type DreamFormValues = z.infer<typeof dreamSchema>;
