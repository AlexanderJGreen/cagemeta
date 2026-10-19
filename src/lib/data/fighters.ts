import type { Fighter } from "@/types";
import { mockFighters } from "./mock/fighters";

export async function getFighters(): Promise<Fighter[]> {
  return mockFighters;
}

export async function getFighterById(id: string): Promise<Fighter | undefined> {
  return mockFighters.find((f) => f.id === id);
}

export async function getFightersByIds(ids: string[]): Promise<Fighter[]> {
  const idSet = new Set(ids);
  return mockFighters.filter((f) => idSet.has(f.id));
}
