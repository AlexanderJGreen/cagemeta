import type { FightResult } from "@/types";

// Real results from UFC 300 (e02), fights fi06-fi10. Per-fight strike/takedown/knockdown counts
// aren't sourced yet, so they're zero and these bouts score on result and finish only.
const noStats = (a: string, b: string) => [
  { fighterId: a, sigStrikesLanded: 0, takedowns: 0, knockdowns: 0 },
  { fighterId: b, sigStrikesLanded: 0, takedowns: 0, knockdowns: 0 },
];

export const mockFightResults: FightResult[] = [
  {
    fightId: "fi06",
    winnerId: "f13",
    method: "KO/TKO",
    methodDetail: "Punches",
    round: 1,
    time: "3:14",
    stats: noStats("f13", "f14"),
  },
  {
    fightId: "fi07",
    winnerId: "f11",
    method: "Decision - Unanimous",
    round: 5,
    time: "5:00",
    stats: noStats("f11", "f12"),
  },
  {
    fightId: "fi08",
    winnerId: "f15",
    method: "KO/TKO",
    methodDetail: "Punch",
    round: 5,
    time: "4:59",
    stats: noStats("f15", "f16"),
  },
  {
    fightId: "fi09",
    winnerId: "f17",
    method: "Decision - Split",
    round: 3,
    time: "5:00",
    stats: noStats("f17", "f18"),
  },
  {
    fightId: "fi10",
    winnerId: "f19",
    method: "Submission",
    methodDetail: "Rear-naked choke",
    round: 2,
    time: "3:38",
    stats: noStats("f19", "f20"),
  },
];
