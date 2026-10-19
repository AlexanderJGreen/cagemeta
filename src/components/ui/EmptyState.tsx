import { Inbox } from "lucide-react";

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center rounded border border-dashed border-line px-6 py-12 text-center">
      <Inbox className="mb-3 h-6 w-6 text-ink-dim" strokeWidth={1.5} />
      <p className="font-display text-lg text-ink">{title}</p>
      <p className="mt-1 text-sm text-ink-dim">{body}</p>
    </div>
  );
}
