import { createHash } from "node:crypto";

/**
 * Maps a mock ID ("f01", "e02", ...) to a stable UUID (v5-style: SHA-1 of a namespaced name).
 * The same mock ID always yields the same UUID, so re-running the seed upserts instead of duplicating.
 */
export function uuidFor(kind: string, mockId: string): string {
  const hash = createHash("sha1").update(`cagemeta:${kind}:${mockId}`).digest();
  hash[6] = (hash[6] & 0x0f) | 0x50; // version 5
  hash[8] = (hash[8] & 0x3f) | 0x80; // RFC 4122 variant
  const h = hash.subarray(0, 16).toString("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export const userId = (id: string) => uuidFor("user", id);
export const fighterId = (id: string) => uuidFor("fighter", id);
export const eventId = (id: string) => uuidFor("event", id);
export const fightId = (id: string) => uuidFor("fight", id);
export const leagueId = (id: string) => uuidFor("league", id);
export const pickId = (id: string) => uuidFor("pick", id);
export const finishCallId = (id: string) => uuidFor("finish_call", id);
