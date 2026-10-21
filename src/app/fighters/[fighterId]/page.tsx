import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getFighterById } from "@/lib/data/fighters";
import { formatRecord } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { FighterAvatar } from "@/components/ui/FighterAvatar";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatRow } from "@/components/ui/StatRow";

export default async function FighterProfilePage({
  params,
}: {
  params: Promise<{ fighterId: string }>;
}) {
  const { fighterId } = await params;
  const fighter = await getFighterById(fighterId);
  if (!fighter) notFound();

  const { koTkoWins, submissionWins, decisionWins } = fighter.stats;
  const totalWins = Math.max(koTkoWins + submissionWins + decisionWins, 1);
  const methods = [
    { label: "KO/TKO", value: koTkoWins, bar: "bg-accent" },
    { label: "Submission", value: submissionWins, bar: "bg-positive" },
    { label: "Decision", value: decisionWins, bar: "bg-line-strong" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="rise flex items-start gap-4 border-b border-line pb-6 sm:gap-6">
        <FighterAvatar fighter={fighter} size="lg" />
        <div className="min-w-0">
          <Badge>{fighter.weightClass}</Badge>
          <h1 className="display mt-2 text-5xl font-extrabold sm:text-6xl">
            <span className="block text-2xl font-semibold text-ink-dim sm:text-3xl">
              {fighter.firstName}
            </span>
            {fighter.lastName}
          </h1>
          {fighter.nickname ? (
            <p className="mt-1 text-sm italic text-ink-dim">&ldquo;{fighter.nickname}&rdquo;</p>
          ) : null}
        </div>
      </header>

      <div className="flex items-baseline justify-between border-b border-line py-4">
        <span className="caption">Record</span>
        <span className="num text-3xl text-positive">{formatRecord(fighter.record)}</span>
      </div>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-b border-line py-5 sm:grid-cols-5">
        <MetaItem label="Age" value={String(fighter.age)} />
        <MetaItem label="Country" value={fighter.country} />
        <MetaItem label="Stance" value={fighter.stance} />
        <MetaItem label="Height" value={`${fighter.heightCm} cm`} />
        <MetaItem label="Reach" value={`${fighter.reachCm} cm`} />
      </dl>

      <section className="mt-8" aria-labelledby="how-wins">
        <SectionHeading aside={<span className="num">{totalWins} wins</span>}>
          <span id="how-wins">Win methods</span>
        </SectionHeading>
        <div className="flex h-2 gap-px bg-canvas" role="img" aria-label="Win method breakdown">
          {methods.map((m) =>
            m.value > 0 ? (
              <div key={m.label} className={m.bar} style={{ width: `${(m.value / totalWins) * 100}%` }} />
            ) : null,
          )}
        </div>
        <ul className="mt-3 grid grid-cols-3 gap-3">
          {methods.map((m) => (
            <li key={m.label}>
              <p className="num text-2xl">{m.value}</p>
              <p className="caption flex items-center gap-1.5">
                <span aria-hidden className={`h-2 w-2 ${m.bar}`} />
                {m.label}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8" aria-labelledby="fight-stats">
        <SectionHeading>
          <span id="fight-stats">Fight stats</span>
        </SectionHeading>
        <dl className="divide-y divide-line border-y border-line">
          <StatRow label="Significant strikes landed / min" value={fighter.stats.sigStrikesLandedPerMin} />
          <StatRow label="Significant strike accuracy" value={`${fighter.stats.sigStrikeAccuracyPct}%`} />
          <StatRow label="Takedown average / 15 min" value={fighter.stats.takedownAvgPer15Min} />
          <StatRow label="Takedown accuracy" value={`${fighter.stats.takedownAccuracyPct}%`} />
        </dl>
      </section>

      <div className="mt-8">
        <Link
          href={`/compare?a=${fighter.id}`}
          className="inline-flex min-h-11 items-center gap-2 font-display text-base font-bold uppercase tracking-wider text-ink-dim transition-colors hover:text-accent-hot"
        >
          Compare to another fighter
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="caption">{label}</dt>
      <dd className="num mt-0.5 text-base text-ink">{value}</dd>
    </div>
  );
}
