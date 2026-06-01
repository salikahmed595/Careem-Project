# The Auto-Analyst — AI-Powered Data Insight Engine

Challenge: Option 2 — The Auto-Analyst
Stack: React + Tailwind CSS + Anthropic Claude API
Dataset: E-commerce Sales Data (self-created demo, also accepts any CSV)

---

## What This Builds

A single-page AI analyst dashboard that:
1. Accepts a CSV dataset or loads the built-in demo data
2. Automatically detects patterns, anomalies, and trends
3. Writes its own narrative insights using the Claude AI API
4. Displays KPI cards, a trend chart, and a full written analysis — all AI-generated

---

## Project Structure

```
auto-analyst/
├── CLAUDE.md
├── README.md
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── .env.example
├── .gitignore
├── requirement.md
├── local.md
├── instruction.md
├── architecture.md
├── api.md
├── deployment.md
└── src/
    ├── main.jsx
    ├── index.css
    ├── App.jsx
    ├── components/
    │   ├── DataUploader.jsx
    │   ├── KPICards.jsx
    │   ├── TrendChart.jsx
    │   ├── InsightPanel.jsx
    │   └── LoadingState.jsx
    ├── hooks/
    │   └── useAutoAnalyst.js
    ├── utils/
    │   ├── csvParser.js
    │   ├── statsEngine.js
    │   └── promptBuilder.js
    └── data/
        └── demo_ecommerce.js
```

---

## Core Logic Flow

```
User uploads CSV (or clicks "Load Demo")
        |
csvParser.js -> raw rows[]
        |
statsEngine.js -> { kpis, trends, anomalies, categoryBreakdown }
        |
promptBuilder.js -> structured prompt string
        |
Claude API (claude-sonnet-4-20250514) -> JSON { headline, insights[], actions[], riskFlags[], sentimentScore }
        |
Render: KPICards + TrendChart + InsightPanel
```

---

## Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "recharts": "^2.10.0",
    "papaparse": "^5.4.1",
    "lucide-react": "^0.383.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## Setup

```bash
npm install
```

Add your Anthropic API key to a `.env` file (copy `.env.example`):

```
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Run the dev server:

```bash
npm run dev
```

---

## Design System

| Token      | Value                             |
|------------|-----------------------------------|
| Background | #020617 (slate-950)               |
| Surface    | #1e293b (slate-800)               |
| Border     | #334155 (slate-700)               |
| Primary    | #6366f1 (indigo-500)              |
| Success    | #10b981 (emerald-500)             |
| Warning    | #f59e0b (amber-500)               |
| Danger     | #ef4444 (red-500)                 |
| Font       | System UI / font-mono for numbers |

---

## Documentation

| File            | Contents                                               |
|-----------------|--------------------------------------------------------|
| requirement.md  | Functional, non-functional, and technical requirements |
| local.md        | Step-by-step local development setup                   |
| instruction.md  | End-user guide for using the application               |
| architecture.md | System design, data flow, and component responsibilities|
| api.md          | Claude API request/response reference                  |
| deployment.md   | Production build and deployment guide                  |
