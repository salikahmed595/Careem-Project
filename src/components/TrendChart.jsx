import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f59e0b"];

export default function TrendChart({ rows }) {
  if (!rows || rows.length === 0) return null;

  const hasDate = "date" in rows[0];

  const chartData = rows.map((row, i) => {
    const entry = { label: hasDate ? row.date : `Row ${i + 1}` };
    Object.entries(row).forEach(([k, v]) => {
      if (k !== "date" && !isNaN(parseFloat(v))) {
        entry[k] = parseFloat(v);
      }
    });
    return entry;
  });

  const numericKeys = Object.keys(chartData[0])
    .filter((k) => k !== "label")
    .slice(0, 3);

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
      <h3 className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-4">
        Trend Overview
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              background: "#1e293b",
              border: "1px solid #475569",
              borderRadius: 8,
              color: "#f1f5f9",
            }}
          />
          <Legend />
          {numericKeys.map((key, i) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={COLORS[i]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
