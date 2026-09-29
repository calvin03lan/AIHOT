// One report in a feed. Desktop (≥ 961px): a white card beside the time rail. Mobile: a compact row
// with a divider, the reason in a grey box. One markup, two presentations, as on the original site.
import { memo, useEffect, useId, useState, type MouseEvent } from "react";
import { Link } from "react-router";
import { IntentLink } from "../../components/ui/IntentLink";
import type { GroupInfo, FeedItemSummary, SiteItemDetail, TimelineFilters } from "@aihot/contracts/site";
import { CATEGORY_LABELS } from "@aihot/contracts/taxonomy";
import { SelectedBadge } from "../../components/ui/Badge";
import { ScoreLabel } from "../../components/ui/Score";
import { MediaThumbs, SourceLine, StarButton } from "./parts";
import { GroupDevelopments, GroupSources, LatestDevelopment } from "./ReadingGroup";
import { QuotedLine } from "../item/QuotedPost";
import { Collapse } from "../../components/ui/Presence";
import { IconChevronDown, IconExternal } from "../../components/icons";

export interface FeedItemProps {
  item: FeedItemSummary;
  group?: GroupInfo | null;
  filters?: TimelineFilters;
  read?: boolean;
  onOpen?: (id: string) => void;
  /** Show category and tags under the text (全部动态, topics, search). */
  showTags?: boolean;
  showScore?: boolean;
}

export const FeedItem = memo(function FeedItem({ item, group, filters, read = false, onOpen, showTags = false, showScore = false }: FeedItemProps) {
  const isX = item.channel === "x" && !!item.x;
  const [expanded, setExpanded] = useState(false);
  const [detail, setDetail] = useState<SiteItemDetail | null>(null);
  const [loadError, setLoadError] = useState(false);
  const detailId = useId();
  const showSources = !!group && (group.additionalSourceCount > 0 || (group.developmentCount <= 1 && group.reportCount > 1));
  const showDevelopments = !!group?.story && group.developmentCount > 1;
  const tags = showTags ? item.tags.slice(0, 3) : [];

  useEffect(() => {
    if (!expanded || detail) return;
    const controller = new AbortController();
    setLoadError(false);
    fetch(`/api/site/items/${encodeURIComponent(item.id)}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json() as Promise<SiteItemDetail>;
      })
      .then(setDetail)
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) setLoadError(true);
      });
    return () => controller.abort();
  }, [detail, expanded, item.id]);

  const toggle = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onOpen?.(item.id);
    setExpanded((value) => !value);
  };
  const bodyHtml = detail?.body ? (detail.body.zh ?? detail.body.original) : null;

  return (
    <article className="relative min-w-0 lg:card lg:card-hover lg:px-[18px] lg:pb-[14px] lg:pt-[15px]" data-item-id={item.id}>
      <header className="flex min-h-[18px] items-center gap-2 text-[12.5px] leading-[18px] text-ink-4">
        <SourceLine item={item} className="text-ink-4" />
        {item.selected && (
          <span className="hidden lg:inline-flex">
            <SelectedBadge />
          </span>
        )}
        <span className="ml-auto flex shrink-0 items-center gap-1.5 pl-2">
          {showScore && (
            <>
              <span className="hidden lg:inline-flex"><ScoreLabel score={item.score} /></span>
              <span className="lg:hidden"><ScoreLabel score={item.score} compact /></span>
            </>
          )}
          <span className="-my-1 hidden lg:inline-flex">
            <StarButton item={item} />
          </span>
        </span>
      </header>

      {isX ? (
        <p className={`mt-2 whitespace-pre-line text-[15px] leading-[1.75] line-clamp-5 lg:line-clamp-4 ${read ? "text-ink-4" : "text-ink"}`}>
          <IntentLink to={`/items/${item.id}`} onClick={toggle} aria-expanded={expanded} aria-controls={detailId} className="inline">
            {item.summary ?? item.title}
          </IntentLink>
        </p>
      ) : (
        <>
          <h3 className={`mt-2 line-clamp-2 text-[17px] font-bold leading-[1.55] lg:line-clamp-none lg:font-[650] ${read ? "text-ink-4" : "text-ink"}`}>
            <IntentLink to={`/items/${item.id}`} onClick={toggle} aria-expanded={expanded} aria-controls={detailId} className="inline hover:text-accent">
              {item.title}
            </IntentLink>
            <IconChevronDown size={15} aria-hidden="true" className={`ml-1 inline-block align-[-2px] text-ink-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </h3>
          {item.summary && <p className="mt-1.5 line-clamp-2 text-[14.5px] leading-[1.75] text-ink-3 lg:mt-2 lg:line-clamp-3 lg:text-[15px]">{item.summary}</p>}
        </>
      )}

      {isX && item.x!.media.length > 0 && <MediaThumbs media={item.x!.media} className="mt-2.5" />}
      {isX && item.x!.quoted?.text && <QuotedLine quoted={item.x!.quoted} />}

      {(tags.length > 0 || (showTags && item.category)) && (
        <div className="relative z-10 mt-2 hidden flex-wrap gap-x-2.5 gap-y-1 text-[12px] text-ink-4 lg:flex">
          {showTags && item.category && (
            <Link to={`/all?category=${item.category}`} className="hover:text-accent">
              {CATEGORY_LABELS[item.category]}
            </Link>
          )}
          {tags.map((t) => (
            <Link key={t} to={`/all?tag=${encodeURIComponent(t)}`} className="hover:text-accent">
              #{t}
            </Link>
          ))}
        </div>
      )}

      {group && <LatestDevelopment group={group} />}
      {(showSources || showDevelopments) && (
        <div className="mt-2 flex flex-wrap items-start gap-x-4 gap-y-1">
          {showSources && <GroupSources group={group!} filters={filters} parentId={item.id} />}
          {showDevelopments && <GroupDevelopments group={{ ...group!, story: group!.story! }} filters={filters} parentId={item.id} />}
        </div>
      )}

      {item.reason && (
        <div className="mt-2.5 rounded-control bg-bg-sunk px-3 py-2 dark:bg-bg-muted/60 lg:mt-3 lg:rounded-none lg:border-t lg:border-line-soft lg:bg-transparent lg:px-0 lg:pb-0 lg:pt-3 lg:dark:bg-transparent">
          <p className="line-clamp-2 text-[13px] leading-[1.65] text-ink-3 lg:line-clamp-none lg:leading-[1.75] lg:text-note">推荐理由：{item.reason}</p>
        </div>
      )}

      <Collapse open={expanded}>
        <section id={detailId} aria-label="展开内容" className="relative z-10 mt-3 border-t border-line pt-3">
          {!detail && !loadError && <p className="py-2 text-[13px] text-ink-4">正在加载…</p>}
          {loadError && (
            <p className="py-2 text-[13px] text-hot">内容加载失败，可打开详情页查看。</p>
          )}
          {detail && (
            <>
              {detail.readingMode === "summary-only" && (
                <p className="rounded-control bg-bg-sunk px-3 py-2 text-[13px] leading-relaxed text-ink-3">应来源方要求，这里只提供摘要与原文入口。</p>
              )}
              {bodyHtml && <div className="prose max-h-[70vh] overflow-y-auto pr-1" dangerouslySetInnerHTML={{ __html: bodyHtml }} />}
              {!bodyHtml && detail.summary && <p className="text-[14.5px] leading-[1.8] text-ink-2">{detail.summary}</p>}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-[12.5px]">
                <Link to={`/items/${item.id}`} className="font-medium text-accent hover:text-accent-ink">打开完整详情</Link>
                <a href={detail.links.original} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-ink-3 hover:text-ink">
                  查看原文 <IconExternal size={13} />
                </a>
              </div>
            </>
          )}
        </section>
      </Collapse>
    </article>
  );
});
