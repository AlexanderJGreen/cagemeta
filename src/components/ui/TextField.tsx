import type { ComponentPropsWithoutRef } from "react";

export function TextField({
  label,
  name,
  error,
  hint,
  ...props
}: Omit<ComponentPropsWithoutRef<"input">, "name"> & {
  label: string;
  name: string;
  error?: string;
  hint?: string;
}) {
  const describedBy = [error ? `${name}-error` : null, hint ? `${name}-hint` : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={`min-h-11 w-full rounded-sm border bg-canvas px-3 text-ink placeholder:text-ink-faint focus:border-ink-dim focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          error ? "border-accent" : "border-line-strong"
        }`}
        {...props}
      />
      {hint && !error ? (
        <p id={`${name}-hint`} className="mt-1.5 text-xs text-ink-faint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-accent-hot">
          {error}
        </p>
      ) : null}
    </div>
  );
}
