import type { UserProfile } from "@/types";
import { mockUsers, currentUserId } from "./mock/users";

export async function getCurrentUser(): Promise<UserProfile> {
  const user = mockUsers.find((u) => u.id === currentUserId);
  if (!user) throw new Error("Mock current user not found");
  return user;
}

export async function getUserById(id: string): Promise<UserProfile | undefined> {
  return mockUsers.find((u) => u.id === id);
}

export async function getUsersByIds(ids: string[]): Promise<UserProfile[]> {
  const idSet = new Set(ids);
  return mockUsers.filter((u) => idSet.has(u.id));
}
