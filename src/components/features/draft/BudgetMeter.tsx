export function BudgetMeter({ spent, budget }: { spent: number; budget: number }) {
  const pct = Math.min(100, (spent / budget) * 100);
  const remaining = budget - spent;
  const tight = remaining <= budget * 0.1;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="caption">Credits left</span>
        <span className={`num text-2xl ${tight ? "text-accent-hot" : "text-positive"}`}>
          {remaining}
          <span className="text-sm text-ink-dim"> / {budget}</span>
        </span>
      </div>
      <div
        className="mt-1.5 h-1.5 bg-surface-raised"
        role="meter"
        aria-label="Budget spent"
        aria-valuemin={0}
        aria-valuemax={budget}
        aria-valuenow={spent}
      >
        <div
          className={`h-full transition-[width] duration-200 ease-out ${tight ? "bg-accent" : "bg-positive"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
