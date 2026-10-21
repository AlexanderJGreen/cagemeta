export function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <dt className="text-sm text-ink-dim">{label}</dt>
      <dd className="num text-base text-ink">{value}</dd>
    </div>
  );
}
