import { z } from "zod";

export const MAX_LEAGUE_MEMBERS = 20;

export const createLeagueSchema = z.object({
  name: z.string().trim().min(3, "Use at least 3 characters").max(50, "50 characters or fewer"),
  budget: z.coerce.number().int().min(50, "Minimum 50").max(500, "Maximum 500"),
  maxDraftPicks: z.coerce.number().int().min(1, "Minimum 1").max(10, "Maximum 10"),
  lockMode: z.enum(["per-fight", "event-start"]),
});

export const joinLeagueSchema = z.object({
  inviteCode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^CAGE-[A-Z0-9]{4}$/, "Codes look like CAGE-7F2K"),
});
