import {
  and,
  asc,
  count,
  desc,
  eq,
  exists,
  inArray,
  ne,
  sql,
} from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { z } from "zod";
import { Mood } from "../../types/dream";
import { pagination, type ListSearchParams } from "../archive-list";
import type { DreamFormValues } from "../validation/dream";
import * as schema from "./schema";

const { dreams, symbols, dreamSymbols } = schema;
const uuid = z.uuid();
type DreamFilters = {
  query?: string;
  moods?: string[];
  symbols?: string[];
  page?: ListSearchParams["page"];
};
type SymbolFilters = Pick<DreamFilters, "query" | "page">;
export class ArchiveError extends Error {}

// Internal repository: userId must come from the verified session, never form data.
export function createArchiveRepository(
  db: PgDatabase<PgQueryResultHKT, typeof schema>,
  userId: string,
) {
  // Correlated arrays fetch links only for the selected dreams, without duplicate rows.
  const symbolIds = sql<string[]>`array(
    select ${dreamSymbols.symbolId} from ${dreamSymbols}
    where ${dreamSymbols.userId} = ${userId} and ${dreamSymbols.dreamId} = ${dreams.id}
    order by ${dreamSymbols.symbolId}
  )`;
  const dreamFields = {
    id: dreams.id,
    title: dreams.title,
    date: dreams.date,
    mood: dreams.mood,
    symbols: symbolIds,
  };
  const dreamOrder = [
    desc(dreams.date),
    desc(dreams.createdAt),
    asc(dreams.id),
  ];
  const symbolFields = {
    id: symbols.id,
    name: symbols.name,
    emoji: symbols.emoji,
  };

  // strpos treats %, _ and backslashes literally, like the previous includes search.
  const containsText = (
    column: typeof dreams.title | typeof symbols.name,
    query: string,
  ) => sql`strpos(lower(${column}), lower(${query})) > 0`;

  async function getDreamPage({
    query = "",
    moods = [],
    symbols: selectedSymbols = [],
    page: requestedPage,
  }: DreamFilters = {}) {
    const validMoods = Object.values(Mood).filter((mood) =>
      moods.includes(mood),
    );
    const validSymbols = selectedSymbols.filter(
      (id) => uuid.safeParse(id).success,
    );
    const filter = and(
      containsText(dreams.title, query),
      moods.length
        ? validMoods.length
          ? inArray(dreams.mood, validMoods)
          : sql`false`
        : undefined,
      selectedSymbols.length
        ? validSymbols.length
          ? exists(
              db
                .select({ id: dreamSymbols.dreamId })
                .from(dreamSymbols)
                .where(
                  and(
                    eq(dreamSymbols.userId, userId),
                    eq(dreamSymbols.dreamId, dreams.id),
                    inArray(dreamSymbols.symbolId, validSymbols),
                  ),
                ),
            )
          : sql`false`
        : undefined,
    )!;
    // Counts and rows share a snapshot if another request edits the archive mid-read.
    return db.transaction(
      async (tx) => {
        const [counts] = await tx
          .select({
            total: count(),
            filteredTotal: sql`count(*) filter (where ${filter})`.mapWith(
              Number,
            ),
          })
          .from(dreams)
          .where(eq(dreams.userId, userId));
        const { page, pages, offset } = pagination(
          counts.filteredTotal,
          requestedPage,
          20,
        );
        const items = await tx
          .select(dreamFields)
          .from(dreams)
          .where(and(eq(dreams.userId, userId), filter))
          .orderBy(...dreamOrder)
          .limit(20)
          .offset(offset);
        return {
          items,
          total: counts.total,
          filteredTotal: counts.filteredTotal,
          page,
          pages,
        };
      },
      { isolationLevel: "repeatable read", accessMode: "read only" },
    );
  }

  async function getDream(id: string) {
    if (!uuid.safeParse(id).success) return undefined;
    const [dream] = await db
      .select({ ...dreamFields, plot: dreams.plot })
      .from(dreams)
      .where(and(eq(dreams.userId, userId), eq(dreams.id, id)))
      .limit(1);
    return dream;
  }

  async function getDreamSymbols(id: string) {
    if (!uuid.safeParse(id).success) return [];
    return db
      .select(symbolFields)
      .from(symbols)
      .innerJoin(
        dreamSymbols,
        and(
          eq(dreamSymbols.userId, symbols.userId),
          eq(dreamSymbols.symbolId, symbols.id),
        ),
      )
      .where(and(eq(symbols.userId, userId), eq(dreamSymbols.dreamId, id)))
      .orderBy(asc(symbols.id));
  }

  function symbolsForDream(id: string) {
    return db
      .select({ id: dreamSymbols.symbolId })
      .from(dreamSymbols)
      .where(
        and(eq(dreamSymbols.userId, userId), eq(dreamSymbols.dreamId, id)),
      );
  }

  async function getRelatedDreams(id: string) {
    if (!uuid.safeParse(id).success) return [];
    return db
      .select({
        id: dreams.id,
        title: dreams.title,
        date: dreams.date,
        symbols: symbolIds,
      })
      .from(dreams)
      .where(
        and(
          eq(dreams.userId, userId),
          ne(dreams.id, id),
          exists(
            db
              .select({ id: dreamSymbols.dreamId })
              .from(dreamSymbols)
              .where(
                and(
                  eq(dreamSymbols.userId, userId),
                  eq(dreamSymbols.dreamId, dreams.id),
                  inArray(dreamSymbols.symbolId, symbolsForDream(id)),
                ),
              ),
          ),
        ),
      )
      .orderBy(...dreamOrder);
  }

  const symbolDreamCount = sql`(
    select count(*) from ${dreamSymbols}
    where ${dreamSymbols.userId} = ${userId} and ${dreamSymbols.symbolId} = ${symbols.id}
  )`.mapWith(Number);

  async function getSymbolPage({
    query = "",
    page: requestedPage,
  }: SymbolFilters = {}) {
    const filter = containsText(symbols.name, query);
    return db.transaction(
      async (tx) => {
        const [counts] = await tx
          .select({
            total: count(),
            filteredTotal: sql`count(*) filter (where ${filter})`.mapWith(
              Number,
            ),
          })
          .from(symbols)
          .where(eq(symbols.userId, userId));
        const { page, pages, offset } = pagination(
          counts.filteredTotal,
          requestedPage,
          40,
        );
        const items = await tx
          .select({ ...symbolFields, dreamCount: symbolDreamCount })
          .from(symbols)
          .where(and(eq(symbols.userId, userId), filter))
          .orderBy(asc(symbols.name), asc(symbols.id))
          .limit(40)
          .offset(offset);
        return {
          items,
          total: counts.total,
          filteredTotal: counts.filteredTotal,
          page,
          pages,
        };
      },
      { isolationLevel: "repeatable read", accessMode: "read only" },
    );
  }

  async function getSymbol(id: string) {
    if (!uuid.safeParse(id).success) return undefined;
    const [symbol] = await db
      .select(symbolFields)
      .from(symbols)
      .where(and(eq(symbols.userId, userId), eq(symbols.id, id)))
      .limit(1);
    return symbol;
  }

  function dreamsForSymbol(id: string) {
    return db
      .select({ id: dreamSymbols.dreamId })
      .from(dreamSymbols)
      .where(
        and(eq(dreamSymbols.userId, userId), eq(dreamSymbols.symbolId, id)),
      );
  }

  async function getSymbolDreams(id: string) {
    if (!uuid.safeParse(id).success) return [];
    return db
      .select({ id: dreams.id, title: dreams.title, date: dreams.date })
      .from(dreams)
      .where(
        and(eq(dreams.userId, userId), inArray(dreams.id, dreamsForSymbol(id))),
      )
      .orderBy(...dreamOrder);
  }

  async function getFrequentSymbols(id: string) {
    if (!uuid.safeParse(id).success) return [];
    const related = await db
      .select({ ...symbolFields, count: count() })
      .from(symbols)
      .innerJoin(
        dreamSymbols,
        and(
          eq(dreamSymbols.userId, symbols.userId),
          eq(dreamSymbols.symbolId, symbols.id),
        ),
      )
      .where(
        and(
          eq(symbols.userId, userId),
          ne(symbols.id, id),
          inArray(dreamSymbols.dreamId, dreamsForSymbol(id)),
        ),
      )
      .groupBy(symbols.id, symbols.name, symbols.emoji);
    // Keep the existing localeCompare tie-break rather than adopting the DB collation.
    return related.sort(
      (a, b) => b.count - a.count || a.name.localeCompare(b.name),
    );
  }

  async function getExploreArchive() {
    const [entries, personalSymbols] = await Promise.all([
      db
        .select({
          id: dreams.id,
          title: dreams.title,
          date: dreams.date,
          symbols: symbolIds,
        })
        .from(dreams)
        .where(eq(dreams.userId, userId))
        .orderBy(...dreamOrder),
      getSymbols(),
    ]);
    return { dreams: entries, symbols: personalSymbols };
  }

  async function getSymbols() {
    return db
      .select({ id: symbols.id, name: symbols.name, emoji: symbols.emoji })
      .from(symbols)
      .where(eq(symbols.userId, userId))
      .orderBy(asc(symbols.name), asc(symbols.id));
  }

  async function createSymbol(values: { name: string; emoji: string }) {
    const name = values.name.trim();
    // ON CONFLICT handles two requests creating the same personal symbol at once.
    const [created] = await db
      .insert(symbols)
      .values({ userId, name, emoji: values.emoji })
      .onConflictDoNothing()
      .returning({ id: symbols.id, name: symbols.name, emoji: symbols.emoji });
    if (created) return created;
    const [existing] = await db
      .select({ id: symbols.id, name: symbols.name, emoji: symbols.emoji })
      .from(symbols)
      .where(
        and(
          eq(symbols.userId, userId),
          sql`lower(btrim(${symbols.name})) = lower(btrim(${name}))`,
        ),
      );
    if (!existing)
      throw new ArchiveError("Could not add the symbol. Please try again.");
    return existing;
  }

  async function saveDream(values: DreamFormValues, id?: string) {
    if (id !== undefined && !uuid.safeParse(id).success)
      throw new ArchiveError("This dream could not be found.");
    const selectedIds = [...new Set(values.symbols)];
    if (selectedIds.some((value) => !uuid.safeParse(value).success)) {
      throw new ArchiveError("Choose symbols from your own collection.");
    }
    return db.transaction(async (tx) => {
      if (selectedIds.length) {
        const owned = await tx
          .select({ id: symbols.id })
          .from(symbols)
          .where(
            and(eq(symbols.userId, userId), inArray(symbols.id, selectedIds)),
          );
        if (owned.length !== selectedIds.length)
          throw new ArchiveError("Choose symbols from your own collection.");
      }
      const fields = {
        title: values.title,
        plot: values.plot,
        date: values.date,
        mood: values.mood,
      };
      // The update locks the dream row, serializing concurrent link replacements.
      const [saved] =
        id !== undefined
          ? await tx
              .update(dreams)
              .set(fields)
              .where(and(eq(dreams.userId, userId), eq(dreams.id, id)))
              .returning({ id: dreams.id })
          : await tx
              .insert(dreams)
              .values({ ...fields, userId })
              .returning({ id: dreams.id });
      if (!saved) throw new ArchiveError("This dream could not be found.");
      await tx
        .delete(dreamSymbols)
        .where(
          and(
            eq(dreamSymbols.userId, userId),
            eq(dreamSymbols.dreamId, saved.id),
          ),
        );
      if (selectedIds.length) {
        await tx
          .insert(dreamSymbols)
          .values(
            selectedIds.map((symbolId) => ({
              userId,
              dreamId: saved.id,
              symbolId,
            })),
          );
      }
      return saved.id;
    });
  }

  async function deleteDream(id: string) {
    if (!uuid.safeParse(id).success)
      throw new ArchiveError("This dream could not be found.");
    const deleted = await db
      .delete(dreams)
      .where(and(eq(dreams.userId, userId), eq(dreams.id, id)))
      .returning({ id: dreams.id });
    if (!deleted.length)
      throw new ArchiveError("This dream could not be found.");
  }

  return {
    getDreamPage,
    getDream,
    getDreamSymbols,
    getRelatedDreams,
    getSymbolPage,
    getSymbol,
    getSymbolDreams,
    getFrequentSymbols,
    getExploreArchive,
    getSymbols,
    createSymbol,
    saveDream,
    deleteDream,
  };
}
