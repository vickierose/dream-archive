import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { z } from "zod";
import type { Dream } from "../../types/dream";
import type { DreamFormValues } from "../validation/dream";
import * as schema from "./schema";

const { dreams, symbols, dreamSymbols } = schema;
const uuid = z.uuid();
export class ArchiveError extends Error {}

// Internal repository: userId must come from the verified session, never form data.
export function createArchiveRepository(db: PgDatabase<PgQueryResultHKT, typeof schema>, userId: string) {
  async function getArchive() {
    const [entries, personalSymbols, links] = await Promise.all([
      db.select().from(dreams).where(eq(dreams.userId, userId)).orderBy(desc(dreams.date), desc(dreams.createdAt), asc(dreams.id)),
      getSymbols(),
      db.select().from(dreamSymbols).where(eq(dreamSymbols.userId, userId)),
    ]);
    const symbolIds = new Map<string, string[]>();
    for (const link of links) {
      const ids = symbolIds.get(link.dreamId) ?? [];
      ids.push(link.symbolId);
      symbolIds.set(link.dreamId, ids);
    }
    const personalDreams: Dream[] = entries.map(({ id, title, plot, date, mood }) => ({
      id, title, plot, date, mood, symbols: (symbolIds.get(id) ?? []).sort(),
    }));
    return { dreams: personalDreams, symbols: personalSymbols };
  }

  async function getSymbols() {
    return db.select({ id: symbols.id, name: symbols.name, emoji: symbols.emoji })
      .from(symbols).where(eq(symbols.userId, userId)).orderBy(asc(symbols.name), asc(symbols.id));
  }

  async function createSymbol(values: { name: string; emoji: string }) {
    const name = values.name.trim();
    // ON CONFLICT handles two requests creating the same personal symbol at once.
    const [created] = await db.insert(symbols).values({ userId, name, emoji: values.emoji })
      .onConflictDoNothing().returning({ id: symbols.id, name: symbols.name, emoji: symbols.emoji });
    if (created) return created;
    const [existing] = await db.select({ id: symbols.id, name: symbols.name, emoji: symbols.emoji })
      .from(symbols).where(and(eq(symbols.userId, userId), sql`lower(btrim(${symbols.name})) = lower(btrim(${name}))`));
    if (!existing) throw new ArchiveError("Could not add the symbol. Please try again.");
    return existing;
  }

  async function saveDream(values: DreamFormValues, id?: string) {
    if (id !== undefined && !uuid.safeParse(id).success) throw new ArchiveError("This dream could not be found.");
    const selectedIds = [...new Set(values.symbols)];
    if (selectedIds.some((value) => !uuid.safeParse(value).success)) {
      throw new ArchiveError("Choose symbols from your own collection.");
    }
    return db.transaction(async (tx) => {
      if (selectedIds.length) {
        const owned = await tx.select({ id: symbols.id }).from(symbols)
          .where(and(eq(symbols.userId, userId), inArray(symbols.id, selectedIds)));
        if (owned.length !== selectedIds.length) throw new ArchiveError("Choose symbols from your own collection.");
      }
      const fields = { title: values.title, plot: values.plot, date: values.date, mood: values.mood };
      // The update locks the dream row, serializing concurrent link replacements.
      const [saved] = id !== undefined
        ? await tx.update(dreams).set(fields).where(and(eq(dreams.userId, userId), eq(dreams.id, id))).returning({ id: dreams.id })
        : await tx.insert(dreams).values({ ...fields, userId }).returning({ id: dreams.id });
      if (!saved) throw new ArchiveError("This dream could not be found.");
      await tx.delete(dreamSymbols).where(and(eq(dreamSymbols.userId, userId), eq(dreamSymbols.dreamId, saved.id)));
      if (selectedIds.length) {
        await tx.insert(dreamSymbols).values(selectedIds.map((symbolId) => ({ userId, dreamId: saved.id, symbolId })));
      }
      return saved.id;
    });
  }

  async function deleteDream(id: string) {
    if (!uuid.safeParse(id).success) throw new ArchiveError("This dream could not be found.");
    const deleted = await db.delete(dreams).where(and(eq(dreams.userId, userId), eq(dreams.id, id))).returning({ id: dreams.id });
    if (!deleted.length) throw new ArchiveError("This dream could not be found.");
  }

  return { getArchive, getSymbols, createSymbol, saveDream, deleteDream };
}
