import { getEvents } from "@/lib/data/events";
import { EventCard } from "@/components/features/events/EventCard";
import { PageHeader } from "@/components/ui/PageHeader";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <PageHeader title="Events" subtitle="Every card on the schedule, past and upcoming." />
      <div className="grid gap-4 sm:grid-cols-2">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
