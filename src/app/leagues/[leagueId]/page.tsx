import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getLeagueById, getLeagueMembers } from "@/lib/data/leagues";
import { getUsersByIds } from "@/lib/data/users";
import { getEvents } from "@/lib/data/events";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusTag } from "@/components/ui/StatusTag";
import { StatRow } from "@/components/ui/StatRow";
import { formatEventDate } from "@/lib/format";

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
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader
        title={league.name}
        subtitle={`${members.length} members · ${league.lockMode === "per-fight" ? "Picks lock per fight" : "Picks lock at event start"}`}
        action={
          <LinkButton href={`/leagues/${league.id}/leaderboard`} variant="secondary">
            Leaderboard
          </LinkButton>
        }
      />

      {upcomingEvent ? (
        <Link
          href={`/leagues/${league.id}/draft/${upcomingEvent.id}`}
          className="group mb-8 flex items-center justify-between gap-4 rounded-sm border border-accent bg-accent-wash px-4 py-4 transition-colors hover:bg-accent/20"
        >
          <div className="min-w-0">
            <StatusTag status={upcomingEvent.status} />
            <p className="display mt-2 truncate text-2xl font-bold sm:text-3xl">
              {upcomingEvent.name.split(": ")[1] ?? upcomingEvent.name}
            </p>
            <p className="text-sm text-ink-dim">{formatEventDate(upcomingEvent.date)}</p>
          </div>
          <span className="flex shrink-0 items-center gap-2 font-display text-base font-bold uppercase tracking-wider text-accent-hot">
            Draft
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        </Link>
      ) : null}

      <div className="grid gap-8 sm:grid-cols-2">
        <section aria-labelledby="members">
          <SectionHeading>
            <span id="members">Members</span>
          </SectionHeading>
          <ul className="divide-y divide-line rounded-sm border border-line bg-surface">
            {members.map((member) => {
              const user = userById.get(member.userId);
              if (!user) return null;
              return (
                <li key={member.userId} className="flex items-center justify-between px-4 py-3">
                  <span className="text-ink">{user.displayName}</span>
                  {member.role === "owner" ? <Badge tone="positive">Owner</Badge> : <Badge>Member</Badge>}
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="rules">
          <SectionHeading>
            <span id="rules">League rules</span>
          </SectionHeading>
          <dl className="divide-y divide-line rounded-sm border border-line bg-surface px-4">
            <StatRow label="Budget per event" value={`${league.budget} cr`} />
            <StatRow label="Max fighters" value={league.maxDraftPicks} />
            <StatRow label="Win" value={`${league.scoringConfig.winPoints} pts`} />
            <StatRow label="Finish call bonus" value={`${league.scoringConfig.finishCallBonus} pts`} />
            <StatRow label="Invite code" value={league.inviteCode} />
          </dl>
        </section>
      </div>
    </div>
  );
}
