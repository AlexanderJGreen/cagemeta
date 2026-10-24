import type { Event, Fight, LockMode } from "@/types";

/**
 * Whether picks on this fight are locked at `now`. "per-fight" leagues lock each bout when it
 * starts; "event-start" leagues lock the whole card when the event starts. A fight that is no
 * longer scheduled (live, finished, cancelled) is always locked.
 */
export function isFightLocked(
  lockMode: LockMode,
  fight: Pick<Fight, "scheduledStartTime" | "status">,
  event: Pick<Event, "date" | "status">,
  now: Date,
): boolean {
  if (fight.status !== "scheduled") return true;
  if (event.status !== "upcoming") return true;
  const lockAt = lockMode === "event-start" ? event.date : fight.scheduledStartTime;
  return now.getTime() >= new Date(lockAt).getTime();
}
