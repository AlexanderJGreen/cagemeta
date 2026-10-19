import { notFound } from "next/navigation";
import { Trophy } from "lucide-react";
import { getLeagueById, getLeagueMembers } from "@/lib/data/leagues";
import { getUsersByIds } from "@/lib/data/users";
import { getEvents } from "@/lib/data/events";
import { getFightsByEventId, getFightResultsByEventId } from "@/lib/data/fights";
import { getPicks, getFinishCallsForEvent } from "@/lib/data/picks";
import { buildLeaderboard } from "@/lib/scoring/leaderboard";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function LeaderboardPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;
  const league = await getLeagueById(leagueId);
  if (!league) notFound();

  const [members, events] = await Promise.all([getLeagueMembers(league.id), getEvents()]);
  const scoredEvent = events.find((e) => e.status === "completed");

  if (!scoredEvent) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <PageHeader title="Leaderboard" subtitle={league.name} />
        <EmptyState
          title="No scored events yet"
          body="The leaderboard fills in once an event's fights are complete and results are entered."
        />
      </div>
    );
  }

  const users = await getUsersByIds(members.map((m) => m.userId));
  const fights = await getFightsByEventId(scoredEvent.id);
  const [results, picks, finishCalls] = await Promise.all([
    getFightResultsByEventId(scoredEvent.id),
    getPicks(league.id, scoredEvent.id),
    getFinishCallsForEvent(
      league.id,
      fights.map((f) => f.id),
    ),
  ]);

  const rows = buildLeaderboard(league, users, picks, fights, results, finishCalls);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <PageHeader title="Leaderboard" subtitle={`${league.name} · scored through ${scoredEvent.name}`} />
      <ol className="flex flex-col divide-y divide-line border-y border-line">
        {rows.map((row) => (
          <li key={row.userId} className="flex items-center gap-4 py-3">
            <span className="flex w-8 items-center gap-1 font-display text-2xl font-semibold text-ink-dim">
              {row.rank}
              {row.rank === 1 ? <Trophy className="h-4 w-4 text-positive" strokeWidth={2} /> : null}
            </span>
            <span className="flex-1 text-sm text-ink">{row.displayName}</span>
            <span className="font-mono text-xl font-medium tabular-nums text-positive">{row.totalPoints}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
