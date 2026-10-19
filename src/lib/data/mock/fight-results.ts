import type { FightResult } from "@/types";

// Results only exist for the completed event (e02), fights fi06-fi10.
export const mockFightResults: FightResult[] = [
  {
    fightId: "fi06",
    winnerId: "f13",
    method: "Submission",
    methodDetail: "Rear-naked choke",
    round: 3,
    time: "4:12",
    stats: [
      { fighterId: "f13", sigStrikesLanded: 61, takedowns: 3, knockdowns: 0 },
      { fighterId: "f14", sigStrikesLanded: 48, takedowns: 0, knockdowns: 0 },
    ],
  },
  {
    fightId: "fi07",
    winnerId: "f12",
    method: "KO/TKO",
    methodDetail: "Punches",
    round: 1,
    time: "2:47",
    stats: [
      { fighterId: "f12", sigStrikesLanded: 14, takedowns: 0, knockdowns: 1 },
      { fighterId: "f11", sigStrikesLanded: 6, takedowns: 0, knockdowns: 0 },
    ],
  },
  {
    fightId: "fi08",
    winnerId: "f15",
    method: "Decision - Unanimous",
    round: 3,
    time: "5:00",
    stats: [
      { fighterId: "f15", sigStrikesLanded: 72, takedowns: 2, knockdowns: 0 },
      { fighterId: "f16", sigStrikesLanded: 65, takedowns: 1, knockdowns: 0 },
    ],
  },
  {
    fightId: "fi09",
    winnerId: "f18",
    method: "KO/TKO",
    methodDetail: "Head kick",
    round: 2,
    time: "1:33",
    stats: [
      { fighterId: "f18", sigStrikesLanded: 29, takedowns: 0, knockdowns: 1 },
      { fighterId: "f17", sigStrikesLanded: 22, takedowns: 0, knockdowns: 0 },
    ],
  },
  {
    fightId: "fi10",
    winnerId: "f19",
    method: "Decision - Split",
    round: 3,
    time: "5:00",
    stats: [
      { fighterId: "f19", sigStrikesLanded: 54, takedowns: 4, knockdowns: 0 },
      { fighterId: "f20", sigStrikesLanded: 58, takedowns: 0, knockdowns: 0 },
    ],
  },
];
