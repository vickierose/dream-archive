import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { Mood } from "../../types/dream";
import { filterDreams, paginate } from "../archive-list";
import { createArchiveRepository } from "./archive";
import * as schema from "./schema";

test("archive queries isolate users and save atomically", async (t) => {
  const database = new PGlite();
  try {
    await database.exec('CREATE SCHEMA neon_auth; CREATE TABLE neon_auth."user" (id uuid PRIMARY KEY)');
    const db = drizzle(database, { schema });
    await migrate(db, { migrationsFolder: "./drizzle" });
    const aliceId = randomUUID();
    const bobId = randomUUID();
    await database.query('INSERT INTO neon_auth."user" VALUES ($1), ($2)', [aliceId, bobId]);
    const alice = createArchiveRepository(db, aliceId);
    const bob = createArchiveRepository(db, bobId);
    const moon = await alice.createSymbol({ name: "Moon", emoji: "🌙" });
    const otherMoon = await bob.createSymbol({ name: "Moon", emoji: "🌕" });
    const values = { title: "Moonlit sea", plot: "I saw the moon", date: "2026-10-08", mood: Mood.peaceful, symbols: [moon.id] };
    const id = await alice.saveDream(values);

    await t.test("lists, symbol reuse, and date round trips stay personal", async () => {
      assert.equal((await alice.createSymbol({ name: " moon ", emoji: "🌑" })).id, moon.id);
      assert.deepEqual(await bob.getSymbols(), [otherMoon]);
      assert.deepEqual((await bob.getDreamPage()).items, []);
      const entry = (await alice.getDream(id))!;
      assert.equal(entry.date, values.date);
      assert.deepEqual(entry.symbols, [moon.id]);
      assert.equal("userId" in entry, false);
    });

    await t.test("foreign or malformed IDs cannot update, delete, or attach records", async () => {
      await assert.rejects(bob.saveDream({ ...values, symbols: [] }, id), /could not be found/);
      await assert.rejects(bob.deleteDream(id), /could not be found/);
      await assert.rejects(alice.saveDream({ ...values, title: "Changed", symbols: [otherMoon.id] }, id), /own collection/);
      await assert.rejects(alice.saveDream({ ...values, symbols: [otherMoon.id] }), /own collection/);
      await assert.rejects(alice.saveDream({ ...values, symbols: ["invalid"] }), /own collection/);
      await assert.rejects(alice.deleteDream("invalid"), /could not be found/);
      const entries = (await alice.getDreamPage()).items;
      assert.equal(entries.length, 1);
      assert.equal(entries[0].title, values.title);
    });

    await t.test("link failures roll back both creates and updates", async () => {
      await database.exec(`CREATE FUNCTION reject_test_link() RETURNS trigger LANGUAGE plpgsql AS $$
        BEGIN RAISE EXCEPTION 'test link failure'; END $$;
        CREATE TRIGGER reject_test_link BEFORE INSERT ON dream_symbols FOR EACH ROW EXECUTE FUNCTION reject_test_link();`);
      await assert.rejects(alice.saveDream(values));
      await assert.rejects(alice.saveDream({ ...values, title: "Should roll back" }, id));
      const entries = (await alice.getDreamPage()).items;
      assert.equal(entries.length, 1);
      assert.equal(entries[0].title, values.title);
      assert.deepEqual(entries[0].symbols, [moon.id]);
      await database.exec("DROP TRIGGER reject_test_link ON dream_symbols; DROP FUNCTION reject_test_link()");
    });

    await t.test("edits replace links, deduplicate selections, and allow zero symbols", async () => {
      const sea = await alice.createSymbol({ name: "Sea", emoji: "🌊" });
      await alice.saveDream({ ...values, symbols: [sea.id, sea.id] }, id);
      assert.deepEqual((await alice.getDream(id))!.symbols, [sea.id]);
      await alice.saveDream({ ...values, symbols: [] }, id);
      assert.deepEqual((await alice.getDream(id))!.symbols, []);
      await alice.deleteDream(id);
      assert.deepEqual((await alice.getDreamPage()).items, []);
      assert.equal((await alice.getSymbols()).length, 2);
      assert.deepEqual(await bob.getSymbols(), [otherMoon]);
    });
  } finally {
    await database.close();
  }
});

test("targeted archive reads preserve filters, pages, relations, and ownership", async (t) => {
  const database = new PGlite();
  const statements: string[] = [];
  try {
    await database.exec('CREATE SCHEMA neon_auth; CREATE TABLE neon_auth."user" (id uuid PRIMARY KEY)');
    const db = drizzle(database, { schema, logger: { logQuery: (query) => statements.push(query) } });
    await migrate(db, { migrationsFolder: "./drizzle" });
    const aliceId = randomUUID();
    const bobId = randomUUID();
    await database.query('INSERT INTO neon_auth."user" VALUES ($1), ($2)', [aliceId, bobId]);
    const alice = createArchiveRepository(db, aliceId);
    const bob = createArchiveRepository(db, bobId);
    const moon = { id: randomUUID(), name: "Moon 100%_\\ trail", emoji: "*" };
    const sea = { id: randomUUID(), name: "Місяць", emoji: "*" };
    const tree = { id: randomUUID(), name: "Tree", emoji: "*" };
    const personalSymbols = [moon, sea, tree, ...Array.from({ length: 42 }, (_, i) => ({
      id: randomUUID(), name: `Unused ${String(i).padStart(2, "0")}`, emoji: "*",
    }))];
    await db.insert(schema.symbols).values(personalSymbols.map((symbol) => ({ ...symbol, userId: aliceId })));
    const bobMoon = await bob.createSymbol({ name: moon.name, emoji: "*" });
    const symbolSets: string[][] = [[moon.id, sea.id], [moon.id, tree.id], [sea.id, tree.id], [], [moon.id, sea.id, tree.id]];
    const entries = Array.from({ length: 43 }, (_, i) => ({
      id: randomUUID(),
      title: ["Moon 100%_\\ trail", "Moonlight", "Місяць"][i] ?? `Dream ${String(i).padStart(2, "0")}`,
      plot: `Private plot ${i}`,
      date: i < 3 ? "2026-10-12" : "2026-10-11",
      mood: i % 2 ? Mood.sad : Mood.peaceful,
      symbols: (symbolSets[i] ?? []).sort(),
      createdAt: new Date(Date.UTC(2026, 9, 1, 12, i % 3)),
    }));
    await db.insert(schema.dreams).values(entries.map(({ id, title, plot, date, mood, createdAt }) => ({
      id, title, plot, date, mood, createdAt, userId: aliceId,
    })));
    await db.insert(schema.dreamSymbols).values(entries.flatMap((entry) => entry.symbols.map((symbolId) => ({
      userId: aliceId, dreamId: entry.id, symbolId,
    }))));
    const bobDreamId = await bob.saveDream({
      title: entries[0].title, plot: "Bob's private plot", date: "2026-10-13", mood: Mood.peaceful, symbols: [bobMoon.id],
    });
    const ordered = [...entries].sort((a, b) => b.date.localeCompare(a.date)
      || b.createdAt.getTime() - a.createdAt.getTime() || a.id.localeCompare(b.id));

    await t.test("dream filtering matches existing semantics, including literal search characters", async () => {
      const cases = [
        { query: "", moods: [], symbols: [] },
        { query: "MOON", moods: [Mood.peaceful, Mood.sad], symbols: [moon.id, sea.id] },
        { query: "", moods: [], symbols: [moon.id, sea.id, moon.id] },
        { query: "", moods: ["invalid", Mood.sad], symbols: ["invalid", moon.id] },
        { query: "", moods: ["invalid"], symbols: [] },
        { query: "", moods: [], symbols: ["invalid", bobMoon.id] },
        { query: "міся", moods: [], symbols: [] },
        ...["%", "_", "\\", "' OR true --"].map((query) => ({ query, moods: [], symbols: [] })),
      ];
      for (const filters of cases) {
        const expected = filterDreams(ordered, filters.query, filters.moods, filters.symbols);
        const result = await alice.getDreamPage(filters);
        assert.equal(result.total, entries.length);
        assert.equal(result.filteredTotal, expected.length);
        assert.deepEqual(result.items.map((entry) => entry.id), expected.slice(0, 20).map((entry) => entry.id));
        assert.ok(result.items.every((entry) => !("plot" in entry) && !("userId" in entry)));
      }
    });

    await t.test("pagination uses filtered counts and stable date, creation time, and ID order", async () => {
      for (const requested of [undefined, "1", "2", "3", "99", "0", "-2", "NaN", "1.5", "999999999999999999999", ["2", "3"]]) {
        const result = await alice.getDreamPage({ page: requested });
        const expected = paginate(ordered, requested, 20);
        assert.equal(result.page, expected.page);
        assert.equal(result.pages, expected.pages);
        assert.deepEqual(result.items.map((entry) => entry.id), expected.items.map((entry) => entry.id));
      }
      const filtered = await alice.getDreamPage({ symbols: [moon.id], page: "99" });
      assert.equal(filtered.page, 1);
      assert.equal(filtered.pages, 1);
      assert.equal(filtered.items.length, 3);
      const empty = await alice.getDreamPage({ query: "missing", page: "99" });
      assert.deepEqual({ items: empty.items, page: empty.page, pages: empty.pages }, { items: [], page: 1, pages: 1 });
    });

    await t.test("symbol pages aggregate counts and retain unused symbols", async () => {
      const first = await alice.getSymbolPage();
      const second = await alice.getSymbolPage({ page: "99" });
      assert.equal(first.total, 45);
      assert.equal(first.items.length, 40);
      assert.equal(second.page, 2);
      assert.equal(second.items.length, 5);
      assert.equal(new Set([...first.items, ...second.items].map((symbol) => symbol.id)).size, 45);
      assert.deepEqual([...first.items, ...second.items].map((symbol) => symbol.id),
        [moon.id, tree.id, ...personalSymbols.slice(3).map((symbol) => symbol.id), sea.id]);
      for (const symbol of [...first.items, ...second.items]) {
        assert.equal(symbol.dreamCount, entries.filter((entry) => entry.symbols.includes(symbol.id)).length);
      }
      for (const query of ["%", "_", "\\", "MOON", "міся", "missing"]) {
        const result = await alice.getSymbolPage({ query, page: "99" });
        const expected = personalSymbols.filter((symbol) => symbol.name.toLowerCase().includes(query.toLowerCase()));
        assert.equal(result.filteredTotal, expected.length);
        assert.deepEqual(result.items.map((symbol) => symbol.id).sort(), expected.map((symbol) => symbol.id).sort());
      }
      assert.deepEqual((await bob.getSymbolPage()).items.map((symbol) => [symbol.id, symbol.dreamCount]), [[bobMoon.id, 1]]);
    });

    await t.test("detail and related queries return only the owner's relevant records", async () => {
      const dream = (await alice.getDream(entries[0].id))!;
      assert.equal(dream.plot, entries[0].plot);
      assert.deepEqual(dream.symbols, entries[0].symbols);
      assert.deepEqual(await alice.getDreamSymbols(dream.id), [moon, sea].sort((a, b) => a.id.localeCompare(b.id)));
      const related = await alice.getRelatedDreams(dream.id);
      const expected = ordered.filter((entry) => entry.id !== dream.id && entry.symbols.some((id) => dream.symbols.includes(id)));
      assert.deepEqual(related.map((entry) => entry.id), expected.map((entry) => entry.id));
      assert.ok(related.every((entry) => !("plot" in entry) && !("mood" in entry)));
      assert.deepEqual(await alice.getSymbol(moon.id), moon);
      const moonDreams = await alice.getSymbolDreams(moon.id);
      assert.deepEqual(moonDreams, ordered.filter((entry) => entry.symbols.includes(moon.id)).map(({ id, title, date }) => ({ id, title, date })));
      assert.deepEqual((await alice.getFrequentSymbols(moon.id)).map(({ id, count }) => ({ id, count })).sort((a, b) => a.id.localeCompare(b.id)),
        [{ id: sea.id, count: 2 }, { id: tree.id, count: 2 }].sort((a, b) => a.id.localeCompare(b.id)));
      assert.deepEqual((await alice.getFrequentSymbols(moon.id)).map(({ name }) => name),
        [sea.name, tree.name].sort((a, b) => a.localeCompare(b)));
      for (const id of ["invalid", randomUUID(), bobDreamId]) {
        assert.equal(await alice.getDream(id), undefined);
        assert.deepEqual(await alice.getDreamSymbols(id), []);
        assert.deepEqual(await alice.getRelatedDreams(id), []);
      }
      for (const id of ["invalid", randomUUID(), bobMoon.id]) {
        assert.equal(await alice.getSymbol(id), undefined);
        assert.deepEqual(await alice.getSymbolDreams(id), []);
        assert.deepEqual(await alice.getFrequentSymbols(id), []);
      }
      assert.deepEqual(await alice.getRelatedDreams(entries[3].id), []);
      assert.deepEqual(await alice.getSymbolDreams(personalSymbols[3].id), []);
    });

    await t.test("malformed detail IDs return no record without issuing SQL", async () => {
      statements.length = 0;
      for (const id of ["", "invalid", "' OR true --", "00000000-0000-4000-8000-not-a-uuid"]) {
        assert.equal(await alice.getDream(id), undefined);
        assert.equal(await alice.getSymbol(id), undefined);
      }
      assert.deepEqual(statements, []);
    });

    await t.test("empty accounts have zero counts and a single empty page", async () => {
      const empty = createArchiveRepository(db, randomUUID());
      const expected = { items: [], total: 0, filteredTotal: 0, page: 1, pages: 1 };
      assert.deepEqual(await empty.getDreamPage({ page: "99" }), expected);
      assert.deepEqual(await empty.getSymbolPage({ page: "99" }), expected);
      assert.deepEqual(await empty.getExploreArchive(), { dreams: [], symbols: [] });
    });

    await t.test("summary reads never select plots and list queries limit rows in SQL", async () => {
      statements.length = 0;
      await alice.getDreamPage({ page: "2" });
      await alice.getSymbolPage({ page: "2" });
      await alice.getRelatedDreams(entries[0].id);
      await alice.getSymbolDreams(moon.id);
      const explore = await alice.getExploreArchive();
      assert.deepEqual(explore.dreams.map((dream) => dream.id), ordered.map((dream) => dream.id));
      assert.ok(explore.dreams.every((dream) => !("plot" in dream) && !("mood" in dream)));
      assert.ok(statements.every((query) => !query.includes('"plot"')));
      assert.equal(statements.filter((query) => query.includes("limit") && query.includes("offset")).length, 2);
    });
  } finally {
    await database.close();
  }
});
