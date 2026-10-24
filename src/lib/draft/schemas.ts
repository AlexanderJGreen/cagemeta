import { z } from "zod";
import { CALLABLE_METHODS } from "./validate-draft";

/** Shape of the draft the browser submits. Everything else (prices, locks, budget) is looked up server-side. */
export const saveDraftSchema = z.object({
  leagueId: z.uuid(),
  eventId: z.uuid(),
  fighterIds: z.array(z.uuid()).max(10),
  finishCall: z
    .object({
      fightId: z.uuid(),
      method: z.enum(CALLABLE_METHODS),
      round: z.number().int().min(1).max(5),
    })
    .optional(),
});

export type SaveDraftInput = z.infer<typeof saveDraftSchema>;
