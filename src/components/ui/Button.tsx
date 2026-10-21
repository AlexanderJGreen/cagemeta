import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

const variantClasses = {
  primary: "bg-accent text-accent-ink hover:bg-accent-hot active:translate-y-px",
  secondary: "border border-line-strong text-ink hover:border-ink-dim hover:bg-surface-raised",
  ghost: "text-ink-dim hover:text-ink hover:bg-surface-raised",
} as const;

type Variant = keyof typeof variantClasses;

const baseClasses =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-5 font-display text-base font-bold uppercase tracking-wider transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ComponentPropsWithoutRef<"button"> & { variant?: Variant }) {
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props} />
  );
}

export function LinkButton({
  variant = "primary",
  href,
  children,
  className = "",
}: {
  variant?: Variant;
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </Link>
  );
}
