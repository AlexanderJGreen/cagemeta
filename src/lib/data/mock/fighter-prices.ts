import type { FighterPrice } from "@/types";

// Draft prices are game credits set by title status and record: favorites cost more, underdogs are
// cheap. They are not sportsbook odds, so `odds` is left empty until a provider supplies them.
export const mockFighterPrices: FighterPrice[] = [
  { fighterId: "f01", eventId: "e01", price: 30 },
  { fighterId: "f02", eventId: "e01", price: 16 },
  { fighterId: "f03", eventId: "e01", price: 31 },
  { fighterId: "f04", eventId: "e01", price: 22 },
  { fighterId: "f05", eventId: "e01", price: 27 },
  { fighterId: "f06", eventId: "e01", price: 15 },
  { fighterId: "f07", eventId: "e01", price: 21 },
  { fighterId: "f08", eventId: "e01", price: 23 },
  { fighterId: "f09", eventId: "e01", price: 24 },
  { fighterId: "f10", eventId: "e01", price: 14 },

  { fighterId: "f11", eventId: "e02", price: 30 },
  { fighterId: "f12", eventId: "e02", price: 17 },
  { fighterId: "f13", eventId: "e02", price: 29 },
  { fighterId: "f14", eventId: "e02", price: 20 },
  { fighterId: "f15", eventId: "e02", price: 24 },
  { fighterId: "f16", eventId: "e02", price: 23 },
  { fighterId: "f17", eventId: "e02", price: 24 },
  { fighterId: "f18", eventId: "e02", price: 25 },
  { fighterId: "f19", eventId: "e02", price: 27 },
  { fighterId: "f20", eventId: "e02", price: 12 },
];
