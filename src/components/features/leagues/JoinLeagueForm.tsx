"use client";

import { useActionState } from "react";
import { joinLeague, type LeagueFormState } from "@/app/leagues/actions";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

export function JoinLeagueForm() {
  const [state, action, pending] = useActionState<LeagueFormState, FormData>(joinLeague, {});

  return (
    <form action={action} className="space-y-4" noValidate>
      <TextField
        label="Invite code"
        name="inviteCode"
        placeholder="CAGE-7F2K"
        autoCapitalize="characters"
        autoComplete="off"
        required
        error={state.fieldErrors?.inviteCode?.[0]}
      />
      {state.error ? (
        <p role="alert" className="text-sm text-accent-hot">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" variant="secondary" disabled={pending} className="w-full">
        {pending ? "Joining…" : "Join league"}
      </Button>
    </form>
  );
}
