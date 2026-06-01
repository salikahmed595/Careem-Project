# Requirements — The Auto-Analyst

## Overview

The Auto-Analyst is a single-page web application that accepts tabular data (CSV), computes statistical summaries locally, and uses the Claude AI API to generate a written business insight report. The output includes KPI cards, a trend chart, and a structured narrative with findings, recommendations, and risk flags.

---

## Functional Requirements

### Data Input

- The application must accept CSV file uploads from the user's local machine.
- The application must include a built-in demo dataset so the tool works without any file upload.
- Accepted file format: `.csv` only.
- CSV files must have a header row. All subsequent rows are treated as data.
- If a column contains numeric values, it is treated as a metric. If it contains text, it is treated as a dimension (category).

### Statistical Processing

- For each numeric column, the application must compute:
  - Total (sum)
  - Average
  - Minimum value
  - Maximum value
  - Overall trend direction: "up", "down", or "flat"
  - Percentage change from first value to last value
- The application must detect anomalies: any value more than two standard deviations from the column mean is flagged, along with its row number and z-score.
- If a text (categorical) column exists, the application must compute a breakdown of row counts and metric totals per category.

### AI Analysis

- The application must send computed statistics to the Claude API (model: `claude-sonnet-4-20250514`).
- The prompt must instruct the model to respond in a specific JSON format only — no markdown or extra text.
- The expected JSON response must include:
  - `headline`: one summary sentence describing the most important finding
  - `insights`: an array of at least three data-backed observations
  - `actions`: an array of at least three concrete recommended actions
  - `riskFlags`: an array of warnings or risks identified in the data
  - `sentimentScore`: an integer from 0 to 100 representing overall business health
- The application must parse the JSON response and render each field in the UI.
- If the API returns an error or the JSON cannot be parsed, the application must show a clear error message.

### User Interface

- The application must display an upload area when no data has been loaded.
- While the API call is in progress, the application must show a loading indicator with step labels.
- Once analysis is complete, the application must display:
  - KPI cards (up to four numeric columns, each showing total, trend icon, and percentage change)
  - A line chart showing numeric columns over time or row index
  - An insight panel showing headline, health score, insights, recommended actions, and risk flags
- The user must be able to reset the application and run a new analysis without refreshing the page.

---

## Non-Functional Requirements

### Performance

- Statistical computation must complete in under one second for datasets up to 10,000 rows.
- The UI must remain responsive during the API call (non-blocking, async).

### Compatibility

- The application must run in modern browsers: Chrome 110+, Firefox 110+, Edge 110+, Safari 16+.
- The application must be usable on screens 768px wide and above.

### Security

- The Claude API key must never be exposed in client-side code in a production deployment.
- For local development only, the API key may be stored in a `.env` file that is excluded from version control.

### Reliability

- API errors must be caught and shown to the user. The application must not crash on a failed API call.
- Malformed or empty CSV files must be handled gracefully with a user-facing error message.

---

## Technical Requirements

### Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| CSV Parsing | PapaParse 5 |
| Charting | Recharts 2 |
| Icons | Lucide React |
| AI API | Anthropic Claude API |

### Node Version

Node.js 18 or higher is required.

### Environment Variables

| Variable | Description | Required |
|---|---|---|
| `VITE_ANTHROPIC_API_KEY` | Your Anthropic API key | Yes |

### Browser API Usage

- `FileReader` API for CSV file handling
- `fetch` API for Claude API calls (no additional HTTP library required)

---

## Data Requirements

### Demo Dataset

The built-in demo dataset must represent at least six months of e-commerce sales data with the following columns:

| Column | Type | Description |
|---|---|---|
| `date` | String | Month label (e.g., "2024-01") |
| `revenue` | Number | Total revenue in that period |
| `orders` | Number | Total number of orders |
| `avg_order_value` | Number | Average value per order |
| `returns` | Number | Number of returned orders |
| `category` | String | Product category name |

### User-Uploaded Dataset

- Any CSV with at least one numeric column will produce a valid analysis.
- Datasets with a column named `date` will use it as the x-axis label in the chart.
- Datasets without a `date` column will label chart points by row number.

---

## Out of Scope

The following are explicitly not part of this project:

- User authentication or accounts
- Server-side data storage or databases
- Export of analysis results (PDF, Excel)
- Real-time data streams
- Multi-file uploads or merging datasets
- Mobile-first or native app packaging
