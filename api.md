# API Reference — The Auto-Analyst

This document describes how the frontend calls the Render backend, and how the backend calls the OpenAI API.

---

## Architecture

```
Browser (GitHub Pages)
        |
        | POST /api/analyze  { prompt: "..." }
        |
Render Backend (Express)
        |
        | POST /v1/chat/completions
        |
OpenAI API (gpt-4o-mini)
```

The browser never holds the OpenAI API key. Only the Render server does.

---

## Backend Endpoint

### Health Check

```
GET /health
```

Response:

```json
{ "status": "ok" }
```

Use this to verify your Render service is running.

### Analyze

```
POST /api/analyze
Content-Type: application/json

{
  "prompt": "<string built by promptBuilder.js>"
}
```

Success response (200):

```json
{
  "text": "{\"headline\": \"...\", \"insights\": [...], ...}"
}
```

The `text` field is a JSON string. The frontend parses it with `JSON.parse(data.text)`.

Error response:

```json
{
  "error": "description of what went wrong"
}
```

---

## OpenAI API (called by the backend)

### Endpoint

```
POST https://api.openai.com/v1/chat/completions
```

### Request

```json
{
  "model": "gpt-4o-mini",
  "messages": [{ "role": "user", "content": "<prompt>" }],
  "response_format": { "type": "json_object" },
  "max_tokens": 1000,
  "temperature": 0.4
}
```

`response_format: { type: "json_object" }` forces the model to return valid JSON only. No markdown fences, no extra text.

### Response

```json
{
  "choices": [
    {
      "message": {
        "content": "{\"headline\": \"...\", \"insights\": [...], \"actions\": [...], \"riskFlags\": [...], \"sentimentScore\": 72}"
      }
    }
  ]
}
```

### Parsed AI Result Shape

```json
{
  "headline": "One sentence — the most important finding",
  "insights": [
    "Insight 1 — specific, data-backed observation",
    "Insight 2 — a trend or pattern",
    "Insight 3 — an anomaly or risk signal"
  ],
  "actions": [
    "Action 1 — concrete and specific",
    "Action 2 — based on trends",
    "Action 3 — risk mitigation"
  ],
  "riskFlags": [
    "Risk 1 — short warning"
  ],
  "sentimentScore": 72
}
```

### Field Descriptions

| Field | Type | Description |
|---|---|---|
| `headline` | String | One-sentence summary of the most important finding |
| `insights` | Array of strings | Three or more data-backed observations with numbers |
| `actions` | Array of strings | Three or more concrete recommended actions |
| `riskFlags` | Array of strings | Warnings about risky patterns. May be empty. |
| `sentimentScore` | Integer 0-100 | Overall business health. 0 = critical, 100 = excellent. |

---

## CORS Policy

The backend allows requests from these origins only:

- `https://salikahmed595.github.io` (GitHub Pages)
- `http://localhost:5173` (Vite dev server)
- `http://localhost:4173` (Vite preview)

Any other origin receives a CORS error.

---

## Environment Variables

### Backend (set in Render dashboard)

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `PORT` | Set automatically by Render — do not set manually |

### Frontend (set in GitHub Actions secrets)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Full URL of your Render service, e.g. `https://auto-analyst-api.onrender.com` |

---

## Error Handling

| HTTP Status | Likely Cause |
|---|---|
| 400 | `prompt` field is missing from the request body |
| 401 | `OPENAI_API_KEY` is invalid |
| 429 | OpenAI rate limit exceeded — wait and retry |
| 500 | Server misconfiguration or OpenAI service error |

---

## Cost Estimate

`gpt-4o-mini` at typical prompt and response sizes (~500 input tokens, ~300 output tokens) costs approximately $0.0001 per analysis. For hundreds of daily uses, cost is negligible.

To reduce cost further: shorten the prompt by reducing the number of KPI columns passed in. To increase quality: swap `gpt-4o-mini` for `gpt-4o` in `server/index.js`.
