import assert from "node:assert/strict";
import test from "node:test";
import { buildConstellation, connectionWidth, nodeRadius, matchingDreams } from "./constellation";

test("shared dreams must contain every selected symbol, including three or more", () => {
  const dreams = [
    { id: "triple", title: "Three", date: "2026-10-20", symbols: ["a", "b", "c"] },
    { id: "pair", title: "Two", date: "2026-10-19", symbols: ["a", "b"] },
    { id: "other", title: "Other", date: "2026-10-18", symbols: ["b", "c"] },
  ];
  assert.deepEqual(matchingDreams(dreams, ["a", "b"]).map((dream) => dream.id), ["triple", "pair"]);
  assert.deepEqual(matchingDreams(dreams, ["a", "b", "c"]).map((dream) => dream.id), ["triple"]);
  assert.deepEqual(matchingDreams(dreams, ["a", "b", "missing"]), []);
  assert.deepEqual(matchingDreams(dreams, []), []);
  assert.deepEqual(matchingDreams(dreams, ["a"]), []);
});

const symbols = [
  { id: "a", name: "Moon", emoji: "🌙" },
  { id: "b", name: "Sea", emoji: "🌊" },
  { id: "c", name: "Tree", emoji: "🌳" },
  { id: "unused", name: "Star", emoji: "⭐" },
];

test("counts distinct dreams per symbol and unordered pair, keeping isolated used symbols", () => {
  const result = buildConstellation([
    { symbols: ["a", "b", "a"] },
    { symbols: ["b", "a", "missing"] },
    { symbols: ["c"] },
    { symbols: [] },
  ], symbols);
  assert.deepEqual(result.nodes.map(({ id, dreamCount }) => [id, dreamCount]), [["a", 2], ["b", 2], ["c", 1]]);
  assert.deepEqual(result.links, [{ source: "a", target: "b", dreamCount: 2 }]);
  assert.deepEqual(buildConstellation([], symbols), { nodes: [], links: [] });
});

test("a dream with three symbols contributes once to each pair", () => {
  const result = buildConstellation([{ symbols: ["c", "a", "b"] }], symbols);
  assert.deepEqual(result.links, [
    { source: "a", target: "b", dreamCount: 1 },
    { source: "a", target: "c", dreamCount: 1 },
    { source: "b", target: "c", dreamCount: 1 },
  ]);
});

test("visual scales grow with counts and stay bounded", () => {
  assert.deepEqual([1, 2, 3, 4, 7, 8, 10000].map(connectionWidth), [1, 2, 2, 3, 3, 4, 4]);
  assert.ok(nodeRadius(4) > nodeRadius(1));
  assert.equal(nodeRadius(10000), 34);
});
