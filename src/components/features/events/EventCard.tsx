import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Event } from "@/types";
import { formatDayMonth } from "@/lib/format";
import { StatusTag } from "@/components/ui/StatusTag";

/** One schedule row: date block, event name and venue, status. A row, not a card. */
export function EventCard({ event }: { event: Event }) {
  const { day, month } = formatDayMonth(event.date);
  const [title, matchup] = event.name.split(": ");

  return (
    <Link
      href={`/events/${event.id}`}
      className="group flex items-stretch rounded-sm border border-line bg-surface transition-colors duration-150 hover:border-line-strong hover:bg-surface-raised"
    >
      <div
        className={`flex w-16 shrink-0 flex-col items-center justify-center border-r border-line py-3 sm:w-20 ${
          event.status === "completed" ? "text-ink-dim" : "text-ink"
        }`}
      >
        <span className="caption">{month}</span>
        <span className="display text-4xl font-extrabold sm:text-5xl">{day}</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-4 py-3">
        <div className="flex items-center gap-2">
          <StatusTag status={event.status} />
          <span className="num text-xs text-ink-dim">{event.fightIds.length} bouts</span>
        </div>
        <h2 className="display truncate text-2xl font-bold group-hover:text-accent-hot sm:text-3xl">
          {matchup ?? title}
        </h2>
        <p className="truncate text-sm text-ink-dim">
          {matchup ? `${title} · ` : ""}
          {event.location.venue}, {event.location.city}
        </p>
      </div>
      <ChevronRight className="my-auto mr-3 h-5 w-5 shrink-0 text-ink-faint" aria-hidden />
    </Link>
  );
}
