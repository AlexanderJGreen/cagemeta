import type { Event } from "@/types";
import { mockEvents } from "./mock/events";

export async function getEvents(): Promise<Event[]> {
  return [...mockEvents].sort((a, b) => a.date.localeCompare(b.date));
}

export async function getEventById(id: string): Promise<Event | undefined> {
  return mockEvents.find((e) => e.id === id);
}
