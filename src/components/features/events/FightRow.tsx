import Link from "next/link";
import type { Fighter, FighterPrice } from "@/types";
import { formatRecord } from "@/lib/format";
import { FighterAvatar } from "@/components/ui/FighterAvatar";

const cardPositionLabel: Record<string, string> = {
  main: "Main event",
  "co-main": "Co-main",
  "main-card": "Main card",
  prelim: "Prelim",
  "early-prelim": "Early prelim",
};

/** Broadcast matchup: fighter A left, fighter B right, key stats facing off between them. */
export function FightRow({
  fighterA,
  fighterB,
  weightClass,
  cardPosition,
  scheduledRounds,
  priceA,
  priceB,
  winnerId,
}: {
  fighterA: Fighter;
  fighterB: Fighter;
  weightClass: string;
  cardPosition: string;
  scheduledRounds: number;
  priceA?: FighterPrice;
  priceB?: FighterPrice;
  winnerId?: string;
}) {
  const isMain = cardPosition === "main";
  const decided = winnerId !== undefined;

  return (
    <article className="overflow-hidden rounded-sm border border-line bg-surface">
      <header className="flex items-center justify-between gap-3 border-b border-line bg-surface-raised/60 pr-3">
        <span
          className={`cut-tag inline-block py-1 pl-3 pr-5 font-display text-sm font-bold uppercase leading-tight tracking-wider ${
            isMain ? "bg-accent text-accent-ink" : "bg-line-strong text-ink"
          }`}
        >
          {cardPositionLabel[cardPosition] ?? cardPosition}
        </span>
        <span className="caption truncate">
          {weightClass} · <span className="num">{scheduledRounds}</span> rds
        </span>
      </header>

      <div className="grid grid-cols-[1fr_auto_1fr] items-stretch">
        <Side
          fighter={fighterA}
          price={priceA}
          align="left"
          state={!decided ? "open" : winnerId === fighterA.id ? "won" : "lost"}
        />
        <div className="flex items-center justify-center px-1 sm:px-3" aria-hidden>
          <span className="display text-xl font-extrabold text-ink-faint">vs</span>
        </div>
        <Side
          fighter={fighterB}
          price={priceB}
          align="right"
          state={!decided ? "open" : winnerId === fighterB.id ? "won" : "lost"}
        />
      </div>

      <dl className="grid grid-cols-[1fr_auto_1fr] gap-x-3 border-t border-line px-3 py-2 sm:px-4">
        <TapeLine
          label="Reach"
          a={`${fighterA.reachCm} cm`}
          b={`${fighterB.reachCm} cm`}
          aLeads={fighterA.reachCm > fighterB.reachCm}
          bLeads={fighterB.reachCm > fighterA.reachCm}
        />
        <TapeLine
          label="Strikes / min"
          a={fighterA.stats.sigStrikesLandedPerMin.toFixed(1)}
          b={fighterB.stats.sigStrikesLandedPerMin.toFixed(1)}
          aLeads={fighterA.stats.sigStrikesLandedPerMin > fighterB.stats.sigStrikesLandedPerMin}
          bLeads={fighterB.stats.sigStrikesLandedPerMin > fighterA.stats.sigStrikesLandedPerMin}
        />
      </dl>
    </article>
  );
}

function TapeLine({
  label,
  a,
  b,
  aLeads,
  bLeads,
}: {
  label: string;
  a: string;
  b: string;
  aLeads: boolean;
  bLeads: boolean;
}) {
  return (
    <>
      <dd className={`num py-0.5 text-left text-sm ${aLeads ? "text-positive" : "text-ink-dim"}`}>{a}</dd>
      <dt className="caption py-0.5 text-center">{label}</dt>
      <dd className={`num py-0.5 text-right text-sm ${bLeads ? "text-positive" : "text-ink-dim"}`}>{b}</dd>
    </>
  );
}

function Side({
  fighter,
  price,
  align,
  state,
}: {
  fighter: Fighter;
  price?: FighterPrice;
  align: "left" | "right";
  state: "open" | "won" | "lost";
}) {
  const right = align === "right";
  return (
    <Link
      href={`/fighters/${fighter.id}`}
      className={`group flex min-w-0 flex-col gap-1 p-3 transition-colors hover:bg-surface-raised sm:p-4 ${
        right ? "items-end text-right" : "items-start text-left"
      } ${state === "lost" ? "opacity-55" : ""}`}
    >
      <div className={`flex items-center gap-2 ${right ? "flex-row-reverse" : ""}`}>
        <FighterAvatar fighter={fighter} size="sm" tone={state === "won" ? "accent" : "neutral"} />
        {state === "won" ? (
          <span className="rounded-sm bg-positive px-1.5 py-0.5 font-display text-sm font-extrabold leading-none text-positive-ink">
            WIN
          </span>
        ) : null}
      </div>
      <span className="caption mt-1 max-w-full truncate normal-case tracking-normal">{fighter.firstName}</span>
      <span className="display -mt-1 max-w-full truncate text-3xl font-extrabold group-hover:text-accent-hot sm:text-4xl">
        {fighter.lastName}
      </span>
      {fighter.nickname ? (
        <span className="max-w-full truncate text-xs italic text-ink-faint">&ldquo;{fighter.nickname}&rdquo;</span>
      ) : null}
      <span className="num mt-1 text-sm text-ink">{formatRecord(fighter.record)}</span>
      {price ? (
        <span className="num text-sm font-medium text-positive">
          {price.price}
          <span className="text-ink-dim"> cr</span>
        </span>
      ) : null}
    </Link>
  );
}
