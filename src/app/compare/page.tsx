import { Suspense } from "react";
import { getFighterById, getFighters } from "@/lib/data/fighters";
import { formatRecord } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { FaceOffBar } from "@/components/ui/FaceOffBar";
import { FighterAvatar } from "@/components/ui/FighterAvatar";

type SearchParams = Promise<{ a?: string; b?: string }>;

export default function ComparePage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader title="Matchup" subtitle="Pick any two fighters for a tale of the tape." />
      <Suspense fallback={<p className="text-sm text-ink-dim">Loading fighters…</p>}>
        <CompareForm searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function CompareForm({ searchParams }: { searchParams: SearchParams }) {
  const { a, b } = await searchParams;
  const [fighters, fighterA, fighterB] = await Promise.all([
    getFighters(),
    a ? getFighterById(a) : undefined,
    b ? getFighterById(b) : undefined,
  ]);

  return (
    <>
      <form className="grid grid-cols-2 gap-3" action="/compare">
        <FighterSelect name="a" label="Red corner" fighters={fighters} selectedId={a} />
        <FighterSelect name="b" label="Blue corner" fighters={fighters} selectedId={b} />
        <Button type="submit" className="col-span-2">
          Compare
        </Button>
      </form>

      {fighterA && fighterB ? (
        <section className="rise mt-8" aria-label="Tale of the tape">
          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3 border-b border-line pb-4">
            <Corner fighter={fighterA} align="left" />
            <span className="display pb-1 text-2xl font-extrabold text-ink-faint" aria-hidden>
              vs
            </span>
            <Corner fighter={fighterB} align="right" />
          </div>
          <div className="divide-y divide-line">
            <FaceOffBar
              label="Wins"
              aValue={fighterA.record.wins}
              bValue={fighterB.record.wins}
              aDisplay={formatRecord(fighterA.record)}
              bDisplay={formatRecord(fighterB.record)}
            />
            <FaceOffBar
              label="Height"
              aValue={fighterA.heightCm}
              bValue={fighterB.heightCm}
              aDisplay={`${fighterA.heightCm} cm`}
              bDisplay={`${fighterB.heightCm} cm`}
            />
            <FaceOffBar
              label="Reach"
              aValue={fighterA.reachCm}
              bValue={fighterB.reachCm}
              aDisplay={`${fighterA.reachCm} cm`}
              bDisplay={`${fighterB.reachCm} cm`}
            />
            <FaceOffBar
              label="Strikes / min"
              aValue={fighterA.stats.sigStrikesLandedPerMin}
              bValue={fighterB.stats.sigStrikesLandedPerMin}
            />
            <FaceOffBar
              label="Strike accuracy"
              aValue={fighterA.stats.sigStrikeAccuracyPct}
              bValue={fighterB.stats.sigStrikeAccuracyPct}
              aDisplay={`${fighterA.stats.sigStrikeAccuracyPct}%`}
              bDisplay={`${fighterB.stats.sigStrikeAccuracyPct}%`}
            />
            <FaceOffBar
              label="Takedowns / 15"
              aValue={fighterA.stats.takedownAvgPer15Min}
              bValue={fighterB.stats.takedownAvgPer15Min}
            />
            <FaceOffBar label="KO/TKO wins" aValue={fighterA.stats.koTkoWins} bValue={fighterB.stats.koTkoWins} />
            <FaceOffBar
              label="Submission wins"
              aValue={fighterA.stats.submissionWins}
              bValue={fighterB.stats.submissionWins}
            />
          </div>
          <dl className="mt-4 grid grid-cols-[1fr_auto_1fr] gap-x-3 border-t border-line pt-3 text-sm text-ink-dim">
            <dd>{fighterA.stance}</dd>
            <dt className="caption text-center">Stance</dt>
            <dd className="text-right">{fighterB.stance}</dd>
            <dd>{fighterA.weightClass}</dd>
            <dt className="caption text-center">Class</dt>
            <dd className="text-right">{fighterB.weightClass}</dd>
          </dl>
        </section>
      ) : (
        <p className="mt-8 rounded-sm border border-dashed border-line-strong px-4 py-10 text-center text-sm text-ink-dim">
          Choose two fighters to put them side by side.
        </p>
      )}
    </>
  );
}

function Corner({
  fighter,
  align,
}: {
  fighter: NonNullable<Awaited<ReturnType<typeof getFighterById>>>;
  align: "left" | "right";
}) {
  const right = align === "right";
  return (
    <div className={`flex flex-col gap-1 ${right ? "items-end text-right" : "items-start"}`}>
      <FighterAvatar fighter={fighter} size="md" tone={right ? "neutral" : "accent"} />
      <span className="caption mt-1 normal-case tracking-normal">{fighter.firstName}</span>
      <span className="display -mt-1 text-4xl font-extrabold sm:text-5xl">{fighter.lastName}</span>
    </div>
  );
}

function FighterSelect({
  name,
  label,
  fighters,
  selectedId,
}: {
  name: string;
  label: string;
  fighters: Awaited<ReturnType<typeof getFighters>>;
  selectedId?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="caption">{label}</span>
      <select
        name={name}
        defaultValue={selectedId ?? ""}
        className="min-h-11 w-full rounded-sm border border-line-strong bg-surface px-3 text-sm text-ink transition-colors hover:border-ink-dim"
      >
        <option value="" disabled>
          Select a fighter
        </option>
        {fighters.map((fighter) => (
          <option key={fighter.id} value={fighter.id}>
            {fighter.firstName} {fighter.lastName}
          </option>
        ))}
      </select>
    </label>
  );
}
