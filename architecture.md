# Architecture — The Auto-Analyst

## Overview

The Auto-Analyst is a fully client-side React application. All data processing runs in the browser. The only external dependency at runtime is the Anthropic Claude API, which is called once per analysis to generate the insight report.

There is no backend server, no database, and no user accounts. The application is a static bundle that can be served from any CDN or static hosting provider.

---

## System Diagram

```
Browser
│
├── User uploads CSV or clicks "Load Demo"
│
├── csvParser.js
│   └── PapaParse library parses the file into an array of row objects
│
├── statsEngine.js
│   └── Computes KPIs, trends, anomalies, and category breakdowns
│       from the row array — no network requests
│
├── promptBuilder.js
│   └── Converts computed stats into a structured plain-text prompt
│
├── fetch() → Anthropic Claude API
│   └── Sends the prompt, receives a JSON insight report
│
└── React components render the result
    ├── KPICards     — numeric summaries per column
    ├── TrendChart   — Recharts line chart
    └── InsightPanel — AI-written narrative
```

---

## Data Flow

### 1. Input

The user provides data in one of two ways:

- **CSV upload**: The browser reads the file using PapaParse, which parses it into `Array<Object>` where each object represents a row and keys are the column headers.
- **Demo data**: A static JavaScript array exported from `src/data/demo_ecommerce.js` is loaded directly — no file I/O.

Both paths produce the same data structure: `rows: Array<Record<string, string>>`.

### 2. Statistical Processing

`statsEngine.js` processes the row array and returns a `stats` object with this shape:

```js
{
  rowCount: number,
  numericCols: string[],
  kpis: {
    [colName]: {
      total: number,
      avg: number,
      min: number,
      max: number,
      trend: "up" | "down" | "flat",
      pctChange: string   // e.g. "44.5"
    }
  },
  anomalies: Array<{
    row: number,
    col: string,
    value: number,
    zscore: string
  }>,
  categoryBreakdown: {
    [categoryName]: {
      count: number,
      [colName]: number
    }
  }
}
```

This object is stored in React state and used both to render the UI directly (KPI cards, chart) and to build the AI prompt.

### 3. Prompt Construction

`promptBuilder.js` converts the `stats` object into a plain-text prompt string. The prompt instructs Claude to act as a senior business analyst and specifies the exact JSON format required in the response. Sending structured statistics rather than raw data keeps the prompt compact and keeps raw user data private.

### 4. Claude API Call

A single `fetch` POST request is made to `https://api.anthropic.com/v1/messages`. The request body specifies the model, a token limit, and the prompt as the user message. The response is parsed and the `content[].text` fields are joined and parsed as JSON.

The Claude API call is the only operation that is not instantaneous. All other processing is synchronous and completes in milliseconds.

### 5. Rendering

React re-renders the UI as state changes through three phases:

- `status === "idle"` — shows the upload area
- `status === "analyzing"` — shows the loading indicator
- `status === "done"` — shows KPI cards, chart, and insight panel

---

## File Responsibilities

| File | Responsibility |
|---|---|
| `src/App.jsx` | Root component. Owns top-level state (`rows`, `datasetName`). Renders layout and routes to the correct view based on `status`. |
| `src/hooks/useAutoAnalyst.js` | Owns analysis state (`status`, `stats`, `aiResult`, `error`). Orchestrates the full pipeline: stats computation, prompt building, API call, and JSON parsing. |
| `src/utils/csvParser.js` | Thin wrapper around PapaParse. Returns a promise that resolves to the parsed row array. |
| `src/utils/statsEngine.js` | Pure function. Takes the row array, returns the stats object. No side effects. |
| `src/utils/promptBuilder.js` | Pure function. Takes stats and a dataset name, returns the prompt string. No side effects. |
| `src/data/demo_ecommerce.js` | Static data only. Exports `DEMO_DATA` (row array) and `DEMO_META` (name and column list). |
| `src/components/DataUploader.jsx` | Handles file input and demo-load button. Calls `onData(rows, name)` when data is ready. |
| `src/components/KPICards.jsx` | Renders up to four metric cards from the `stats.kpis` object. |
| `src/components/TrendChart.jsx` | Transforms the row array into Recharts-compatible data and renders a line chart. |
| `src/components/InsightPanel.jsx` | Renders the structured AI response: headline, health score, insights, actions, and risk flags. |
| `src/components/LoadingState.jsx` | Renders a spinner and step labels during the analysis phase. |

---

## State Management

There is no global state library. All state lives in two locations:

- `useAutoAnalyst` hook: analysis state (`status`, `stats`, `aiResult`, `error`) and the `analyze` and `reset` functions.
- `App.jsx`: input state (`rows`, `datasetName`).

Props flow downward from `App.jsx` to each component. No component communicates with another directly.

---

## Design Decisions

**Why process stats locally instead of sending the CSV to the AI?**

Sending raw CSV rows to an LLM would be slow and expensive for large files, and it would expose raw user data to a third party. Computing statistics locally keeps the API payload small (under 1KB for typical datasets) and limits what leaves the browser to aggregate summaries only.

**Why no backend?**

For a prototype and demonstration tool, a backend adds deployment complexity with no functional benefit. The tradeoff is that the API key must be handled carefully in local development and must never ship in a client-side bundle in production.

**Why PapaParse over native CSV parsing?**

PapaParse handles edge cases correctly: quoted fields with embedded commas, multi-line values, inconsistent line endings, and BOM characters. Writing a reliable CSV parser from scratch is non-trivial.

**Why Recharts over other charting libraries?**

Recharts is React-native, uses declarative JSX, and requires minimal configuration for standard chart types. It is the lowest-friction option for this use case.

---

## Extension Points

If this project grows beyond a prototype, the most important architectural changes would be:

1. **Backend proxy for the API key** — Move the Claude API call to a server-side function (Next.js API route, Express endpoint, or serverless function) so the key is never in the client bundle.
2. **Streaming responses** — Use the Claude streaming API to display insight text as it generates, reducing perceived latency.
3. **Chart type selection** — Allow the user to switch between line, bar, and scatter charts. `TrendChart.jsx` is the only file that would need to change.
4. **Export** — Add a "Download Report" button that serialises the AI result to PDF or Markdown using a library like `jsPDF`.
