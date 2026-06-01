# The Auto-Analyst

An AI-powered data insight engine. Upload any CSV and get instant KPI cards, a trend chart, and a written business analysis — powered by OpenAI.

Live: [salikahmed595.github.io/Careem-Project](https://salikahmed595.github.io/Careem-Project/)

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express (deployed on Render) |
| AI | OpenAI gpt-4o-mini |
| Frontend hosting | GitHub Pages |
| Backend hosting | Render |

---

## How It Works

1. Upload a CSV or click "Try Demo Data"
2. The app computes statistics in the browser (totals, averages, trends, anomalies)
3. Those stats are sent to the Render backend
4. The backend calls OpenAI with the statistics as a structured prompt
5. OpenAI returns a JSON insight report
6. The frontend renders KPI cards, a trend chart, and a written analysis

The OpenAI API key lives only on the Render server — never in the browser.

---

## Local Development

```bash
# 1. Set up backend
cd server
npm install
cp .env.example .env       # add your OPENAI_API_KEY
node index.js              # runs on localhost:3000

# 2. Set up frontend (new terminal, from project root)
npm install
cp .env.example .env       # VITE_API_URL=http://localhost:3000 (already set)
npm run dev                # runs on localhost:5173
```

Full setup details: [local.md](local.md)

---

## Deployment

Two services:

1. **Render** — deploy the `server/` directory as a Node.js web service. Add `OPENAI_API_KEY` in environment variables.
2. **GitHub Pages** — push to `main`. GitHub Actions builds and deploys automatically. Add `VITE_API_URL` (your Render URL) as a repository secret.

Full deployment guide: [deployment.md](deployment.md)

---

## Documentation

| File | Contents |
|---|---|
| [requirement.md](requirement.md) | What the system must do |
| [local.md](local.md) | Full local development setup |
| [instruction.md](instruction.md) | How to use the application |
| [architecture.md](architecture.md) | System design and data flow |
| [api.md](api.md) | Backend and OpenAI API reference |
| [deployment.md](deployment.md) | Step-by-step deployment to Render and GitHub Pages |
