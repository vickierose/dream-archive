import assert from "node:assert/strict";
import test from "node:test";
import { createTranslator } from "next-intl";
import en from "@/messages/en.json";
import uk from "@/messages/uk.json";
import { isAppLocale } from "./config";
import { formatDreamDate } from "@/lib/date";
import { createLoginSchema, createSignupSchema } from "@/lib/validation/auth";
import { createDreamSchema } from "@/lib/validation/dream";

function flatten(value: Record<string, unknown>, prefix = ""): Record<string, string> {
  return Object.fromEntries(Object.entries(value).flatMap(([key, message]) => {
    const name = prefix ? `${prefix}.${key}` : key;
    return typeof message === "string"
      ? [[name, message]]
      : Object.entries(flatten(message as Record<string, unknown>, name));
  }));
}

test("both catalogs have the same keys and every message formats", () => {
  assert.deepEqual(Object.keys(flatten(en)).sort(), Object.keys(flatten(uk)).sort());
  for (const [locale, messages] of [["en", en], ["uk", uk]] as const) {
    const t = createTranslator({ locale, messages, onError: (error) => { throw error; } });
    for (const key of Object.keys(flatten(messages))) {
      assert.ok(t(key as Parameters<typeof t>[0], {
        count: 2, dreams: 5, symbols: 21, title: "Test", names: "Test", name: "Test",
      }));
    }
  }
});

test("counts follow English and Ukrainian plural rules", () => {
  const english = createTranslator({ locale: "en", messages: en });
  const ukrainian = createTranslator({ locale: "uk", messages: uk });
  assert.equal(english("Dreams.count", { count: 1 }), "1 dream");
  assert.equal(english("Dreams.count", { count: 2 }), "2 dreams");
  for (const [count, expected] of [[0, "0 снів"], [1, "1 сон"], [2, "2 сни"], [5, "5 снів"], [11, "11 снів"], [21, "21 сон"], [22, "22 сни"]] as const) {
    assert.equal(ukrainian("Dreams.count", { count }), expected);
  }
});

test("dates use the requested locale without shifting the calendar day", () => {
  assert.equal(formatDreamDate("2026-10-11", "en"), "October 11, 2026");
  assert.match(formatDreamDate("2026-10-11", "uk"), /11 жовтня 2026/);
});

test("validation returns localized errors without changing stored mood values", () => {
  for (const [locale, messages] of [["en", en], ["uk", uk]] as const) {
    const t = createTranslator({ locale, messages, namespace: "Validation" });
    const login = createLoginSchema(t).safeParse({ email: "invalid", password: "" });
    assert.equal(login.success, false);
    if (!login.success) assert.equal(login.error.issues[0].message, messages.Validation.email);
    const signup = createSignupSchema(t).safeParse({ email: "a@example.com", password: "short" });
    assert.equal(signup.success, false);
    if (!signup.success) assert.equal(signup.error.issues[0].message, messages.Validation.passwordLength);
    const dream = createDreamSchema(t);
    assert.equal(dream.safeParse({ title: "Test", date: "2026-10-11", plot: "Test", mood: "Peaceful", symbols: [] }).success, true);
    const invalid = dream.safeParse({ title: "", date: "invalid", plot: "", mood: "Спокійний", symbols: [] });
    assert.equal(invalid.success, false);
    if (!invalid.success) assert.equal(invalid.error.issues[0].message, messages.Validation.title);
  }
});

test("only supported locale identifiers are accepted", () => {
  assert.equal(isAppLocale("en"), true);
  assert.equal(isAppLocale("uk"), true);
  for (const locale of ["ua", "fr", "../../etc", "", undefined]) assert.equal(isAppLocale(locale), false);
});
