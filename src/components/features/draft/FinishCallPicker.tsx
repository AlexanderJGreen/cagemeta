"use client";

import { CALLABLE_METHODS } from "@/lib/draft/validate-draft";
import { formatFighterName } from "@/lib/format";
import type { DraftBout } from "./DraftBoard";

export interface FinishCallDraft {
  fightId: string;
  method: (typeof CALLABLE_METHODS)[number];
  round: number;
}

const selectClass =
  "min-h-11 w-full rounded-sm border border-line-strong bg-canvas px-3 text-ink focus:border-ink-dim focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-45";

/** Pick one fight, a method and a round. An exact hit on both earns the league's finish-call bonus. */
export function FinishCallPicker({
  bouts,
  value,
  bonus,
  onChange,
}: {
  bouts: DraftBout[];
  value: FinishCallDraft | undefined;
  bonus: number;
  onChange: (next: FinishCallDraft | undefined) => void;
}) {
  const bout = bouts.find((b) => b.fightId === value?.fightId);
  const rounds = bout?.scheduledRounds ?? 3;
  // A call that already locked can't be edited; the server enforces this too.
  const frozen = Boolean(bout?.locked);

  function setFight(fightId: string) {
    if (!fightId) return onChange(undefined);
    const next = bouts.find((b) => b.fightId === fightId);
    onChange({
      fightId,
      method: value?.method ?? "KO/TKO",
      round: Math.min(value?.round ?? 1, next?.scheduledRounds ?? 3),
    });
  }

  return (
    <fieldset className="rounded-sm border border-line bg-surface p-4">
      <legend className="sr-only">Call the Finish</legend>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="display text-2xl font-bold">Call the Finish</h2>
        <span className="num text-sm text-positive">+{bonus} pts</span>
      </div>
      <p className="mb-4 text-sm text-ink-dim">
        Once per event, name the method and round for one fight. Both must be exact.
      </p>

      <div className="grid gap-3 sm:grid-cols-[2fr_1.4fr_1fr]">
        <div>
          <label htmlFor="call-fight" className="mb-1.5 block text-sm font-medium">Fight</label>
          <select
            id="call-fight"
            className={selectClass}
            value={value?.fightId ?? ""}
            disabled={frozen}
            onChange={(e) => setFight(e.target.value)}
          >
            <option value="">No call</option>
            {bouts.map((b) => (
              <option key={b.fightId} value={b.fightId} disabled={b.locked && b.fightId !== value?.fightId}>
                {formatFighterName(b.fighterA)} vs {formatFighterName(b.fighterB)}
                {b.locked ? " (locked)" : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="call-method" className="mb-1.5 block text-sm font-medium">Method</label>
          <select
            id="call-method"
            className={selectClass}
            value={value?.method ?? "KO/TKO"}
            disabled={!value || frozen}
            onChange={(e) => value && onChange({ ...value, method: e.target.value as FinishCallDraft["method"] })}
          >
            {CALLABLE_METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="call-round" className="mb-1.5 block text-sm font-medium">Round</label>
          <select
            id="call-round"
            className={selectClass}
            value={value?.round ?? 1}
            disabled={!value || frozen}
            onChange={(e) => value && onChange({ ...value, round: Number(e.target.value) })}
          >
            {Array.from({ length: rounds }, (_, i) => i + 1).map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>
    </fieldset>
  );
}
