import type { UserProfile } from "@/types";

export const mockUsers: UserProfile[] = [
  { id: "u01", username: "alexg", displayName: "Alex G", createdAt: "2026-08-01T00:00:00Z" },
  { id: "u02", username: "mikeyd", displayName: "Mikey D", createdAt: "2026-08-02T00:00:00Z" },
  { id: "u03", username: "sarahk", displayName: "Sarah K", createdAt: "2026-08-03T00:00:00Z" },
  { id: "u04", username: "tpratt", displayName: "T. Pratt", createdAt: "2026-08-04T00:00:00Z" },
];

// Stand-in for the authenticated user until Phase 2 wires up real auth.
export const currentUserId = "u01";
