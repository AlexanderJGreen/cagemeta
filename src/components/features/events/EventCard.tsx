import Link from "next/link";
import type { Event } from "@/types";
import { formatEventDate } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";

const statusLabel: Record<Event["status"], string> = {
  upcoming: "Upcoming",
  live: "Live",
  completed: "Completed",
};

export function EventCard({ event }: { event: Event }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="block rounded border border-line bg-surface p-5 transition-colors hover:border-accent/50"
    >
      <div className="flex items-center justify-between">
        <Badge tone={event.status === "upcoming" ? "accent" : "neutral"}>
          {statusLabel[event.status]}
        </Badge>
        <span className="font-mono text-xs tabular-nums text-ink-dim">{event.fightIds.length} fights</span>
      </div>
      <h2 className="mt-3 font-display text-xl font-medium text-ink">{event.name}</h2>
      <p className="mt-1 text-sm text-ink-dim">{formatEventDate(event.date)}</p>
      <p className="text-sm text-ink-dim">
        {event.location.venue}, {event.location.city}
      </p>
    </Link>
  );
}
