import Link from "next/link";
import { notFound } from "next/navigation";
import { getLeagueById, getLeagueMembers } from "@/lib/data/leagues";
import { getUsersByIds } from "@/lib/data/users";
import { getEvents } from "@/lib/data/events";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";

export default async function LeagueDetailPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;
  const league = await getLeagueById(leagueId);
  if (!league) notFound();

  const [members, events] = await Promise.all([getLeagueMembers(league.id), getEvents()]);
  const users = await getUsersByIds(members.map((m) => m.userId));
  const userById = new Map(users.map((u) => [u.id, u]));
  const upcomingEvent = events.find((e) => e.status === "upcoming");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <PageHeader
        title={league.name}
        subtitle={`Invite code ${league.inviteCode} · ${league.budget}cr budget · up to ${league.maxDraftPicks} fighters per event`}
        action={
          <Link
            href={`/leagues/${league.id}/leaderboard`}
            className="inline-flex items-center rounded border border-line px-4 py-2 font-display text-sm font-medium text-ink transition-colors hover:border-accent/50"
          >
            View leaderboard
          </Link>
        }
      />

      {upcomingEvent ? (
        <Link
          href={`/leagues/${league.id}/draft/${upcomingEvent.id}`}
          className="mb-8 flex items-center justify-between rounded border border-line bg-surface px-5 py-4 transition-colors hover:border-accent/50"
        >
          <div>
            <p className="text-xs text-ink-dim">Draft open</p>
            <p className="font-display text-lg font-medium text-ink">{upcomingEvent.name}</p>
          </div>
          <span className="font-display text-sm text-accent">Draft your card</span>
        </Link>
      ) : null}

      <section>
        <h2 className="font-display text-xl font-medium text-ink">Members</h2>
        <ul className="mt-4 flex flex-col divide-y divide-line border-y border-line">
          {members.map((member) => {
            const user = userById.get(member.userId);
            if (!user) return null;
            return (
              <li key={member.userId} className="flex items-center justify-between py-3">
                <span className="text-sm text-ink">{user.displayName}</span>
                {member.role === "owner" ? <Badge tone="positive">Owner</Badge> : <Badge>Member</Badge>}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
