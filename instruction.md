# User Instructions — The Auto-Analyst

The Auto-Analyst takes a CSV data file, runs statistical analysis on it, and uses AI to write a business insight report. This document explains how to use it.

---

## Getting Started

When you open the application, you will see a data input area in the center of the page. There are two ways to begin:

**Option A — Upload your own CSV file**

Click the "Upload CSV" button and select a `.csv` file from your computer. The file must have a header row (column names in the first row). Any CSV with at least one column containing numbers will work.

**Option B — Use the built-in demo data**

Click "Try Demo Data" to load a pre-built dataset of fictional e-commerce sales across two product categories over six months. This is a good way to see what the tool does before using your own data.

Once data is loaded, the analysis starts automatically. You do not need to click anything else.

---

## What Happens During Analysis

The tool runs in three stages:

1. **Parsing** — your CSV is read and converted into rows of data in the browser. Nothing is sent to any server at this stage.
2. **Computing statistics** — the tool calculates totals, averages, trends, and anomalies for each numeric column.
3. **AI analysis** — the computed statistics are sent to the Claude AI API, which writes the insight report. This is the only step that makes a network request.

A loading indicator shows the current stage. The full process typically takes five to fifteen seconds, depending on your internet connection and the Claude API response time.

---

## Reading the Results

After analysis completes, the page displays three sections.

### KPI Cards

Up to four numeric columns from your dataset are shown as metric cards. Each card shows:

- The column name
- The total value across all rows (displayed in thousands with a "K" suffix if the number is large)
- A trend indicator (rising, falling, or flat) based on comparing the first half of the data to the second half
- The percentage change from the first data point to the last

### Trend Chart

A line chart plots up to three numeric columns over time. If your CSV has a column named `date`, it is used as the x-axis label. Otherwise, rows are numbered sequentially.

Hover over any point on the chart to see the exact values for that data point.

### Insight Panel

The insight panel contains the AI-generated report. It has four parts:

**Headline and Health Score**

A one-sentence summary of the most important finding in your data. The health score (0 to 100) reflects the overall condition of the business or dataset based on the data patterns. Higher is better.

| Score Range | Meaning |
|---|---|
| 70 to 100 | Healthy — displayed in green |
| 40 to 69 | Moderate — displayed in amber |
| 0 to 39 | Critical — displayed in red |

**Key Insights**

Three or more specific, data-backed observations. Each insight references actual numbers from your dataset.

**Recommended Actions**

Three or more concrete actions based on the findings. These are practical suggestions, not generic advice.

**Risk Flags**

One or more warnings about patterns in the data that could indicate a problem. This section only appears if risks are detected.

---

## Uploading Your Own Data

### What format does the CSV need to be in?

Your file must:
- Be a plain text `.csv` file
- Have column names in the first row
- Use commas as the delimiter

Your file does not need:
- A specific set of columns
- A date column (it helps with chart labels, but is not required)
- A specific number of rows (files with 10 to 10,000 rows work best)

### What types of data work well?

The tool is designed for business and operational datasets where you want to understand trends and spot problems. Good examples include:

- Sales data (revenue, orders, returns by period)
- Website analytics (sessions, conversions, bounce rate by week)
- Operations data (ticket volume, resolution time, error rates by day)
- Financial data (expenses, profit, headcount by month)

### What does the tool do with each column?

- Columns containing numbers are treated as metrics. They appear in KPI cards, the chart, and the AI analysis.
- Columns containing text are treated as categories. The tool computes a breakdown of metric totals per category and includes this in the AI prompt.
- A column named `date` is used as the chart x-axis label and is excluded from metric calculations.

---

## Starting a New Analysis

Click the "New Analysis" button in the top-right corner to reset the application. All data is cleared from memory and you return to the initial upload screen. No data is stored between sessions.

---

## Error Messages

**"Analysis failed — API error: 401"**

Your API key is missing or invalid. The application needs a valid Anthropic API key to call the Claude AI service. Contact the person who set up the application.

**"Analysis failed — API error: 429"**

The API rate limit has been reached. Wait a minute and try again.

**"Analysis failed — SyntaxError: Unexpected token"**

The AI returned a response that could not be parsed. This is rare. Try running the analysis again.

**The upload button does not respond**

Make sure you are selecting a `.csv` file. Other file types (Excel, JSON, TSV) are not supported.

---

## Privacy

Your CSV data is processed in your browser. Only the statistical summary (column totals, averages, trends, and anomaly counts) is sent to the Claude API — the raw row data is never transmitted. Do not upload datasets that contain personally identifiable information or confidential records.
