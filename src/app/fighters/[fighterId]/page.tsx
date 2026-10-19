import Link from "next/link";
import { notFound } from "next/navigation";
import { getFighterById } from "@/lib/data/fighters";
import { formatFighterName, formatRecord } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { FighterAvatar } from "@/components/ui/FighterAvatar";
import { StatRow } from "@/components/ui/StatRow";

export default async function FighterProfilePage({
  params,
}: {
  params: Promise<{ fighterId: string }>;
}) {
  const { fighterId } = await params;
  const fighter = await getFighterById(fighterId);
  if (!fighter) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="flex items-center gap-4 border-b border-line pb-6">
        <FighterAvatar fighter={fighter} size="lg" />
        <div>
          <Badge>{fighter.weightClass}</Badge>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ink">
            {formatFighterName(fighter)}
          </h1>
          {fighter.nickname ? (
            <p className="text-ink-dim">&ldquo;{fighter.nickname}&rdquo;</p>
          ) : null}
          <p className="mt-2 font-mono text-2xl font-medium tabular-nums text-positive">
            {formatRecord(fighter.record)}
          </p>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
        <MetaItem label="Age" value={String(fighter.age)} />
        <MetaItem label="Country" value={fighter.country} />
        <MetaItem label="Stance" value={fighter.stance} />
        <MetaItem label="Height" value={`${fighter.heightCm} cm`} />
        <MetaItem label="Reach" value={`${fighter.reachCm} cm`} />
      </dl>

      <section className="mt-8">
        <h2 className="font-display text-xl font-medium text-ink">Fight stats</h2>
        <dl className="mt-4 flex flex-col divide-y divide-line border-y border-line">
          <StatRow label="Significant strikes landed / min" value={fighter.stats.sigStrikesLandedPerMin} />
          <StatRow label="Significant strike accuracy" value={`${fighter.stats.sigStrikeAccuracyPct}%`} />
          <StatRow label="Takedown average / 15 min" value={fighter.stats.takedownAvgPer15Min} />
          <StatRow label="Takedown accuracy" value={`${fighter.stats.takedownAccuracyPct}%`} />
          <StatRow label="Wins by KO/TKO" value={fighter.stats.koTkoWins} />
          <StatRow label="Wins by submission" value={fighter.stats.submissionWins} />
          <StatRow label="Wins by decision" value={fighter.stats.decisionWins} />
        </dl>
      </section>

      <div className="mt-6">
        <Link
          href={`/compare?a=${fighter.id}`}
          className="text-sm text-ink-dim underline-offset-4 hover:text-ink hover:underline"
        >
          Compare this fighter to another
        </Link>
      </div>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-ink-dim">{label}</dt>
      <dd className="font-display text-base text-ink">{value}</dd>
    </div>
  );
}
