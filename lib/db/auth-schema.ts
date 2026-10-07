import { pgSchema, uuid } from "drizzle-orm/pg-core";

// Reference only: Neon manages this table. Keep this file out of Drizzle Kit's
// schema entry point so migrations never try to create or alter auth records.
export const authUsers = pgSchema("neon_auth").table("user", {
  id: uuid("id").primaryKey(),
});
