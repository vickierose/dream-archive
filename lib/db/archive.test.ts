import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { Mood } from "../../types/dream";
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
      assert.deepEqual((await bob.getArchive()).dreams, []);
      const entry = (await alice.getArchive()).dreams[0];
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
      const entries = (await alice.getArchive()).dreams;
      assert.equal(entries.length, 1);
      assert.equal(entries[0].title, values.title);
    });

    await t.test("link failures roll back both creates and updates", async () => {
      await database.exec(`CREATE FUNCTION reject_test_link() RETURNS trigger LANGUAGE plpgsql AS $$
        BEGIN RAISE EXCEPTION 'test link failure'; END $$;
        CREATE TRIGGER reject_test_link BEFORE INSERT ON dream_symbols FOR EACH ROW EXECUTE FUNCTION reject_test_link();`);
      await assert.rejects(alice.saveDream(values));
      await assert.rejects(alice.saveDream({ ...values, title: "Should roll back" }, id));
      const entries = (await alice.getArchive()).dreams;
      assert.equal(entries.length, 1);
      assert.equal(entries[0].title, values.title);
      assert.deepEqual(entries[0].symbols, [moon.id]);
      await database.exec("DROP TRIGGER reject_test_link ON dream_symbols; DROP FUNCTION reject_test_link()");
    });

    await t.test("edits replace links, deduplicate selections, and allow zero symbols", async () => {
      const sea = await alice.createSymbol({ name: "Sea", emoji: "🌊" });
      await alice.saveDream({ ...values, symbols: [sea.id, sea.id] }, id);
      assert.deepEqual((await alice.getArchive()).dreams[0].symbols, [sea.id]);
      await alice.saveDream({ ...values, symbols: [] }, id);
      assert.deepEqual((await alice.getArchive()).dreams[0].symbols, []);
      await alice.deleteDream(id);
      assert.deepEqual((await alice.getArchive()).dreams, []);
      assert.equal((await alice.getSymbols()).length, 2);
      assert.deepEqual(await bob.getSymbols(), [otherMoon]);
    });
  } finally {
    await database.close();
  }
});
