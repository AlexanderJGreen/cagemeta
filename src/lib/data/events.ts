import type { Event } from "@/types";
import { db, isUuid, unwrap } from "./db";
import { toEvent, type EventRow } from "./mappers";

const SELECT = "*, fights(id, bout_order)";

export async function getEvents(): Promise<Event[]> {
  const supabase = await db();
  const rows = unwrap(await supabase.from("events").select(SELECT), "events") as EventRow[];
  const events = rows.map(toEvent);

  // Upcoming and live cards first (soonest first), then completed cards (most recent first).
  const open = events.filter((e) => e.status !== "completed");
  const done = events.filter((e) => e.status === "completed");
  return [
    ...open.sort((a, b) => a.date.localeCompare(b.date)),
    ...done.sort((a, b) => b.date.localeCompare(a.date)),
  ];
}

export async function getEventById(id: string): Promise<Event | undefined> {
  if (!isUuid(id)) return undefined;
  const supabase = await db();
  const row = unwrap(
    await supabase.from("events").select(SELECT).eq("id", id).maybeSingle(),
    "event",
  ) as EventRow | null;
  return row ? toEvent(row) : undefined;
}
