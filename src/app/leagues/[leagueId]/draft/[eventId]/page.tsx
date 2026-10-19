import { notFound } from "next/navigation";
import { getLeagueById } from "@/lib/data/leagues";
import { getEventById } from "@/lib/data/events";
import { getFightsByEventId } from "@/lib/data/fights";
import { getFightersByIds } from "@/lib/data/fighters";
import { getPricesForEvent } from "@/lib/data/fighter-prices";
import { PageHeader } from "@/components/ui/PageHeader";
import { DraftBoard, type DraftBout } from "@/components/features/draft/DraftBoard";

export default async function DraftPage({
  params,
}: {
  params: Promise<{ leagueId: string; eventId: string }>;
}) {
  const { leagueId, eventId } = await params;
  const [league, event] = await Promise.all([getLeagueById(leagueId), getEventById(eventId)]);
  if (!league || !event) notFound();

  const [fights, prices] = await Promise.all([
    getFightsByEventId(event.id),
    getPricesForEvent(event.id),
  ]);
  const fighters = await getFightersByIds(fights.flatMap((f) => [f.fighterAId, f.fighterBId]));
  const fighterById = new Map(fighters.map((f) => [f.id, f]));
  const priceByFighterId = new Map(prices.map((p) => [p.fighterId, p]));

  const bouts: DraftBout[] = fights.flatMap((fight) => {
    const fighterA = fighterById.get(fight.fighterAId);
    const fighterB = fighterById.get(fight.fighterBId);
    const priceA = priceByFighterId.get(fight.fighterAId);
    const priceB = priceByFighterId.get(fight.fighterBId);
    if (!fighterA || !fighterB || !priceA || !priceB) return [];
    return [
      {
        fightId: fight.id,
        weightClass: fight.weightClass,
        cardPosition: fight.cardPosition,
        fighterA,
        priceA,
        fighterB,
        priceB,
      },
    ];
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <PageHeader
        title={`Draft: ${event.name}`}
        subtitle={`${league.name} · pick up to ${league.maxDraftPicks} fighters, one per bout, within budget`}
      />
      <DraftBoard bouts={bouts} budget={league.budget} maxPicks={league.maxDraftPicks} />
    </div>
  );
}
