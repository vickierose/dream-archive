import { z } from "zod";
import { Mood } from "@/types/dream";

export const dreamSchema = z.object({
  title: z.string().trim().min(1, "Give your dream a title."),
  date: z.iso.date("Choose a valid date."),
  plot: z.string().trim().min(1, "Describe your dream.").max(3000, "Keep your dream within 3000 characters."),
  mood: z.enum(Mood, { error: "Choose a mood for your dream." }),
  symbols: z.array(z.string().min(1)),
});

export type DreamFormValues = z.infer<typeof dreamSchema>;
