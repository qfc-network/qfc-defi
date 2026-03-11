import Link from "next/link";

interface PositionCardProps {
  title: string;
  href: string;
  stats: { label: string; value: string }[];
  accentColor?: string;
}

export default function PositionCard({ title, href, stats, accentColor = "cyan" }: PositionCardProps) {
  const borderMap: Record<string, string> = {
    cyan: "border-cyan-500/30 hover:border-cyan-500/50",
    blue: "border-blue-500/30 hover:border-blue-500/50",
    emerald: "border-emerald-500/30 hover:border-emerald-500/50",
    amber: "border-amber-500/30 hover:border-amber-500/50",
    purple: "border-purple-500/30 hover:border-purple-500/50",
  };

  return (
    <Link
      href={href}
      className={`block rounded-xl border bg-gray-900/60 p-5 transition-colors ${borderMap[accentColor] || borderMap.cyan}`}
    >
      <h3 className="mb-3 text-sm font-semibold text-gray-300">{title}</h3>
      <div className="space-y-2">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{s.label}</span>
            <span className="text-sm font-medium text-white">{s.value}</span>
          </div>
        ))}
      </div>
    </Link>
  );
}
