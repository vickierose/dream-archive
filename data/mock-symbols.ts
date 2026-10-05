import type { Symbol } from "@/types/symbol";

const initialSymbols: Symbol[] = [
  { id: "forest", name: "Forest", emoji: "🌲" },
  { id: "sea", name: "Sea", emoji: "🌊" },
  { id: "mountain", name: "Mountain", emoji: "⛰️" },
  { id: "snow", name: "Snow", emoji: "❄️" },
  { id: "moon", name: "Moon", emoji: "🌙" },
  { id: "clouds", name: "Clouds", emoji: "☁️" },
];

const mockStore = globalThis as typeof globalThis & { dreamArchiveSymbols?: Symbol[] };
export const mockSymbols = (mockStore.dreamArchiveSymbols ??= initialSymbols);
