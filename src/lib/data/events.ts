import type { Event } from "@/types";
import { mockEvents } from "./mock/events";

export async function getEvents(): Promise<Event[]> {
  // Upcoming and live cards first (soonest first), then completed cards (most recent first).
  const open = mockEvents.filter((e) => e.status !== "completed");
  const done = mockEvents.filter((e) => e.status === "completed");
  return [
    ...open.sort((a, b) => a.date.localeCompare(b.date)),
    ...done.sort((a, b) => b.date.localeCompare(a.date)),
  ];
}

export async function getEventById(id: string): Promise<Event | undefined> {
  return mockEvents.find((e) => e.id === id);
}
