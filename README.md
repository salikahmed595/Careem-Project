# The Auto-Analyst

An AI-powered data insight engine. Upload any CSV and get instant KPI cards, a trend chart, and a written business analysis — powered by Claude.

---

## Quick Start

**Requirements:** Node.js 18+, an [Anthropic API key](https://console.anthropic.com)

```bash
# 1. Install dependencies
npm install

# 2. Add your API key
cp .env.example .env
# Edit .env and set VITE_ANTHROPIC_API_KEY=sk-ant-...

# 3. Run
npm run dev
```

Open `http://localhost:5173` and click "Try Demo Data" to see it in action. No CSV upload required.

---

## How It Works

1. You upload a CSV (or use the built-in demo)
2. The app computes statistics: totals, averages, trends, anomalies
3. Those stats are sent to the Claude API
4. Claude writes a structured insight report
5. The report renders as KPI cards, a chart, and a written analysis

---

## What You Get

- **KPI Cards** — total, trend direction, and percentage change per numeric column
- **Trend Chart** — line chart over time (or row index)
- **Insight Panel** — AI-written headline, key findings, recommended actions, risk flags, and a 0-100 business health score

---

## CSV Format

Any `.csv` with a header row and at least one numeric column works. A column named `date` is used as the chart x-axis. No specific schema required.

---

## Documentation

| File | Contents |
|---|---|
| [requirement.md](requirement.md) | What the system must do |
| [local.md](local.md) | Full local setup guide |
| [instruction.md](instruction.md) | How to use the application |
| [architecture.md](architecture.md) | System design and data flow |
| [api.md](api.md) | Claude API integration reference |
| [deployment.md](deployment.md) | How to deploy to production |

---

## Stack

React 18, Vite 5, Tailwind CSS 3, Recharts, PapaParse, Anthropic Claude API

---

## Security Note

`VITE_ANTHROPIC_API_KEY` is embedded in the client bundle. This is acceptable for local development and controlled demos. For any public deployment, route the API call through a server-side function. See [deployment.md](deployment.md) for details.
