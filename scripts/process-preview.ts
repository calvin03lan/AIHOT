// Explicit, bounded live processing of the existing archive. No collection or push schedules.
// MODEL_CALLS_ENABLED=true node --env-file=.env scripts/process-preview.ts --live
import { config } from "@aihot/backend/config";
import { closeDb, sql } from "@aihot/backend/db";
import { getBoss, stopBoss } from "@aihot/backend/jobs/queue";
import { queueProcessing, registerContentJobs, registerExtractionJobs } from "@aihot/backend/jobs/content";
import { registerEventJobs } from "@aihot/backend/jobs/events";

if (!process.argv.includes("--live") || !config.modelCallsEnabled) {
  throw new Error("Requires --live and MODEL_CALLS_ENABLED=true; consumes configured model credits.");
}
const rows = await sql<{ id: string }[]>`
  SELECT a.id FROM articles a JOIN sources s ON s.id = a.source_id
  WHERE a.processing_state = 'new' AND s.participation_mode = 'editorial'
  ORDER BY a.discovered_at DESC LIMIT 100`;
const ids = rows.length ? rows.map(r => r.id) : ["__empty_preview_batch__"];
const boss = await getBoss();
const [events] = await sql`SELECT count(*)::int AS count FROM pgboss.job
  WHERE name IN ('events.group', 'events.digest') AND state IN ('created', 'retry', 'active')`;
if (rows.length || events?.count) {
  for (const row of rows) await queueProcessing(row.id);
  await registerExtractionJobs(boss);
  await registerContentJobs(boss, 2);
  await registerEventJobs(boss);
  const deadline = Date.now() + 30 * 60_000;
  while (Date.now() < deadline) {
    const due = await sql<{ id: string }[]>`SELECT id FROM articles
      WHERE id IN ${sql(ids)} AND processing_state = 'new'
        AND processing_retry_at <= now()`;
    for (const row of due) {
      await sql`UPDATE articles SET processing_retry_at = NULL WHERE id = ${row.id}`;
      await queueProcessing(row.id);
    }
    const [authFailure] = await sql`SELECT 1 FROM articles WHERE id IN ${sql(ids)}
      AND (processing_error LIKE 'HTTP 401:%' OR processing_error LIKE 'HTTP 403:%') LIMIT 1`;
    if (authFailure) {
      console.error("Model authentication refused; stopping batch. Check the configured gateway and key.");
      process.exitCode = 1;
      break;
    }
    const states = await sql`SELECT processing_state, body_status, count(*)::int AS count
      FROM articles WHERE id IN ${sql(ids)} GROUP BY 1, 2`;
    console.log(JSON.stringify({ at: new Date().toISOString(), states }));
    const [pending] = await sql`SELECT count(*)::int AS count FROM articles
      WHERE id IN ${sql(ids)} AND processing_state = 'new'`;
    const [eventJobs] = await sql`SELECT count(*)::int AS count FROM pgboss.job
      WHERE name IN ('events.group', 'events.digest') AND state IN ('created', 'retry', 'active')`;
    if (!pending?.count && !eventJobs?.count) break;
    await new Promise(resolve => setTimeout(resolve, 2_000));
  }
  const [unfinished] = await sql`SELECT count(*)::int AS count FROM articles
    WHERE id IN ${sql(ids)} AND processing_state IN ('new', 'failed')`;
  if (unfinished?.count) {
    console.error(`${unfinished.count} articles unfinished; inspect processing_error before retrying.`);
    process.exitCode = 1;
  }
  const [unfinishedEvents] = await sql`SELECT count(*)::int AS count FROM pgboss.job
    WHERE name IN ('events.group', 'events.digest') AND state IN ('created', 'retry', 'active', 'failed')`;
  if (unfinishedEvents?.count) {
    console.error(`${unfinishedEvents.count} event jobs unfinished; inspect the queue before retrying.`);
    process.exitCode = 1;
  }
}
await stopBoss();
await closeDb();
