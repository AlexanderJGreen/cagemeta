import type { Fighter } from "@/types";

const sizeClasses = {
  sm: "h-9 w-9 text-xs",
  md: "h-14 w-14 text-base",
  lg: "h-20 w-20 text-xl",
} as const;

export function FighterAvatar({
  fighter,
  size = "md",
}: {
  fighter: Pick<Fighter, "firstName" | "lastName">;
  size?: keyof typeof sizeClasses;
}) {
  const initials = `${fighter.firstName[0]}${fighter.lastName[0]}`.toUpperCase();
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-line bg-surface-raised font-display font-medium text-ink-dim ${sizeClasses[size]}`}
      aria-hidden
    >
      {initials}
    </span>
  );
}
