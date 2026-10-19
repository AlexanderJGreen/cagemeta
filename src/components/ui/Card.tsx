import type { ComponentPropsWithoutRef } from "react";

export function Card({ className = "", ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={`rounded border border-line bg-surface ${className}`} {...props} />;
}
