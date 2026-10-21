import type { Fighter } from "@/types";

const sizeClasses = {
  sm: "h-9 w-9 text-sm",
  md: "h-12 w-12 text-lg",
  lg: "h-20 w-20 text-3xl",
} as const;

/** Initials tile. Real photos need provider licensing, so this is the placeholder. */
export function FighterAvatar({
  fighter,
  size = "md",
  tone = "neutral",
}: {
  fighter: Pick<Fighter, "firstName" | "lastName">;
  size?: keyof typeof sizeClasses;
  tone?: "neutral" | "accent";
}) {
  const initials = `${fighter.firstName[0]}${fighter.lastName[0]}`.toUpperCase();
  return (
    <span
      className={`display inline-flex shrink-0 items-center justify-center rounded-sm border ${
        tone === "accent"
          ? "border-accent bg-accent-wash text-accent-hot"
          : "border-line-strong bg-surface-raised text-ink-dim"
      } ${sizeClasses[size]}`}
      aria-hidden
    >
      {initials}
    </span>
  );
}
