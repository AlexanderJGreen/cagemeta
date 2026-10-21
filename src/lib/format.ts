import type { Fighter, FighterRecord } from "@/types";

export function formatFighterName(fighter: Fighter): string {
  return `${fighter.firstName} ${fighter.lastName}`;
}

export function formatRecord(record: FighterRecord): string {
  const base = `${record.wins}-${record.losses}-${record.draws}`;
  return record.noContests > 0 ? `${base} (${record.noContests} NC)` : base;
}

export function formatEventDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatOdds(odds: number | undefined): string {
  if (odds === undefined) return "—";
  return odds > 0 ? `+${odds}` : `${odds}`;
}

export function formatDayMonth(iso: string): { day: string; month: string } {
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString("en-US", { day: "numeric" }),
    month: d.toLocaleDateString("en-US", { month: "short" }),
  };
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
