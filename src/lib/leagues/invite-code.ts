import { randomInt } from "node:crypto";

// No 0/O/1/I so codes survive being read aloud or typed from a screenshot.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** e.g. "CAGE-7F2K". Uses crypto-grade randomness; callers retry on the rare unique-key collision. */
export function generateInviteCode(): string {
  let suffix = "";
  for (let i = 0; i < 4; i++) suffix += ALPHABET[randomInt(ALPHABET.length)];
  return `CAGE-${suffix}`;
}

/** Normalises user input like " cage-7f2k " to "CAGE-7F2K". */
export function normalizeInviteCode(input: string): string {
  return input.trim().toUpperCase();
}
