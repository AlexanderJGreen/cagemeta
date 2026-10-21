import type { ComponentPropsWithoutRef } from "react";

/** A flat bordered panel. Never nest one panel inside another. */
export function Card({ className = "", ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={`rounded-sm border border-line bg-surface ${className}`} {...props} />;
}
