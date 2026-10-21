import type { ReactNode } from "react";

export function SectionHeading({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-4">
      <h2 className="display text-2xl font-bold">{children}</h2>
      {aside ? <div className="text-sm text-ink-dim">{aside}</div> : null}
    </div>
  );
}
