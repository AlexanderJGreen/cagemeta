import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

const variantClasses = {
  primary: "bg-accent text-accent-ink hover:opacity-90",
  secondary: "border border-line text-ink hover:border-accent/50",
} as const;

type Variant = keyof typeof variantClasses;

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded px-4 py-2 font-display text-sm font-medium tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-40";

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
