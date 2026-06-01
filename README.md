# The Auto-Analyst

An AI-powered data insight engine. Upload any CSV and get instant KPI cards, a trend chart, and a written business analysis — powered by OpenAI.

Live: [salikahmed595.github.io/Careem-Project](https://salikahmed595.github.io/Careem-Project/)

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS — hosted on GitHub Pages |
| Backend | Supabase Edge Function (Deno) — hosted on Supabase |
| AI | OpenAI gpt-4o-mini |
| CI/CD | GitHub Actions — auto-deploys both on push to main |

---

## How It Works

1. Upload a CSV or click "Try Demo Data"
2. The app computes statistics in the browser (totals, averages, trends, anomalies)
3. Those stats are sent to the Supabase Edge Function
4. The Edge Function calls OpenAI with a structured prompt
5. OpenAI returns a JSON insight report
6. The frontend renders KPI cards, a trend chart, and a written analysis

The OpenAI API key lives only in Supabase — never in the browser bundle.

---

## Local Development

```bash
# 1. Install frontend dependencies
npm install
cp .env.example .env

# 2. Start local Supabase (requires Docker)
npx supabase start

# 3. Set OpenAI key for local function
npx supabase secrets set --env-file supabase/functions/analyze/.env.local

# 4. Serve the Edge Function locally
npx supabase functions serve analyze --no-verify-jwt

# 5. Start the frontend (new terminal)
npm run dev
```

Full setup details: [local.md](local.md)

---

## Deployment

Push to `main`. GitHub Actions automatically:
1. Deploys the Supabase Edge Function
2. Builds the React app with the production function URL
3. Publishes the build to GitHub Pages

**One-time setup required:**

Add `SUPABASE_ACCESS_TOKEN` as a GitHub Actions secret (get it from supabase.com/dashboard/account/tokens).

Full guide: [deployment.md](deployment.md)

---

## Documentation

| File | Contents |
|---|---|
| [requirement.md](requirement.md) | What the system must do |
| [local.md](local.md) | Full local development setup |
| [instruction.md](instruction.md) | How to use the application |
| [architecture.md](architecture.md) | System design and data flow |
| [api.md](api.md) | Edge Function and OpenAI API reference |
| [deployment.md](deployment.md) | Step-by-step deployment guide |
