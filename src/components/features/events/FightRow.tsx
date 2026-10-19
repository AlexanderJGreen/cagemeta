import Link from "next/link";
import type { Fighter, FighterPrice } from "@/types";
import { formatFighterName, formatRecord } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { FighterAvatar } from "@/components/ui/FighterAvatar";

const cardPositionLabel: Record<string, string> = {
  main: "Main event",
  "co-main": "Co-main event",
  "main-card": "Main card",
  prelim: "Prelim",
  "early-prelim": "Early prelim",
};

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
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center rounded border border-line bg-surface">
      <FighterSide fighter={fighterA} price={priceA} won={winnerId === fighterA.id} align="right" />
      <div className="flex flex-col items-center gap-1.5 px-4 py-3">
        <span className="text-xs text-ink-dim">
          {cardPositionLabel[cardPosition] ?? cardPosition}
        </span>
        <span className="font-display text-sm font-medium tracking-wide text-ink-dim">vs</span>
        <Badge>{weightClass}</Badge>
        <span className="text-xs text-ink-dim">{scheduledRounds} rounds</span>
      </div>
      <FighterSide fighter={fighterB} price={priceB} won={winnerId === fighterB.id} align="left" />
    </div>
  );
}

function FighterSide({
  fighter,
  price,
  won,
  align,
}: {
  fighter: Fighter;
  price?: FighterPrice;
  won: boolean;
  align: "left" | "right";
}) {
  const isRight = align === "right";
  return (
    <Link
      href={`/fighters/${fighter.id}`}
      className={`flex items-center gap-3 px-4 py-3 ${isRight ? "flex-row-reverse text-right" : "text-left"}`}
    >
      <FighterAvatar fighter={fighter} />
      <div className={`flex flex-col gap-1 ${isRight ? "items-end" : "items-start"}`}>
        <span className="font-display text-lg font-medium text-ink">
          {formatFighterName(fighter)}
          {won ? <span className="ml-2 text-sm text-positive">W</span> : null}
        </span>
        {fighter.nickname ? (
          <span className="text-xs text-ink-dim">&ldquo;{fighter.nickname}&rdquo;</span>
        ) : null}
        <span className="font-mono text-xs tabular-nums text-ink-dim">{formatRecord(fighter.record)}</span>
        {price ? (
          <span className="font-mono text-sm tabular-nums text-positive">{price.price}cr</span>
        ) : null}
      </div>
    </Link>
  );
}
