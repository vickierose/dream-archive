import { loadEnvConfig } from "@next/env";
import { Client } from "pg";
import { getDatabaseUrl } from "../lib/db/env";

loadEnvConfig(process.cwd());

async function checkDatabase() {
  const client = new Client({
    connectionString: getDatabaseUrl(),
    connectionTimeoutMillis: 10_000,
  });
  try {
    await client.connect();
    // Inspect metadata only: do not read accounts, dreams, or credentials.
    const result = await client.query<{ data_type: string }>(`
      SELECT data_type FROM information_schema.columns
      WHERE table_schema = 'neon_auth' AND table_name = 'user' AND column_name = 'id'
    `);
    if (result.rows[0]?.data_type !== "uuid") {
      throw new Error("Auth schema mismatch");
    }
    console.log("Database connection OK; neon_auth.user.id is UUID, as expected.");
  } finally {
    await client.end();
  }
}

checkDatabase().catch(() => {
  console.error("Database check failed. Check DATABASE_URL and that Neon Auth is enabled on that branch. Credentials are not logged.");
  process.exitCode = 1;
});
