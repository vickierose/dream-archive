export enum Mood {
  "peaceful" = "Peaceful",
  "joyful" = "Joyful",
  "strange" = "Strange",
  "sad" = "Sad",
  "unsettling" = "Unsettling",
  "frightening" = "Frightening",
}

export interface Dream {
  id: string;
  title: string;
  plot: string;
  date: string;
  mood: Mood;
  symbols: string[];
}
