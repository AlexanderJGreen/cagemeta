"use client";

import { useActionState } from "react";
import { createLeague, type LeagueFormState } from "@/app/leagues/actions";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

export function CreateLeagueForm() {
  const [state, action, pending] = useActionState<LeagueFormState, FormData>(createLeague, {});
  const fe = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-4" noValidate>
      <TextField label="League name" name="name" required error={fe.name?.[0]} />
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Budget (credits)"
          name="budget"
          type="number"
          inputMode="numeric"
          defaultValue={100}
          error={fe.budget?.[0]}
        />
        <TextField
          label="Max fighters"
          name="maxDraftPicks"
          type="number"
          inputMode="numeric"
          defaultValue={5}
          error={fe.maxDraftPicks?.[0]}
        />
      </div>
      <fieldset>
        <legend className="mb-1.5 text-sm font-medium text-ink">Picks lock</legend>
        <div className="space-y-2 text-sm text-ink-dim">
          <label className="flex items-center gap-2">
            <input type="radio" name="lockMode" value="per-fight" defaultChecked className="accent-accent" />
            When each fight starts
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="lockMode" value="event-start" className="accent-accent" />
            When the event starts
          </label>
        </div>
      </fieldset>
      {state.error ? (
        <p role="alert" className="text-sm text-accent-hot">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Creating…" : "Create league"}
      </Button>
    </form>
  );
}
