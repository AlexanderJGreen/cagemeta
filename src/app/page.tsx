import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getEvents } from "@/lib/data/events";
import { getFightsByEventId } from "@/lib/data/fights";
import { getFightersByIds } from "@/lib/data/fighters";
import { getLeaguesForUser } from "@/lib/data/leagues";
import { currentUserId } from "@/lib/data/mock/users";
import { getLeagueStandings } from "@/lib/standings";
import { EventCard } from "@/components/features/events/EventCard";
import { StandingsList } from "@/components/features/leagues/StandingsList";
import { LinkButton } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusTag } from "@/components/ui/StatusTag";
import { formatEventDate } from "@/lib/format";

export default async function Home() {
  const [events, leagues] = await Promise.all([getEvents(), getLeaguesForUser(currentUserId)]);
  const nextEvent = events.find((e) => e.status !== "completed");
  const league = leagues[0];

  const [fights, standings] = await Promise.all([
    nextEvent ? getFightsByEventId(nextEvent.id) : Promise.resolve([]),
    league ? getLeagueStandings(league) : Promise.resolve(undefined),
  ]);
  const mainEvent = fights.find((f) => f.cardPosition === "main");
  const mainFighters = mainEvent
    ? await getFightersByIds([mainEvent.fighterAId, mainEvent.fighterBId])
    : [];
  const fighterA = mainFighters.find((f) => f.id === mainEvent?.fighterAId);
  const fighterB = mainFighters.find((f) => f.id === mainEvent?.fighterBId);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      {nextEvent ? (
        <section aria-labelledby="next-card" className="rise rounded-sm border border-line bg-surface">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
            <div className="flex items-center gap-3">
              <StatusTag status={nextEvent.status} />
              <span className="text-sm text-ink-dim">{formatEventDate(nextEvent.date)}</span>
            </div>
            <span className="caption hidden sm:inline">
              {nextEvent.location.venue}, {nextEvent.location.city}
            </span>
          </div>

          <div className="px-4 py-6 sm:px-6 sm:py-8">
            <h1 id="next-card" className="caption">
              {nextEvent.shortName} · Main event
            </h1>
            {fighterA && fighterB ? (
              <p className="display mt-2 text-6xl font-extrabold sm:text-8xl">
                <Link href={`/fighters/${fighterA.id}`} className="hover:text-accent-hot">
                  {fighterA.lastName}
                </Link>
                <span className="mx-3 text-ink-faint sm:mx-5">vs</span>
                <Link href={`/fighters/${fighterB.id}`} className="hover:text-accent-hot">
                  {fighterB.lastName}
                </Link>
              </p>
            ) : (
              <p className="display mt-2 text-5xl font-extrabold">{nextEvent.name}</p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {league ? (
                <LinkButton href={`/leagues/${league.id}/draft/${nextEvent.id}`}>
                  Draft your card
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </LinkButton>
              ) : null}
              <LinkButton href={`/events/${nextEvent.id}`} variant="secondary">
                View fight card
              </LinkButton>
            </div>
          </div>
        </section>
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <section aria-labelledby="schedule">
          <SectionHeading aside={<Link href="/events" className="hover:text-ink">All events</Link>}>
            <span id="schedule">Schedule</span>
          </SectionHeading>
          <div className="flex flex-col gap-2">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        {league ? (
          <section aria-labelledby="standings">
            <SectionHeading
              aside={
                <Link href={`/leagues/${league.id}/leaderboard`} className="hover:text-ink">
                  Full table
                </Link>
              }
            >
              <span id="standings">{league.name}</span>
            </SectionHeading>
            {standings ? (
              <>
                <StandingsList rows={standings.rows} currentUserId={currentUserId} />
                <p className="mt-2 text-xs text-ink-faint">
                  Scored through {standings.scoredEvent.shortName}
                </p>
              </>
            ) : (
              <p className="rounded-sm border border-dashed border-line-strong px-4 py-8 text-center text-sm text-ink-dim">
                Standings appear after the first scored card.
              </p>
            )}
          </section>
        ) : null}
      </div>
    </div>
  );
}
