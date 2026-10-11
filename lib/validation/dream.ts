import { z } from "zod";
import { Mood } from "@/types/dream";
import messages from "@/messages/en.json";

export function createDreamSchema(t: (key: "title" | "date" | "plot" | "mood") => string) {
  return z.object({
    title: z.string().trim().min(1, t("title")),
    date: z.iso.date(t("date")),
    plot: z.string().trim().min(1, t("plot")),
    mood: z.enum(Mood, { error: t("mood") }),
    symbols: z.array(z.string().min(1)),
  });
}

export const dreamSchema = createDreamSchema((key) => messages.Validation[key]);

export type DreamFormValues = z.infer<typeof dreamSchema>;
