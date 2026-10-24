"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import type { AuthFormState } from "@/app/(auth)/actions";

type Mode = "login" | "signup";

export function AuthForm({
  mode,
  action,
  next,
}: {
  mode: Mode;
  action: (prev: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  next?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const fe = state.fieldErrors ?? {};
  const isSignup = mode === "signup";

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {next ? <input type="hidden" name="next" value={next} /> : null}

      {isSignup ? (
        <>
          <TextField
            label="Display name"
            name="displayName"
            autoComplete="nickname"
            required
            error={fe.displayName?.[0]}
          />
          <TextField
            label="Username"
            name="username"
            autoComplete="username"
            autoCapitalize="none"
            required
            hint="Lowercase letters, numbers and underscores"
            error={fe.username?.[0]}
          />
        </>
      ) : null}

      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        error={fe.email?.[0]}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete={isSignup ? "new-password" : "current-password"}
        required
        hint={isSignup ? "At least 8 characters" : undefined}
        error={fe.password?.[0]}
      />

      <div aria-live="polite">
        {state.error ? <p className="text-sm text-accent-hot">{state.error}</p> : null}
        {state.message ? <p className="text-sm text-positive">{state.message}</p> : null}
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Please wait…" : isSignup ? "Create account" : "Log in"}
      </Button>

      <p className="text-center text-sm text-ink-dim">
        {isSignup ? "Already have an account? " : "New here? "}
        <Link
          href={isSignup ? "/login" : "/signup"}
          className="text-ink underline underline-offset-4 hover:text-accent-hot"
        >
          {isSignup ? "Log in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
