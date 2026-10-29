import type { Dream } from "@/types/dream";

export type ListSearchParams = Record<string, string | string[] | undefined>;

export function queryValues(value: string | string[] | undefined) {
  return value === undefined ? [] : Array.isArray(value) ? value : [value];
}

export function queryText(params: ListSearchParams) {
  return queryValues(params.q)[0]?.trim() ?? "";
}

export function matchesName(name: string, query: string) {
  return name.toLowerCase().includes(query.toLowerCase());
}

export function filterDreams(dreams: Dream[], query: string, moods: string[], symbols: string[]) {
  return dreams.filter(dream => matchesName(dream.title, query)
    && (moods.length === 0 || moods.includes(dream.mood))
    && symbols.every(symbol => dream.symbols.includes(symbol)));
}

export function paginate<T>(items: T[], value: ListSearchParams["page"], pageSize: number) {
  const raw = queryValues(value)[0] ?? "1";
  const requested = /^\d+$/.test(raw) ? Number(raw) : 1;
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(pages, Math.max(1, Number.isSafeInteger(requested) ? requested : 1));
  return { items: items.slice((page - 1) * pageSize, page * pageSize), page, pages };
}

export function listHref(path: string, params: ListSearchParams, page: number) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (key !== "page") for (const entry of queryValues(value)) query.append(key, entry);
  }
  query.set("page", String(page));
  return `${path}?${query}`;
}
