import assert from "node:assert/strict";
import test from "node:test";
import { filterDreams, listHref, matchesName, paginate, queryText, queryValues } from "./archive-list.ts";

test("dream filters combine title, any selected mood, and every selected symbol", () => {
  const dreams = [
    { id: "1", title: "Moon lake", mood: "Peaceful", symbols: ["moon", "water"] },
    { id: "2", title: "Moon forest", mood: "Sad", symbols: ["moon"] },
    { id: "3", title: "Moon sea", mood: "Sad", symbols: ["moon", "water"] },
    { id: "4", title: "Sun sea", mood: "Peaceful", symbols: ["moon", "water"] },
  ];
  assert.deepEqual(filterDreams(dreams, "moon", ["Peaceful", "Sad"], ["moon", "water"]).map(dream => dream.id), ["1", "3"]);
  assert.deepEqual(filterDreams(dreams, "", [], []), dreams);
  assert.deepEqual(filterDreams(dreams, "", ["Joyful"], []), []);
});

test("page boundaries use the filtered count and handle invalid page parameters", () => {
  const dreams = Array.from({ length: 41 }, (_, index) => index);
  assert.deepEqual(paginate(dreams, "2", 20).items, dreams.slice(20, 40));
  assert.deepEqual(paginate(dreams, "99", 20), { items: [40], page: 3, pages: 3 });
  for (const value of ["0", "-2", "NaN", "1.5", "999999999999999999999"]) {
    assert.equal(paginate(dreams, value, 20).page, 1);
  }
  assert.equal(paginate(dreams.slice(0, 40), "1", 40).pages, 1);
  assert.equal(paginate(dreams, "2", 40).items.length, 1);
  assert.deepEqual(paginate([], "5", 20), { items: [], page: 1, pages: 1 });
});

test("pagination preserves repeated filters and safely encodes searches", () => {
  const href = listHref("/dreams", { q: "moon & stars", mood: ["Peaceful", "Sad"], symbol: ["a", "b"], page: "2" }, 3);
  const params = new URL(href, "https://example.com").searchParams;
  assert.equal(params.get("q"), "moon & stars");
  assert.deepEqual(params.getAll("mood"), ["Peaceful", "Sad"]);
  assert.deepEqual(params.getAll("symbol"), ["a", "b"]);
  assert.deepEqual(params.getAll("page"), ["3"]);
});

test("name search ignores case, trims query whitespace, and supports Ukrainian", () => {
  assert.equal(matchesName("Moonlight", queryText({ q: " MOON " })), true);
  assert.equal(matchesName("Місяць", "міся"), true);
  assert.equal(matchesName("Moonlight", "sun"), false);
  assert.deepEqual(queryValues(undefined), []);
});
