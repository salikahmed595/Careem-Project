export function buildPrompt(stats, datasetName = "Uploaded Dataset") {
  const { kpis, anomalies, categoryBreakdown, rowCount } = stats;

  const kpiSummary = Object.entries(kpis)
    .map(
      ([col, s]) =>
        `- ${col}: total=${s.total.toFixed(0)}, avg=${s.avg.toFixed(1)}, trend=${s.trend}, pct_change=${s.pctChange}%`
    )
    .join("\n");

  const anomalySummary =
    anomalies.length > 0
      ? anomalies
          .map(
            (a) =>
              `- Row ${a.row}, column "${a.col}": value ${a.value} (z-score ${a.zscore})`
          )
          .join("\n")
      : "No significant anomalies detected.";

  const catSummary = Object.entries(categoryBreakdown)
    .map(
      ([cat, vals]) =>
        `- ${cat}: ${Object.entries(vals)
          .map(([k, v]) => `${k}=${typeof v === "number" ? v.toFixed(0) : v}`)
          .join(", ")}`
    )
    .join("\n");

  return `You are a senior business data analyst. Analyze the following dataset statistics and write a professional insight report.

DATASET: ${datasetName}
ROWS: ${rowCount}

KPI SUMMARY:
${kpiSummary}

ANOMALIES:
${anomalySummary}

CATEGORY BREAKDOWN:
${catSummary || "No categorical breakdown available."}

Respond ONLY with a valid JSON object (no markdown, no backticks) in this exact format:
{
  "headline": "One punchy sentence summarizing the most important finding",
  "insights": [
    "Insight 1 — specific, data-backed observation with numbers",
    "Insight 2 — a trend or pattern worth noting",
    "Insight 3 — an anomaly or risk signal"
  ],
  "actions": [
    "Recommended action 1 — concrete and specific",
    "Recommended action 2 — based on trends",
    "Recommended action 3 — risk mitigation"
  ],
  "riskFlags": [
    "Risk 1 — short warning"
  ],
  "sentimentScore": 72
}

sentimentScore is an integer 0-100 representing overall business health based on the data (0=critical, 100=excellent).`;
}
