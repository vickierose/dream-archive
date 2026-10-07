import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { generateDrizzleJson, generateMigration } from "drizzle-kit/api";
import * as schema from "./schema";

test("database ownership and integrity constraints", async (t) => {
  // Real PostgreSQL semantics, entirely in memory; never loads DATABASE_URL.
  const database = new PGlite();
  try {
    const snapshot = generateDrizzleJson(schema);
    assert.deepEqual(Object.keys(snapshot.tables).sort(), [
      "public.dream_symbols", "public.dreams", "public.symbols",
    ]);
    const statements = await generateMigration(generateDrizzleJson({}), snapshot);
    // Stand-in for the Neon-managed table; application DDL must not create it.
    await database.exec('CREATE SCHEMA neon_auth; CREATE TABLE neon_auth."user" (id uuid PRIMARY KEY)');
    for (const statement of statements) await database.exec(statement);

    const alice = randomUUID();
    const bob = randomUUID();
    await database.query('INSERT INTO neon_auth."user" (id) VALUES ($1), ($2)', [alice, bob]);

    async function addDream(owner: string) {
      const result = await database.query<{ id: string }>(
        `INSERT INTO dreams (user_id, title, plot, dream_date, mood)
         VALUES ($1, 'A dream', 'Walking by the sea', '2026-10-07', 'Peaceful') RETURNING id`, [owner]);
      return result.rows[0].id;
    }
    async function addSymbol(owner: string, name: string) {
      const result = await database.query<{ id: string }>(
        `INSERT INTO symbols (user_id, name, emoji) VALUES ($1, $2, '🌙') RETURNING id`, [owner, name]);
      return result.rows[0].id;
    }
    async function link(owner: string, dream: string, symbol: string) {
      return database.query("INSERT INTO dream_symbols (user_id, dream_id, symbol_id) VALUES ($1, $2, $3)", [owner, dream, symbol]);
    }

    const aliceDream = await addDream(alice);
    const bobDream = await addDream(bob);
    const aliceMoon = await addSymbol(alice, "Moon");
    const bobMoon = await addSymbol(bob, "Moon");

    await t.test("symbol names are unique only within an owner, ignoring case and spaces", async () => {
      await assert.rejects(addSymbol(alice, " moon "), { code: "23505" });
      await assert.rejects(database.query("UPDATE symbols SET name = 'MOON' WHERE id = $1", [await addSymbol(alice, "Sun")]), { code: "23505" });
      assert.notEqual(aliceMoon, bobMoon);
    });
    await t.test("valid links work; duplicates and cross-user links fail", async () => {
      await link(alice, aliceDream, aliceMoon);
      await link(bob, bobDream, bobMoon);
      await assert.rejects(link(alice, aliceDream, aliceMoon), { code: "23505" });
      await assert.rejects(link(alice, aliceDream, bobMoon), { code: "23503" });
      await assert.rejects(link(bob, aliceDream, bobMoon), { code: "23503" });
      await assert.rejects(database.query("UPDATE dream_symbols SET symbol_id = $1 WHERE user_id = $2", [bobMoon, alice]), { code: "23503" });
    });
    await t.test("missing users and invalid content fail", async () => {
      await assert.rejects(addDream(randomUUID()), { code: "23503" });
      await assert.rejects(addSymbol(randomUUID(), "Ghost"), { code: "23503" });
      await assert.rejects(addSymbol(alice, "   "), { code: "23514" });
      await assert.rejects(database.query("UPDATE dreams SET plot = $1 WHERE id = $2", ["x".repeat(3001), aliceDream]), { code: "23514" });
      await assert.rejects(database.query("UPDATE dreams SET mood = 'Invalid' WHERE id = $1", [aliceDream]), { code: "22P02" });
    });
    await t.test("deleting a dream removes links but preserves symbols", async () => {
      await database.query("DELETE FROM dreams WHERE id = $1", [aliceDream]);
      assert.equal((await database.query("SELECT * FROM dream_symbols WHERE dream_id = $1", [aliceDream])).rows.length, 0);
      assert.equal((await database.query("SELECT id FROM symbols WHERE id = $1", [aliceMoon])).rows.length, 1);
    });
    await t.test("deleting a symbol removes links but preserves dreams", async () => {
      await database.query("DELETE FROM symbols WHERE id = $1", [bobMoon]);
      assert.equal((await database.query("SELECT * FROM dream_symbols WHERE symbol_id = $1", [bobMoon])).rows.length, 0);
      assert.equal((await database.query("SELECT id FROM dreams WHERE id = $1", [bobDream])).rows.length, 1);
    });
    await t.test("deleting an auth user cascades only their journal data", async () => {
      const moon = await addSymbol(bob, "Moon");
      await link(bob, bobDream, moon);
      await database.query('DELETE FROM neon_auth."user" WHERE id = $1', [bob]);
      for (const table of ["dreams", "symbols", "dream_symbols"]) {
        assert.equal((await database.query(`SELECT * FROM ${table} WHERE user_id = $1`, [bob])).rows.length, 0);
      }
      assert.equal((await database.query("SELECT id FROM symbols WHERE id = $1", [aliceMoon])).rows.length, 1);
    });
  } finally {
    await database.close();
  }
});
