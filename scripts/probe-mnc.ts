// Explicit read-only network check, never part of npm test.
import { mkdirSync, writeFileSync } from "node:fs";
import sources from "../industry/sources.json" with { type: "json" };
import { guardedFetch } from "@aihot/backend/lib/http-fetch";
import { fetchRss } from "@aihot/backend/sources/rss";
import { fetchWebList } from "@aihot/backend/sources/web-list";
import type { SourceRow } from "@aihot/backend/sources/types";
if (!process.argv.includes("--live")) throw new Error("Pass --live to check the official endpoints (no model calls).");
const results = [];
for (const seed of sources.sources) {
  const source = { ...seed, cursor: null, fail_count: 0 } as SourceRow;
  let status: number | null = null, bytes = 0, blocked = false;
  const url = String(source.config.feedUrl ?? source.config.url);
  try {
    const res = await guardedFetch(url, { minIntervalMs: 2000 });
    status = res.status; bytes = res.body.length;
    blocked = status === 403 || bytes < 2048 || /<title[^>]*>\s*(Just a moment|Site Maintenance)/i.test(res.text());
    if (blocked || status !== 200) throw new Error(`HTTP ${status}${blocked ? " / blocked" : ""}`);
    const items = source.kind === "rss" ? (await fetchRss(source, {force:true})).candidates : await fetchWebList(source);
    const sorted = items.toSorted((a,b)=>(b.publishedAt?.getTime()??0)-(a.publishedAt?.getTime()??0));
    const row = { id: source.id, url, status, bytes, blocked, count: items.length, latest: sorted[0], items };
    results.push(row); console.log(source.id, status, items.length, sorted[0]?.publishedAt?.toISOString(), sorted[0]?.title);
  } catch (e) {
    const row = { id: source.id, url, status, bytes, blocked, count:0, error:String(e) };
    results.push(row); console.log(source.id, row.error);
  }
}
mkdirSync(".data",{recursive:true});
writeFileSync(".data/mnc-live.json", JSON.stringify({checkedAt:new Date().toISOString(),results},null,2));
