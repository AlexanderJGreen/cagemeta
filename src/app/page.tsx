import Link from "next/link";
import { getEvents } from "@/lib/data/events";
import { getLeaguesForUser } from "@/lib/data/leagues";
import { currentUserId } from "@/lib/data/mock/users";
import { EventCard } from "@/components/features/events/EventCard";
import { PageHeader } from "@/components/ui/PageHeader";

export default async function Home() {
  const [events, leagues] = await Promise.all([
    getEvents(),
    getLeaguesForUser(currentUserId),
  ]);
  const upcoming = events.filter((e) => e.status !== "completed");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <PageHeader
        title="Fantasy MMA, scored the way fights actually happen"
        subtitle="Draft a fighter card within budget, call the finish, and climb your league's leaderboard."
      />

      <section>
        <h2 className="font-display text-xl font-medium text-ink">Upcoming cards</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {upcoming.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-medium text-ink">Your leagues</h2>
        <div className="mt-4 flex flex-col gap-3">
          {leagues.map((league) => (
            <Link
              key={league.id}
              href={`/leagues/${league.id}`}
              className="flex items-center justify-between rounded border border-line bg-surface px-5 py-4 transition-colors hover:border-accent/50"
            >
              <div>
                <p className="font-display text-lg font-medium text-ink">{league.name}</p>
                <p className="text-sm text-ink-dim">Invite code {league.inviteCode}</p>
              </div>
              <span className="font-mono text-sm tabular-nums text-positive">{league.budget}cr budget</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
