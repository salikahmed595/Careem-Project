export function computeStats(rows) {
  if (!rows || rows.length === 0) return null;

  const numericCols = Object.keys(rows[0]).filter(
    (k) => k !== "date" && !isNaN(parseFloat(rows[0][k]))
  );

  const kpis = {};
  for (const col of numericCols) {
    const values = rows.map((r) => parseFloat(r[col])).filter((v) => !isNaN(v));
    kpis[col] = {
      total: values.reduce((a, b) => a + b, 0),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      trend: computeTrend(values),
      pctChange: computePctChange(values),
    };
  }

  const anomalies = [];
  for (const col of numericCols) {
    const values = rows.map((r) => parseFloat(r[col])).filter((v) => !isNaN(v));
    const mean = kpis[col].avg;
    const std = Math.sqrt(
      values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
    );
    rows.forEach((row, i) => {
      const val = parseFloat(row[col]);
      if (!isNaN(val) && std > 0 && Math.abs(val - mean) > 2 * std) {
        anomalies.push({
          row: i + 1,
          col,
          value: val,
          zscore: ((val - mean) / std).toFixed(2),
        });
      }
    });
  }

  const textCols = Object.keys(rows[0]).filter(
    (k) => k !== "date" && isNaN(parseFloat(rows[0][k]))
  );
  const categoryBreakdown = {};
  if (textCols.length > 0) {
    const catCol = textCols[0];
    rows.forEach((row) => {
      const cat = row[catCol] || "Unknown";
      if (!categoryBreakdown[cat]) categoryBreakdown[cat] = { count: 0 };
      categoryBreakdown[cat].count++;
      for (const col of numericCols) {
        if (!categoryBreakdown[cat][col]) categoryBreakdown[cat][col] = 0;
        categoryBreakdown[cat][col] += parseFloat(row[col]) || 0;
      }
    });
  }

  return { kpis, anomalies, categoryBreakdown, rowCount: rows.length, numericCols };
}

function computeTrend(values) {
  if (values.length < 2) return "flat";
  const mid = Math.floor(values.length / 2);
  const first = values.slice(0, mid);
  const last = values.slice(mid);
  const avgFirst = first.reduce((a, b) => a + b, 0) / first.length;
  const avgLast = last.reduce((a, b) => a + b, 0) / last.length;
  if (avgLast > avgFirst * 1.05) return "up";
  if (avgLast < avgFirst * 0.95) return "down";
  return "flat";
}

function computePctChange(values) {
  if (values.length < 2 || values[0] === 0) return "0.0";
  return (((values[values.length - 1] - values[0]) / values[0]) * 100).toFixed(1);
}
