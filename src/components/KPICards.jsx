import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const TREND_ICONS = {
  up: <TrendingUp size={14} className="text-emerald-400" />,
  down: <TrendingDown size={14} className="text-red-400" />,
  flat: <Minus size={14} className="text-slate-400" />,
};

const TREND_COLORS = {
  up: "text-emerald-400",
  down: "text-red-400",
  flat: "text-slate-400",
};

function formatTotal(value) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toFixed(0);
}

export default function KPICards({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(stats.kpis)
        .slice(0, 4)
        .map(([col, s]) => (
          <div
            key={col}
            className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 space-y-1"
          >
            <p className="text-slate-400 text-xs uppercase tracking-wider">
              {col.replace(/_/g, " ")}
            </p>
            <p className="text-white text-2xl font-bold font-mono">
              {formatTotal(s.total)}
            </p>
            <div className={`flex items-center gap-1 text-xs ${TREND_COLORS[s.trend]}`}>
              {TREND_ICONS[s.trend]}
              <span>{s.pctChange}% overall</span>
            </div>
          </div>
        ))}
    </div>
  );
}
