// node --env-file=.env scripts/export-mnc.ts > export.jsonl (all stored MNC original records)
import { sql, closeDb } from "@aihot/backend/db";
try {
  const rows = await sql`SELECT raw->'mnc' AS record FROM articles WHERE raw ? 'mnc' ORDER BY discovered_at, id`;
  for (const row of rows) console.log(JSON.stringify(row.record));
} finally { await closeDb(); }
