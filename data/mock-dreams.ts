import { Mood, type Dream } from "@/types/dream";

export const mockDreams: Dream[] = [
  {
    id: "house-by-the-sea",
    title: "The House by the Sea",
    plot: "I wandered through an empty house where every room opened onto the sea.",
    date: "September 14, 2026",
    mood: Mood.unsettling,
    symbols: ["forest", "sea", "moon"],
  },
  {
    id: "snowy-mountain",
    title: "The Snowy Mountain",
    plot: "I climbed a quiet mountain trail until the clouds turned into falling snow.",
    date: "August 21, 2026",
    mood: Mood.peaceful,
    symbols: ["mountain", "snow", "moon"],
  },
];
