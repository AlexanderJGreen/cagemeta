"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { formatFighterName, formatRecord } from "@/lib/format";
import { BudgetMeter } from "./BudgetMeter";
import { Badge } from "@/components/ui/Badge";
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

  const spent = selected.reduce((sum, id) => sum + (priceByFighterId.get(id) ?? 0), 0);
  const remaining = budget - spent;
  const picksFull = selected.length >= maxPicks;

  function toggle(fighterId: string) {
    setSubmitted(false);
    setSelected((prev) => {
      if (prev.includes(fighterId)) {
        return prev.filter((id) => id !== fighterId);
      }
      const opponentId = fighterToOpponent.get(fighterId);
      if (opponentId && prev.includes(opponentId)) return prev;
      if (prev.length >= maxPicks) return prev;
      const price = priceByFighterId.get(fighterId) ?? 0;
      if (price > remaining) return prev;
      return [...prev, fighterId];
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
      <div className="flex flex-col gap-3">
        {bouts.map((bout) => (
          <div key={bout.fightId} className="rounded border border-line bg-surface p-3">
            <div className="mb-2 flex items-center justify-center gap-2 text-xs text-ink-dim">
              <Badge>{bout.weightClass}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FighterOption
                fighter={bout.fighterA}
                price={bout.priceA.price}
                selected={selected.includes(bout.fighterA.id)}
                disabled={isDisabled(bout.fighterA.id, bout.fighterB.id)}
                onToggle={() => toggle(bout.fighterA.id)}
              />
              <FighterOption
                fighter={bout.fighterB}
                price={bout.priceB.price}
                selected={selected.includes(bout.fighterB.id)}
                disabled={isDisabled(bout.fighterB.id, bout.fighterA.id)}
                onToggle={() => toggle(bout.fighterB.id)}
              />
            </div>
          </div>
        ))}
      </div>

      <aside className="flex h-fit flex-col gap-4 rounded border border-line bg-surface p-5 lg:sticky lg:top-6">
        <BudgetMeter spent={spent} budget={budget} />
        <p className="text-xs text-ink-dim">
          {selected.length} / {maxPicks} fighters picked
        </p>
        <ul className="flex flex-col gap-1">
          {selected.map((id) => {
            const bout = bouts.find((b) => b.fighterA.id === id || b.fighterB.id === id);
            const fighter = bout?.fighterA.id === id ? bout.fighterA : bout?.fighterB;
            if (!fighter) return null;
            return (
              <li key={id} className="flex items-center justify-between text-sm">
                <span className="text-ink">{formatFighterName(fighter)}</span>
                <span className="font-mono tabular-nums text-positive">{priceByFighterId.get(id)}cr</span>
              </li>
            );
          })}
        </ul>
        <Button type="button" disabled={selected.length === 0} onClick={() => setSubmitted(true)}>
          Lock in picks
        </Button>
        {submitted ? (
          <p className="text-xs text-positive">
            Picks locked in locally. Server-side saving arrives in Phase 2.
          </p>
        ) : null}
      </aside>
    </div>
  );

  function isDisabled(fighterId: string, opponentId: string) {
    if (selected.includes(fighterId)) return false;
    if (selected.includes(opponentId)) return true;
    if (picksFull) return true;
    const price = priceByFighterId.get(fighterId) ?? 0;
    return price > remaining;
  }
}

function FighterOption({
  fighter,
  price,
  selected,
  disabled,
  onToggle,
}: {
  fighter: Fighter;
  price: number;
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={selected}
      className={`flex flex-col gap-1 rounded border px-3 py-2 text-left transition-colors ${
        selected ? "border-accent bg-surface-raised" : "border-line bg-canvas"
      } ${disabled ? "cursor-not-allowed opacity-40" : "hover:bg-surface-raised"}`}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="font-display text-sm font-medium text-ink">{formatFighterName(fighter)}</span>
        {selected ? <Check className="h-4 w-4 shrink-0 text-accent" strokeWidth={2.5} /> : null}
      </span>
      <span className="font-mono text-xs tabular-nums text-ink-dim">{formatRecord(fighter.record)}</span>
      <span className="font-mono text-sm tabular-nums text-positive">{price}cr</span>
    </button>
  );
}
