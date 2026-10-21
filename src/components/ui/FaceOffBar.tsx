/**
 * Tale-of-the-tape row: two values facing off over proportional bars.
 * The leading side's bar takes lime; ties and non-comparable rows stay neutral.
 */
export function FaceOffBar({
  label,
  aValue,
  bValue,
  aDisplay,
  bDisplay,
}: {
  label: string;
  aValue: number;
  bValue: number;
  aDisplay?: string;
  bDisplay?: string;
}) {
  const max = Math.max(aValue, bValue, 0.0001);
  const aLeads = aValue > bValue;
  const bLeads = bValue > aValue;
  return (
    <div className="py-3">
      <div className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-3">
        <span className={`num text-right text-lg ${aLeads ? "text-positive" : "text-ink"}`}>
          {aDisplay ?? aValue}
        </span>
        <span className="caption text-center">{label}</span>
        <span className={`num text-lg ${bLeads ? "text-positive" : "text-ink"}`}>
          {bDisplay ?? bValue}
        </span>
      </div>
      <div className="mt-1.5 grid grid-cols-2 gap-1" aria-hidden>
        <div className="flex justify-end bg-surface-raised">
          <div
            className={`h-1 ${aLeads ? "bg-positive" : "bg-line-strong"}`}
            style={{ width: `${(aValue / max) * 100}%` }}
          />
        </div>
        <div className="bg-surface-raised">
          <div
            className={`h-1 ${bLeads ? "bg-positive" : "bg-line-strong"}`}
            style={{ width: `${(bValue / max) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
