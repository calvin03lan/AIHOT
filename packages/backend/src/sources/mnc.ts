// Metadata lives with the stored original material; no separate, lossy shadow feed.
import { createHash } from "node:crypto";
import { normalizeUrl } from "../lib/url.ts";
import type { Candidate, SourceRow } from "./types.ts";

export function normalizeMncCandidate(candidate: Candidate, source: SourceRow, now = new Date()): Candidate {
  const meta = source.config._mnc;
  const url = normalizeUrl(candidate.url) ?? candidate.url;
  const raw = candidate.raw && typeof candidate.raw === "object" ? candidate.raw as Record<string, unknown> : {};
  const record = {
    company: meta.company, ticker: meta.ticker,
    source_type: source.kind === "rss" ? "rss" : source.kind === "json_list" ? "json" : "html",
    category: meta.category,
    title: candidate.title, url,
    published_at: raw.publishedAtOriginal ?? null,
    published_at_utc: candidate.publishedAt?.toISOString() ?? null,
    fetched_at: now.toISOString(), summary: (candidate.excerpt ?? candidate.bodyText ?? "").slice(0, 300),
    dedup_key: createHash("sha1").update(`${meta.ticker}${url}`).digest("hex"),
  };
  return { ...candidate, raw: { ...raw, mnc: record } };
}
