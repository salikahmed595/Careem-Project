# API Reference — The Auto-Analyst

This document describes how the application uses the Anthropic Claude API and what the expected request and response formats look like.

---

## Claude API Integration

### Endpoint

```
POST https://api.anthropic.com/v1/messages
```

### Request Headers

| Header | Value | Notes |
|---|---|---|
| `Content-Type` | `application/json` | Required |
| `x-api-key` | Your Anthropic API key | Required |
| `anthropic-version` | `2023-06-01` | Required — pins the API version |
| `anthropic-dangerous-direct-browser-access` | `true` | Required for direct browser calls |

The `anthropic-dangerous-direct-browser-access` header is required when calling the API directly from a browser instead of from a server. In a production deployment, remove this header and route the call through your own backend so the API key is never exposed in the client.

### Request Body

```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 1000,
  "messages": [
    {
      "role": "user",
      "content": "<prompt string from promptBuilder.js>"
    }
  ]
}
```

**Model choice**: `claude-sonnet-4-20250514` is used because it produces high-quality structured JSON output, responds quickly, and is cost-effective for this use case. The model can be swapped for `claude-opus-4-8` for more nuanced insights or `claude-haiku-4-5-20251001` for lower latency and cost.

**Token limit**: 1000 tokens is sufficient for the expected JSON response. Increase this if the AI consistently truncates its output.

---

## Prompt Format

The prompt is built by `src/utils/promptBuilder.js`. It always follows this structure:

```
You are a senior business data analyst. Analyze the following dataset statistics and write a professional insight report.

DATASET: <dataset name>
ROWS: <total row count>

KPI SUMMARY:
- <column>: total=<value>, avg=<value>, trend=<up|down|flat>, pct_change=<value>%
...

ANOMALIES:
- Row <n>, column "<col>": value <v> (z-score <z>)
...  (or "No significant anomalies detected.")

CATEGORY BREAKDOWN:
- <category>: count=<n>, <col>=<total>, ...
...  (or "No categorical breakdown available.")

Respond ONLY with a valid JSON object (no markdown, no backticks) in this exact format:
{
  "headline": "...",
  "insights": ["...", "...", "..."],
  "actions": ["...", "...", "..."],
  "riskFlags": ["..."],
  "sentimentScore": 72
}
```

The final section of the prompt specifies the exact JSON schema. Instructing the model to avoid markdown and backticks prevents the common issue of models wrapping JSON in code fences.

---

## Response Format

### Raw API Response

```json
{
  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "{\"headline\": \"...\", \"insights\": [...], ...}"
    }
  ],
  "model": "claude-sonnet-4-20250514",
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 420,
    "output_tokens": 310
  }
}
```

The application extracts the text from all `content` blocks of type `"text"`, joins them, strips any accidental backtick fences, and parses the result as JSON.

### Parsed AI Result

```json
{
  "headline": "Electronics revenue grew 45% over six months while Apparel returns remain a persistent drag on margins.",
  "insights": [
    "Electronics revenue increased from $42,300 in January to $61,200 in June — a 44.7% gain driven by a consistent rise in order volume.",
    "Apparel category shows the highest return rate at an average of 31.7 returns per month, significantly above the Electronics average of 15.8.",
    "February shows an anomaly in Apparel orders (589) with an unusually high return rate of 41 — a z-score of 2.1 above the column mean."
  ],
  "actions": [
    "Increase Electronics inventory ahead of Q3 to support the current demand trajectory.",
    "Investigate Apparel return drivers — size guides, product descriptions, or fulfilment accuracy may need review.",
    "Set a return rate alert threshold of 35 units per period and trigger a category review if exceeded."
  ],
  "riskFlags": [
    "Apparel return rate is trending upward — if unchecked, it will erode category margin."
  ],
  "sentimentScore": 72
}
```

### Field Descriptions

| Field | Type | Description |
|---|---|---|
| `headline` | String | One sentence. The single most important finding from the data. |
| `insights` | Array of strings | Three or more data-backed observations. Each should reference specific numbers. |
| `actions` | Array of strings | Three or more concrete, specific recommended actions. |
| `riskFlags` | Array of strings | Warnings about patterns that could indicate a business problem. May be an empty array. |
| `sentimentScore` | Integer (0–100) | Overall business health score. 0 = critical situation, 100 = excellent performance. |

---

## Error Handling

The application handles API errors in `src/hooks/useAutoAnalyst.js`. All errors set `status` to `"error"` and store the error message in state for display in the UI.

| HTTP Status | Likely Cause | Resolution |
|---|---|---|
| 401 | API key is missing or invalid | Check the `VITE_ANTHROPIC_API_KEY` environment variable |
| 403 | API key does not have permission for this model | Verify key permissions in the Anthropic console |
| 429 | Rate limit exceeded | Wait 60 seconds and retry |
| 500 | Anthropic service error | Retry after a short delay |

If the API returns a 200 status but the response body is not valid JSON, the application catches the `JSON.parse` error and displays a generic failure message.

---

## Cost Estimates

The prompt for a typical dataset (12 rows, two categories) is approximately 400 input tokens. The response is approximately 300 output tokens.

At current Anthropic pricing for `claude-sonnet-4-20250514`, each analysis costs roughly $0.002 to $0.004. For internal use or a hackathon demo, this is negligible.

To reduce cost without changing the model, reduce `max_tokens` to 700 or shorten the prompt by limiting the number of KPI columns included.
