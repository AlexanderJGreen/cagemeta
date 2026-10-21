import type { Event } from "@/types";

const labels: Record<Event["status"], string> = {
  upcoming: "Upcoming",
  live: "Live",
  completed: "Final",
};

/** Broadcast-style status tag. Red is reserved for live and for the upcoming card to act on. */
export function StatusTag({ status }: { status: Event["status"] }) {
  const tone =
    status === "live"
      ? "bg-accent text-accent-ink"
      : status === "upcoming"
        ? "border border-accent text-accent-hot"
        : "border border-line-strong text-ink-dim";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm px-2 py-1 font-display text-sm font-bold uppercase leading-none tracking-wider ${tone}`}
    >
      {status === "live" ? (
        <span aria-hidden className="live-dot h-1.5 w-1.5 rounded-full bg-accent-ink" />
      ) : null}
      {labels[status]}
    </span>
  );
}
