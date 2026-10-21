import type { LeaderboardRow } from "@/types";

/** Ranked rows with a proportional points bar. The leader's rank and bar take the accent. */
export function StandingsList({
  rows,
  currentUserId,
  limit,
}: {
  rows: LeaderboardRow[];
  currentUserId?: string;
  limit?: number;
}) {
  const shown = limit ? rows.slice(0, limit) : rows;
  const top = Math.max(...rows.map((r) => r.totalPoints), 1);

  return (
    <ol className="divide-y divide-line rounded-sm border border-line bg-surface">
      {shown.map((row) => {
        const leader = row.rank === 1;
        const you = row.userId === currentUserId;
        return (
          <li key={row.userId} className="flex items-center gap-4 px-4 py-3">
            <span
              className={`display w-8 text-center text-3xl font-extrabold ${
                leader ? "text-accent-hot" : "text-ink-faint"
              }`}
            >
              {row.rank}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate font-medium text-ink">{row.displayName}</span>
                {you ? (
                  <span className="rounded-sm border border-line-strong px-1 text-[0.625rem] font-semibold uppercase leading-4 tracking-wider text-ink-dim">
                    You
                  </span>
                ) : null}
              </div>
              <div className="mt-1.5 h-1 bg-surface-raised" aria-hidden>
                <div
                  className={`h-full ${leader ? "bg-accent" : "bg-line-strong"}`}
                  style={{ width: `${(row.totalPoints / top) * 100}%` }}
                />
              </div>
            </div>
            <span className={`num text-2xl ${leader ? "text-positive" : "text-ink"}`}>
              {row.totalPoints}
              <span className="ml-1 text-xs text-ink-dim">pts</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
