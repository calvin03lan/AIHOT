/**
 * The AI score as a small pill, tinted by tier instead of drawn as a bar: strong picks (85+) in a wash of
 * the accent, solid ones (70+) on the quiet grey, the rest as plain text.
 */
const TIERS = [
  { min: 85, className: "bg-accent-soft text-accent ring-accent/20" },
  { min: 70, className: "bg-bg-sunk text-ink-2 ring-line dark:bg-bg-muted/60" },
  { min: 0, className: "text-ink-4 ring-line-soft" },
];

/** "热点分 · 88" on desktop cards; `compact` keeps only the number (phones). */
export function ScoreLabel({ score, compact = false }: { score: number | null; compact?: boolean }) {
  if (score === null) return null;
  const value = Math.round(score);
  const tier = TIERS.find((t) => value >= t.min)!;
  return (
    <span
      title={`热点分 ${value}/100`}
      aria-label={`热点分 ${value} 分`}
      className={`inline-flex h-[20px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2 ring-1 ring-inset ${tier.className}`}
    >
      {!compact && (
        <>
          <span className="text-[11px] font-medium leading-none opacity-80">热点分</span>
          <span className="h-2.5 w-px bg-current opacity-25" aria-hidden="true" />
        </>
      )}
      <span className="mono text-[12.5px] font-bold leading-none tabular-nums">{value}</span>
    </span>
  );
}

export function ScoreVisibilityToggle({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="inline-flex cursor-pointer select-none items-center gap-2 text-[12.5px] text-ink-3">
      <span>显示热点分</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="peer sr-only" />
      <span
        aria-hidden="true"
        className="relative h-5 w-9 rounded-full bg-bg-muted ring-1 ring-inset ring-line-strong transition-colors after:absolute after:left-0.5 after:top-0.5 after:size-4 after:rounded-full after:bg-surface after:shadow-sm after:transition-transform peer-checked:bg-accent peer-checked:ring-accent peer-checked:after:translate-x-4 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent"
      />
    </label>
  );
}
