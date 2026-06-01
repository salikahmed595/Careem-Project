import { Lightbulb, Zap, AlertTriangle, Activity } from "lucide-react";

export default function InsightPanel({ aiResult }) {
  if (!aiResult) return null;

  const { headline, insights, actions, riskFlags, sentimentScore } = aiResult;

  const scoreColor =
    sentimentScore >= 70
      ? "text-emerald-400"
      : sentimentScore >= 40
      ? "text-amber-400"
      : "text-red-400";

  return (
    <div className="space-y-4">
      <div className="bg-indigo-900/30 border border-indigo-700 rounded-2xl p-5 flex items-start gap-4">
        <Activity size={20} className="text-indigo-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-white font-semibold text-base leading-snug">{headline}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-slate-400 text-xs">Health Score</p>
          <p className={`text-2xl font-bold font-mono ${scoreColor}`}>{sentimentScore}</p>
        </div>
      </div>

      <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
        <h3 className="text-slate-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 mb-3">
          <Lightbulb size={14} className="text-yellow-400" />
          Key Insights
        </h3>
        <ul className="space-y-2">
          {insights.map((ins, i) => (
            <li key={i} className="text-slate-300 text-sm flex gap-2">
              <span className="text-indigo-400 font-bold mt-0.5 flex-shrink-0">&#8594;</span>
              {ins}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
        <h3 className="text-slate-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 mb-3">
          <Zap size={14} className="text-emerald-400" />
          Recommended Actions
        </h3>
        <ul className="space-y-2">
          {actions.map((act, i) => (
            <li key={i} className="text-slate-300 text-sm flex gap-2">
              <span className="text-emerald-400 font-bold mt-0.5 flex-shrink-0">{i + 1}.</span>
              {act}
            </li>
          ))}
        </ul>
      </div>

      {riskFlags && riskFlags.length > 0 && (
        <div className="bg-red-900/20 border border-red-800 rounded-2xl p-5">
          <h3 className="text-slate-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 mb-3">
            <AlertTriangle size={14} className="text-red-400" />
            Risk Flags
          </h3>
          <ul className="space-y-1">
            {riskFlags.map((r, i) => (
              <li key={i} className="text-red-300 text-sm flex gap-2">
                <span className="flex-shrink-0">!</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
