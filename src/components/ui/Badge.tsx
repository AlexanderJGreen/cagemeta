import type { ReactNode } from "react";

const toneClasses = {
  neutral: "border-line text-ink-dim",
  accent: "border-accent/40 text-accent",
  positive: "border-positive/40 text-positive",
} as const;

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: keyof typeof toneClasses;
}) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium tracking-wide uppercase ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
