"use client";

import { useMemo, useState } from "react";
import { Check, Lock } from "lucide-react";
import { formatFighterName, formatRecord } from "@/lib/format";
import { BudgetMeter } from "./BudgetMeter";
import { Button } from "@/components/ui/Button";
import type { Fighter, FighterPrice } from "@/types";

export interface DraftBout {
  fightId: string;
  weightClass: string;
  cardPosition: string;
  fighterA: Fighter;
  priceA: FighterPrice;
  fighterB: Fighter;
  priceB: FighterPrice;
}

type OptionState = "open" | "selected" | "opponent-picked" | "roster-full" | "over-budget";

const blockedLabel: Record<Exclude<OptionState, "open" | "selected">, string> = {
  "opponent-picked": "Opponent picked",
  "roster-full": "Roster full",
  "over-budget": "Over budget",
};

export function DraftBoard({
  bouts,
  budget,
  maxPicks,
}: {
  bouts: DraftBout[];
  budget: number;
  maxPicks: number;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const priceByFighterId = useMemo(() => {
    const map = new Map<string, number>();
    for (const bout of bouts) {
      map.set(bout.fighterA.id, bout.priceA.price);
      map.set(bout.fighterB.id, bout.priceB.price);
    }
    return map;
  }, [bouts]);

  const fighterToOpponent = useMemo(() => {
    const map = new Map<string, string>();
    for (const bout of bouts) {
      map.set(bout.fighterA.id, bout.fighterB.id);
      map.set(bout.fighterB.id, bout.fighterA.id);
    }
    return map;
  }, [bouts]);

  const fighterById = useMemo(() => {
    const map = new Map<string, Fighter>();
    for (const bout of bouts) {
      map.set(bout.fighterA.id, bout.fighterA);
      map.set(bout.fighterB.id, bout.fighterB);
    }
    return map;
  }, [bouts]);

  const spent = selected.reduce((sum, id) => sum + (priceByFighterId.get(id) ?? 0), 0);
  const remaining = budget - spent;
  const picksFull = selected.length >= maxPicks;

  function stateOf(fighterId: string, opponentId: string): OptionState {
    if (selected.includes(fighterId)) return "selected";
    if (selected.includes(opponentId)) return "opponent-picked";
    if (picksFull) return "roster-full";
    if ((priceByFighterId.get(fighterId) ?? 0) > remaining) return "over-budget";
    return "open";
  }

  function toggle(fighterId: string) {
    setSubmitted(false);
    setSelected((prev) => {
      if (prev.includes(fighterId)) return prev.filter((id) => id !== fighterId);
      const opponentId = fighterToOpponent.get(fighterId);
      if (opponentId && prev.includes(opponentId)) return prev;
      if (prev.length >= maxPicks) return prev;
      if ((priceByFighterId.get(fighterId) ?? 0) > budget - prev.reduce((s, id) => s + (priceByFighterId.get(id) ?? 0), 0)) {
        return prev;
      }
      return [...prev, fighterId];
    });
  }

  const lockButton = (
    <Button type="button" disabled={selected.length === 0} onClick={() => setSubmitted(true)}>
      <Lock className="h-4 w-4" aria-hidden />
      Lock in picks
    </Button>
  );

  return (
    <div className="grid gap-8 pb-28 lg:grid-cols-[1fr_20rem] lg:pb-0">
      <div className="flex flex-col gap-3">
        {bouts.map((bout) => (
          <fieldset key={bout.fightId} className="rounded-sm border border-line bg-surface">
            <legend className="sr-only">
              {formatFighterName(bout.fighterA)} versus {formatFighterName(bout.fighterB)}
            </legend>
            <div className="flex items-center justify-between border-b border-line px-3 py-1.5">
              <span className="caption">{bout.weightClass}</span>
              <span className="caption capitalize">{bout.cardPosition.replace("-", " ")}</span>
            </div>
            <div className="grid grid-cols-2 divide-x divide-line">
              <FighterOption
                fighter={bout.fighterA}
                price={bout.priceA.price}
                state={stateOf(bout.fighterA.id, bout.fighterB.id)}
                align="left"
                onToggle={() => toggle(bout.fighterA.id)}
              />
              <FighterOption
                fighter={bout.fighterB}
                price={bout.priceB.price}
                state={stateOf(bout.fighterB.id, bout.fighterA.id)}
                align="right"
                onToggle={() => toggle(bout.fighterB.id)}
              />
            </div>
          </fieldset>
        ))}
      </div>

      {/* Desktop: sticky roster panel. */}
      <aside
        aria-label="Your roster"
        className="hidden h-fit flex-col gap-4 rounded-sm border border-line bg-surface p-5 lg:sticky lg:top-20 lg:flex"
      >
        <BudgetMeter spent={spent} budget={budget} />
        <p className="caption">
          Roster <span className="num text-ink">{selected.length}</span> / {maxPicks}
        </p>
        <RosterList selected={selected} fighterById={fighterById} priceByFighterId={priceByFighterId} />
        {lockButton}
        <LockedNote submitted={submitted} />
      </aside>

      {/* Mobile: summary bar pinned above the tab bar. */}
      <div
        className="fixed inset-x-0 z-30 border-t border-line-strong bg-surface px-4 py-3 lg:hidden"
        style={{ bottom: "calc(var(--tabbar-h) + env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="mx-auto flex max-w-3xl items-center gap-4">
          <div className="min-w-0 flex-1">
            <BudgetMeter spent={spent} budget={budget} />
          </div>
          <div className="text-right">
            <p className="num text-lg leading-none">
              {selected.length}
              <span className="text-ink-dim">/{maxPicks}</span>
            </p>
            <p className="caption">Picks</p>
          </div>
          {lockButton}
        </div>
        {submitted ? <LockedNote submitted /> : null}
      </div>
    </div>
  );
}

function RosterList({
  selected,
  fighterById,
  priceByFighterId,
}: {
  selected: string[];
  fighterById: Map<string, Fighter>;
  priceByFighterId: Map<string, number>;
}) {
  if (selected.length === 0) {
    return <p className="text-sm text-ink-dim">Pick one fighter per bout to build your card.</p>;
  }
  return (
    <ul className="divide-y divide-line border-y border-line">
      {selected.map((id) => {
        const fighter = fighterById.get(id);
        if (!fighter) return null;
        return (
          <li key={id} className="flex items-center justify-between py-2 text-sm">
            <span className="text-ink">{formatFighterName(fighter)}</span>
            <span className="num text-positive">{priceByFighterId.get(id)} cr</span>
          </li>
        );
      })}
    </ul>
  );
}

function LockedNote({ submitted }: { submitted: boolean }) {
  return (
    <p role="status" className={`text-xs text-positive ${submitted ? "mt-2" : "sr-only"}`}>
      {submitted ? "Picks locked in locally. Server-side saving arrives in Phase 2." : ""}
    </p>
  );
}

function FighterOption({
  fighter,
  price,
  state,
  align,
  onToggle,
}: {
  fighter: Fighter;
  price: number;
  state: OptionState;
  align: "left" | "right";
  onToggle: () => void;
}) {
  const selected = state === "selected";
  const blocked = state !== "open" && state !== "selected";
  const right = align === "right";

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={blocked}
      aria-pressed={selected}
      className={`relative flex min-h-32 flex-col gap-0.5 p-3 transition-colors duration-150 ${
        right ? "items-end text-right" : "items-start text-left"
      } ${selected ? "bg-accent-wash" : blocked ? "cursor-not-allowed opacity-45" : "hover:bg-surface-raised"}`}
    >
      {selected ? (
        <span
          aria-hidden
          className={`absolute top-0 h-0.5 w-full bg-accent ${right ? "right-0" : "left-0"}`}
        />
      ) : null}
      <span className="caption normal-case tracking-normal">{fighter.firstName}</span>
      <span className="display -mt-0.5 flex max-w-full items-center gap-1.5 text-3xl font-extrabold">
        {selected && !right ? <Check className="h-5 w-5 shrink-0 text-accent-hot" strokeWidth={3} aria-hidden /> : null}
        <span className="truncate">{fighter.lastName}</span>
        {selected && right ? <Check className="h-5 w-5 shrink-0 text-accent-hot" strokeWidth={3} aria-hidden /> : null}
      </span>
      <span className="num text-sm text-ink-dim">{formatRecord(fighter.record)}</span>
      <span className="num mt-auto pt-2 text-lg font-medium text-positive">
        {price}
        <span className="text-sm text-ink-dim"> cr</span>
      </span>
      {blocked ? <span className="text-[0.6875rem] text-ink-dim">{blockedLabel[state]}</span> : null}
    </button>
  );
}
