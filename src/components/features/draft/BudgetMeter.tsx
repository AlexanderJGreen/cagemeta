export function BudgetMeter({ spent, budget }: { spent: number; budget: number }) {
  const pct = Math.min(100, (spent / budget) * 100);
  const overBudget = spent > budget;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-ink-dim">Budget</span>
        <span
          className={`font-mono text-lg font-medium tabular-nums ${overBudget ? "text-accent" : "text-positive"}`}
        >
          {spent} / {budget}cr
        </span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-raised">
        <div
          className={`h-full rounded-full ${overBudget ? "bg-accent" : "bg-positive"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
