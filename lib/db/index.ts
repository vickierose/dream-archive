import "server-only";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { getDatabaseUrl } from "./env";
import * as schema from "./schema";

const globalForDb = globalThis as typeof globalThis & { dreamArchivePool?: Pool };

function createPool() {
  const pool = new Pool({
    connectionString: getDatabaseUrl(),
    max: 5,
    connectionTimeoutMillis: 10_000,
    idleTimeoutMillis: 30_000,
  });
  // An idle connection can drop when Neon suspends compute. pg replaces it on demand.
  pool.on("error", () => {
    console.error("An idle database connection closed unexpectedly.");
  });
  return pool;
}

// Reuse the pool during development hot reloads. Connections open on first query.
const pool = globalForDb.dreamArchivePool ?? createPool();

if (process.env.NODE_ENV !== "production") globalForDb.dreamArchivePool = pool;

export const db = drizzle(pool, { schema });
