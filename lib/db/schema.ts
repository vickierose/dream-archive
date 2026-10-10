import { relations, sql } from "drizzle-orm";
import {
  check,
  date,
  foreignKey,
  index,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { Mood } from "../../types/dream";
import { authUsers } from "./auth-schema";

export const dreamMood = pgEnum("dream_mood", [
  Mood.peaceful,
  Mood.joyful,
  Mood.strange,
  Mood.sad,
  Mood.unsettling,
  Mood.frightening,
]);

function timestamps() {
  return {
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    // Drizzle updates this automatically; direct SQL writers must set it themselves.
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  };
}

export const dreams = pgTable(
  "dreams",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    plot: text("plot").notNull(),
    // A journal date is a calendar date, not an instant that shifts with timezones.
    date: date("dream_date", { mode: "string" }).notNull(),
    mood: dreamMood("mood").notNull(),
    ...timestamps(),
  },
  (table) => [
    unique("dreams_owner_id_unique").on(table.userId, table.id),
    index("dreams_owner_date_idx").on(
      table.userId,
      table.date.desc(),
      table.id,
    ),
    check("dreams_title_not_blank", sql`length(btrim(${table.title})) > 0`),
    check("dreams_plot_length", sql`length(btrim(${table.plot})) > 0`),
  ],
);

export const symbols = pgTable(
  "symbols",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 80 }).notNull(),
    emoji: varchar("emoji", { length: 32 }).notNull(),
    ...timestamps(),
  },
  (table) => [
    unique("symbols_owner_id_unique").on(table.userId, table.id),
    uniqueIndex("symbols_owner_name_unique").on(
      table.userId,
      sql`lower(btrim(${table.name}))`,
    ),
    check("symbols_name_not_blank", sql`length(btrim(${table.name})) > 0`),
    check("symbols_emoji_not_blank", sql`length(btrim(${table.emoji})) > 0`),
  ],
);

export const dreamSymbols = pgTable(
  "dream_symbols",
  {
    userId: uuid("user_id").notNull(),
    dreamId: uuid("dream_id").notNull(),
    symbolId: uuid("symbol_id").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.dreamId, table.symbolId] }),
    // Including the owner in BOTH references makes cross-user links impossible.
    foreignKey({
      name: "dream_symbols_owned_dream_fk",
      columns: [table.userId, table.dreamId],
      foreignColumns: [dreams.userId, dreams.id],
    }).onDelete("cascade"),
    foreignKey({
      name: "dream_symbols_owned_symbol_fk",
      columns: [table.userId, table.symbolId],
      foreignColumns: [symbols.userId, symbols.id],
    }).onDelete("cascade"),
    index("dream_symbols_owner_symbol_idx").on(
      table.userId,
      table.symbolId,
      table.dreamId,
    ),
  ],
);

// These relations help Drizzle build queries; foreign keys above enforce integrity.
export const dreamsRelations = relations(dreams, ({ many }) => ({
  symbolLinks: many(dreamSymbols),
}));

export const symbolsRelations = relations(symbols, ({ many }) => ({
  dreamLinks: many(dreamSymbols),
}));

export const dreamSymbolsRelations = relations(dreamSymbols, ({ one }) => ({
  dream: one(dreams, {
    fields: [dreamSymbols.userId, dreamSymbols.dreamId],
    references: [dreams.userId, dreams.id],
  }),
  symbol: one(symbols, {
    fields: [dreamSymbols.userId, dreamSymbols.symbolId],
    references: [symbols.userId, symbols.id],
  }),
}));

export type DreamRecord = typeof dreams.$inferSelect;
export type NewDreamRecord = typeof dreams.$inferInsert;
export type SymbolRecord = typeof symbols.$inferSelect;
export type NewSymbolRecord = typeof symbols.$inferInsert;
