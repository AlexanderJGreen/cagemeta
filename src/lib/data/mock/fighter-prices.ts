import type { FighterPrice } from "@/types";

// Prices roughly track betting favoritism within each bout; they don't need to sum to anything.
export const mockFighterPrices: FighterPrice[] = [
  { fighterId: "f01", eventId: "e01", price: 32, odds: -220 },
  { fighterId: "f02", eventId: "e01", price: 18, odds: 180 },
  { fighterId: "f03", eventId: "e01", price: 29, odds: -180 },
  { fighterId: "f04", eventId: "e01", price: 19, odds: 155 },
  { fighterId: "f05", eventId: "e01", price: 34, odds: -300 },
  { fighterId: "f06", eventId: "e01", price: 14, odds: 240 },
  { fighterId: "f07", eventId: "e01", price: 24, odds: -130 },
  { fighterId: "f08", eventId: "e01", price: 20, odds: 110 },
  { fighterId: "f09", eventId: "e01", price: 27, odds: -165 },
  { fighterId: "f10", eventId: "e01", price: 17, odds: 140 },

  { fighterId: "f11", eventId: "e02", price: 26, odds: -150 },
  { fighterId: "f12", eventId: "e02", price: 21, odds: 125 },
  { fighterId: "f13", eventId: "e02", price: 36, odds: -400 },
  { fighterId: "f14", eventId: "e02", price: 13, odds: 310 },
  { fighterId: "f15", eventId: "e02", price: 23, odds: -115 },
  { fighterId: "f16", eventId: "e02", price: 21, odds: -105 },
  { fighterId: "f17", eventId: "e02", price: 25, odds: -140 },
  { fighterId: "f18", eventId: "e02", price: 16, odds: 120 },
  { fighterId: "f19", eventId: "e02", price: 22, odds: -110 },
  { fighterId: "f20", eventId: "e02", price: 19, odds: -110 },
];
