interface HealthBarProps {
  healthFactor: number;
  showLabel?: boolean;
}

export default function HealthBar({ healthFactor, showLabel = true }: HealthBarProps) {
  const clamped = Math.min(Math.max(healthFactor, 0), 3);
  const pct = Math.min((clamped / 3) * 100, 100);

  let color = "bg-emerald-500";
  let textColor = "text-emerald-400";
  let label = "Safe";
  if (healthFactor < 1.2) {
    color = "bg-rose-500";
    textColor = "text-rose-400";
    label = "Danger";
  } else if (healthFactor < 1.5) {
    color = "bg-amber-500";
    textColor = "text-amber-400";
    label = "Caution";
  }

  return (
    <div>
      {showLabel && (
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="text-gray-400">Health Factor</span>
          <span className={`font-semibold ${textColor}`}>
            {healthFactor.toFixed(2)} — {label}
          </span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-gray-800">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
