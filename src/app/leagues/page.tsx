import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CreateLeagueForm } from "@/components/features/leagues/CreateLeagueForm";
import { JoinLeagueForm } from "@/components/features/leagues/JoinLeagueForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { requireUser } from "@/lib/auth/session";
import { getLeaguesForUser } from "@/lib/data/leagues";

export const metadata = { title: "Leagues · CAGEMETA" };

export default async function LeaguesPage() {
  const user = await requireUser("/leagues");
  const leagues = await getLeaguesForUser(user.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader title="Leagues" subtitle="Private leagues, free to create. Share the invite code to bring friends in." />

      {leagues.length > 0 ? (
        <section aria-labelledby="your-leagues" className="mb-10">
          <SectionHeading>
            <span id="your-leagues">Your leagues</span>
          </SectionHeading>
          <ul className="divide-y divide-line rounded-sm border border-line bg-surface">
            {leagues.map((league) => (
              <li key={league.id}>
                <Link
                  href={`/leagues/${league.id}`}
                  className="group flex items-center justify-between px-4 py-3 transition-colors hover:bg-surface-raised"
                >
                  <span className="text-ink">{league.name}</span>
                  <ArrowRight className="h-4 w-4 text-ink-faint transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="grid gap-8 sm:grid-cols-2">
        <section aria-labelledby="create-league">
          <SectionHeading>
            <span id="create-league">Create a league</span>
          </SectionHeading>
          <CreateLeagueForm />
        </section>
        <section aria-labelledby="join-league">
          <SectionHeading>
            <span id="join-league">Join with a code</span>
          </SectionHeading>
          <JoinLeagueForm />
        </section>
      </div>
    </div>
  );
}
