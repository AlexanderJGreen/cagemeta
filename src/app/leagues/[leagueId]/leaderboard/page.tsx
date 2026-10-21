import { notFound } from "next/navigation";
import { getLeagueById } from "@/lib/data/leagues";
import { currentUserId } from "@/lib/data/mock/users";
import { getLeagueStandings } from "@/lib/standings";
import { StandingsList } from "@/components/features/leagues/StandingsList";
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

  const standings = await getLeagueStandings(league);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader
        title="Leaderboard"
        subtitle={
          standings ? `${league.name} · scored through ${standings.scoredEvent.name}` : league.name
        }
      />
      {standings ? (
        <StandingsList rows={standings.rows} currentUserId={currentUserId} />
      ) : (
        <EmptyState
          title="No scored events yet"
          body="The leaderboard fills in once an event's fights are complete and results are entered."
        />
      )}
    </div>
  );
}
