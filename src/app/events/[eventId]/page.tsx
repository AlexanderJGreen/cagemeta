import { notFound } from "next/navigation";
import { getEventById } from "@/lib/data/events";
import { getFightsByEventId, getFightResultsByEventId } from "@/lib/data/fights";
import { getFightersByIds } from "@/lib/data/fighters";
import { getPricesForEvent } from "@/lib/data/fighter-prices";
import { getLeaguesForUser } from "@/lib/data/leagues";
import { currentUserId } from "@/lib/data/mock/users";
import { FightRow } from "@/components/features/events/FightRow";
import { PageHeader } from "@/components/ui/PageHeader";
import { LinkButton } from "@/components/ui/Button";
import { formatEventDate } from "@/lib/format";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = await getEventById(eventId);
  if (!event) notFound();

  const [fights, prices, results, leagues] = await Promise.all([
    getFightsByEventId(event.id),
    getPricesForEvent(event.id),
    getFightResultsByEventId(event.id),
    getLeaguesForUser(currentUserId),
  ]);

  const fighterIds = fights.flatMap((f) => [f.fighterAId, f.fighterBId]);
  const fighters = await getFightersByIds(fighterIds);
  const fighterById = new Map(fighters.map((f) => [f.id, f]));
  const priceByFighterId = new Map(prices.map((p) => [p.fighterId, p]));
  const resultByFightId = new Map(results.map((r) => [r.fightId, r]));
  const league = leagues[0];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <PageHeader
        title={event.name}
        subtitle={`${formatEventDate(event.date)} · ${event.location.venue}, ${event.location.city}`}
        action={
          event.status === "upcoming" && league ? (
            <LinkButton href={`/leagues/${league.id}/draft/${event.id}`}>Draft your card</LinkButton>
          ) : undefined
        }
      />
      <div className="flex flex-col gap-3">
        {fights.map((fight) => {
          const fighterA = fighterById.get(fight.fighterAId);
          const fighterB = fighterById.get(fight.fighterBId);
          if (!fighterA || !fighterB) return null;
          const result = resultByFightId.get(fight.id);
          return (
            <FightRow
              key={fight.id}
              fighterA={fighterA}
              fighterB={fighterB}
              weightClass={fight.weightClass}
              cardPosition={fight.cardPosition}
              scheduledRounds={fight.scheduledRounds}
              priceA={priceByFighterId.get(fighterA.id)}
              priceB={priceByFighterId.get(fighterB.id)}
              winnerId={result?.winnerId}
            />
          );
        })}
      </div>
    </div>
  );
}
