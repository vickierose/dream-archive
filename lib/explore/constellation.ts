import type { Dream } from "@/types/dream";
import type { Symbol } from "@/types/symbol";

export type ConstellationNode = Symbol & { dreamCount: number };
export type ConstellationLink = {
  source: string;
  target: string;
  dreamCount: number;
};
export type ConstellationData = {
  nodes: ConstellationNode[];
  links: ConstellationLink[];
};

export function buildConstellation(
  dreams: Pick<Dream, "symbols">[],
  symbols: Symbol[],
): ConstellationData {
  const counts = new Map<string, number>();
  const known = new Set(symbols.map((symbol) => symbol.id));
  const pairs = new Map<string, ConstellationLink>();

  for (const dream of dreams) {
    const ids = [...new Set(dream.symbols)].filter((id) => known.has(id)).sort();
    for (const id of ids) counts.set(id, (counts.get(id) ?? 0) + 1);
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const key = JSON.stringify([ids[i], ids[j]]);
        const pair = pairs.get(key);
        if (pair) pair.dreamCount++;
        else pairs.set(key, { source: ids[i], target: ids[j], dreamCount: 1 });
      }
    }
  }

  return {
    nodes: symbols.flatMap((symbol) => {
      const dreamCount = counts.get(symbol.id) ?? 0;
      return dreamCount ? [{ ...symbol, dreamCount }] : [];
    }),
    links: [...pairs.values()],
  };
}

export function nodeRadius(count: number) {
  return Math.min(34, 12 + 3 * Math.sqrt(count));
}

export function connectionWidth(count: number) {
  return count >= 8 ? 4 : count >= 4 ? 3 : count >= 2 ? 2 : 1;
}
