export type EventStatus = "upcoming" | "live" | "completed";

export interface EventLocation {
  venue: string;
  city: string;
  country: string;
}

export interface Event {
  id: string;
  name: string;
  shortName: string;
  /** ISO 8601 date-time string. */
  date: string;
  location: EventLocation;
  status: EventStatus;
  fightIds: string[];
}
