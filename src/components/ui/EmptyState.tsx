import { Inbox } from "lucide-react";

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center rounded-sm border border-dashed border-line-strong px-6 py-14 text-center">
      <Inbox className="mb-3 h-6 w-6 text-ink-faint" strokeWidth={1.5} aria-hidden />
      <p className="display text-2xl font-bold">{title}</p>
      <p className="mt-2 max-w-sm text-sm text-ink-dim">{body}</p>
    </div>
  );
}
