import type { FighterPrice } from "@/types";
import { mockFighterPrices } from "./mock/fighter-prices";

export async function getPricesForEvent(eventId: string): Promise<FighterPrice[]> {
  return mockFighterPrices.filter((p) => p.eventId === eventId);
}

export async function getFighterPrice(
  fighterId: string,
  eventId: string,
): Promise<FighterPrice | undefined> {
  return mockFighterPrices.find((p) => p.fighterId === fighterId && p.eventId === eventId);
}
