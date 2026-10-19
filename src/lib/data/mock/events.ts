import type { Event } from "@/types";

export const mockEvents: Event[] = [
  {
    id: "e01",
    name: "Cage Championship 310: Volkov vs. Reed",
    shortName: "CC 310",
    date: "2026-11-14T22:00:00-05:00",
    location: { venue: "Apex Arena", city: "Las Vegas", country: "USA" },
    status: "upcoming",
    fightIds: ["fi01", "fi02", "fi03", "fi04", "fi05"],
  },
  {
    id: "e02",
    name: "Cage Championship 309: Hartman vs. Vasquez",
    shortName: "CC 309",
    date: "2026-10-03T22:00:00-04:00",
    location: { venue: "Riverside Garden", city: "Miami", country: "USA" },
    status: "completed",
    fightIds: ["fi06", "fi07", "fi08", "fi09", "fi10"],
  },
];
