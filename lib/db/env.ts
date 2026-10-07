// Shared by server code and command-line tooling; never import into client code.
export function getDatabaseUrl() {
  const value = process.env.DATABASE_URL;
  if (!value) throw new Error("Missing DATABASE_URL. Set it in .env.local or hosting settings.");

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("DATABASE_URL must be a valid PostgreSQL connection URL.");
  }
  if (!["postgres:", "postgresql:"].includes(url.protocol)) {
    throw new Error("DATABASE_URL must use postgres:// or postgresql://.");
  }
  return value;
}
