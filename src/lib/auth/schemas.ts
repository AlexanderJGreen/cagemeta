import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address")),
  password: z.string().min(1, "Enter your password"),
});

export const signupSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address")),
  password: z.string().min(8, "Use at least 8 characters").max(72, "Use 72 characters or fewer"),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9_]{3,20}$/, "3-20 characters: letters, numbers, underscores"),
  displayName: z.string().trim().min(1, "Enter a display name").max(40, "40 characters or fewer"),
});

/** Only same-site relative paths are accepted as post-login destinations (blocks open redirects). */
export function safeNextPath(value: unknown): string {
  if (typeof value !== "string") return "/";
  return value.startsWith("/") && !value.startsWith("//") && !value.includes("\\") ? value : "/";
}
