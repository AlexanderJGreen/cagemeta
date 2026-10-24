import { z } from "zod";
import type { ScoringConfig } from "@/types";

const points = z.number().min(0).max(1000);

/** Validates a league's scoring_config JSON, both when reading from the database and when a league is created. */
export const scoringConfigSchema = z.object({
  winPoints: points,
  methodBonus: z.object({ koTko: points, submission: points, decision: points }),
  earlyFinishBonusByRound: z.record(z.string().regex(/^[1-5]$/), points),
  statBonus: z.object({
    perSigStrikeLanded: points,
    perTakedown: points,
    perKnockdown: points,
  }),
  finishCallBonus: points,
}) satisfies z.ZodType<ScoringConfig, unknown>;
