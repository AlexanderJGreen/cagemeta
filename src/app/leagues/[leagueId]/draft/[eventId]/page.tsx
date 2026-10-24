import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getLeagueById } from "@/lib/data/leagues";
import { getEventById } from "@/lib/data/events";
import { getFightsByEventId } from "@/lib/data/fights";
import { getFightersByIds } from "@/lib/data/fighters";
import { getPricesForEvent } from "@/lib/data/fighter-prices";
import { getFinishCallForUser, getPicksForUser } from "@/lib/data/picks";
import { isFightLocked } from "@/lib/draft/locking";
import { PageHeader } from "@/components/ui/PageHeader";
import { DraftBoard, type DraftBout } from "@/components/features/draft/DraftBoard";
import type { FinishCallDraft } from "@/components/features/draft/FinishCallPicker";

export default async function DraftPage({
  params,
}: {
  params: Promise<{ leagueId: string; eventId: string }>;
}) {
  const { leagueId, eventId } = await params;
  const user = await requireUser(`/leagues/${leagueId}/draft/${eventId}`);

  // The league lookup runs under RLS, so non-members get a 404.
  const [league, event] = await Promise.all([getLeagueById(leagueId), getEventById(eventId)]);
  if (!league || !event) notFound();

  const [fights, prices, picks, finishCall] = await Promise.all([
    getFightsByEventId(event.id),
    getPricesForEvent(event.id),
    getPicksForUser(league.id, event.id, user.id),
    getFinishCallForUser(league.id, event.id, user.id),
  ]);
  const fighters = await getFightersByIds(fights.flatMap((f) => [f.fighterAId, f.fighterBId]));
  const fighterById = new Map(fighters.map((f) => [f.id, f]));
  const priceByFighterId = new Map(prices.map((p) => [p.fighterId, p]));
  const now = new Date();

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
        scheduledRounds: fight.scheduledRounds,
        locked: isFightLocked(league.lockMode, fight, event, now),
      },
    ];
  });

  const initialFinishCall: FinishCallDraft | undefined = finishCall && {
    fightId: finishCall.fightId,
    method: finishCall.predictedMethod as FinishCallDraft["method"],
    round: finishCall.predictedRound,
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader
        title={`Draft: ${event.shortName}`}
        subtitle={`${league.name} · ${event.name.split(": ")[1] ?? event.name} · up to ${league.maxDraftPicks} fighters, one per bout`}
      />
      <DraftBoard
        leagueId={league.id}
        eventId={event.id}
        bouts={bouts}
        budget={league.budget}
        maxPicks={league.maxDraftPicks}
        initialSelected={picks.map((p) => p.fighterId)}
        initialFinishCall={initialFinishCall}
        finishCallBonus={league.scoringConfig.finishCallBonus}
      />
    </div>
  );
}
