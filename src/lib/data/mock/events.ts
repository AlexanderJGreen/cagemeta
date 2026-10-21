import type { Event } from "@/types";

export const mockEvents: Event[] = [
  {
    id: "e01",
    name: "UFC 334: Gane vs. Hokit",
    shortName: "UFC 334",
    date: "2026-11-14T22:00:00-05:00",
    location: { venue: "Madison Square Garden", city: "New York City", country: "USA" },
    status: "upcoming",
    fightIds: ["fi01", "fi02", "fi03", "fi04", "fi05"],
  },
  {
    id: "e02",
    name: "UFC 300: Pereira vs. Hill",
    shortName: "UFC 300",
    date: "2024-04-13T19:00:00-07:00",
    location: { venue: "T-Mobile Arena", city: "Las Vegas", country: "USA" },
    status: "completed",
    fightIds: ["fi06", "fi07", "fi08", "fi09", "fi10"],
  },
];
