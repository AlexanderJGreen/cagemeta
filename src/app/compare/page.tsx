import { Suspense } from "react";
import { getFighterById, getFighters } from "@/lib/data/fighters";
import { formatFighterName, formatRecord } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";

export default function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <PageHeader title="Matchup comparison" subtitle="Pick any two fighters to compare side by side." />
      <Suspense fallback={<p className="text-sm text-ink-dim">Loading fighters…</p>}>
        <CompareForm searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function CompareForm({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const { a, b } = await searchParams;
  const [fighters, fighterA, fighterB] = await Promise.all([
    getFighters(),
    a ? getFighterById(a) : undefined,
    b ? getFighterById(b) : undefined,
  ]);

  return (
    <>
      <form className="grid grid-cols-2 gap-4" action="/compare">
        <FighterSelect name="a" fighters={fighters} selectedId={a} />
        <FighterSelect name="b" fighters={fighters} selectedId={b} />
        <Button type="submit" className="col-span-2">
          Compare
        </Button>
      </form>

      {fighterA && fighterB ? (
        <dl className="mt-8 flex flex-col divide-y divide-line border-y border-line">
          <Row label="Fighter" aValue={formatFighterName(fighterA)} bValue={formatFighterName(fighterB)} />
          <Row label="Record" aValue={formatRecord(fighterA.record)} bValue={formatRecord(fighterB.record)} />
          <Row label="Weight class" aValue={fighterA.weightClass} bValue={fighterB.weightClass} />
          <Row label="Height" aValue={`${fighterA.heightCm} cm`} bValue={`${fighterB.heightCm} cm`} />
          <Row label="Reach" aValue={`${fighterA.reachCm} cm`} bValue={`${fighterB.reachCm} cm`} />
          <Row label="Stance" aValue={fighterA.stance} bValue={fighterB.stance} />
          <Row
            label="Sig. strikes / min"
            aValue={String(fighterA.stats.sigStrikesLandedPerMin)}
            bValue={String(fighterB.stats.sigStrikesLandedPerMin)}
          />
          <Row
            label="Takedown avg / 15 min"
            aValue={String(fighterA.stats.takedownAvgPer15Min)}
            bValue={String(fighterB.stats.takedownAvgPer15Min)}
          />
          <Row label="KO/TKO wins" aValue={String(fighterA.stats.koTkoWins)} bValue={String(fighterB.stats.koTkoWins)} />
          <Row
            label="Submission wins"
            aValue={String(fighterA.stats.submissionWins)}
            bValue={String(fighterB.stats.submissionWins)}
          />
        </dl>
      ) : (
        <p className="mt-8 text-sm text-ink-dim">Choose two fighters above to see a side-by-side breakdown.</p>
      )}
    </>
  );
}

function FighterSelect({
  name,
  fighters,
  selectedId,
}: {
  name: string;
  fighters: Awaited<ReturnType<typeof getFighters>>;
  selectedId?: string;
}) {
  return (
    <select
      name={name}
      defaultValue={selectedId ?? ""}
      className="rounded border border-line bg-surface px-3 py-2 text-sm text-ink"
    >
      <option value="" disabled>
        Select a fighter
      </option>
      {fighters.map((fighter) => (
        <option key={fighter.id} value={fighter.id}>
          {formatFighterName(fighter)}
        </option>
      ))}
    </select>
  );
}

function Row({ label, aValue, bValue }: { label: string; aValue: string; bValue: string }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-2.5">
      <span className="text-right font-mono text-base tabular-nums text-ink">{aValue}</span>
      <span className="text-xs text-ink-dim">{label}</span>
      <span className="font-mono text-base tabular-nums text-ink">{bValue}</span>
    </div>
  );
}
