import type { ReactNode } from "react";

const toneClasses = {
  neutral: "border-line-strong text-ink-dim",
  accent: "border-accent bg-accent-wash text-accent-hot",
  positive: "border-positive/50 bg-positive-wash text-positive",
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
      className={`inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[0.6875rem] font-semibold leading-none tracking-wider uppercase ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
