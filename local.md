# Local Setup — The Auto-Analyst

This guide walks you through running the full stack (frontend + backend) on your machine.

---

## Prerequisites

| Tool | Minimum Version | How to Check |
|---|---|---|
| Node.js | 18.0.0 | `node --version` |
| npm | 9.0.0 | `npm --version` |
| Git | Any recent version | `git --version` |

You also need an OpenAI API key. Get one at platform.openai.com under API Keys.

---

## Step 1 — Clone the Repository

```bash
git clone https://github.com/salikahmed595/Careem-Project.git
cd Careem-Project
```

---

## Step 2 — Set Up the Backend

```bash
cd server
npm install
```

Create the backend environment file:

```bash
cp .env.example .env
```

Open `server/.env` and add your OpenAI key:

```
OPENAI_API_KEY=sk-proj-your-key-here
PORT=3000
```

Start the backend:

```bash
node index.js
```

You should see:

```
Auto-Analyst API running on port 3000
```

Verify it works:

```bash
curl http://localhost:3000/health
# Expected: {"status":"ok"}
```

Keep this terminal open.

---

## Step 3 — Set Up the Frontend

Open a new terminal in the project root:

```bash
cd Careem-Project
npm install
```

Create the frontend environment file:

```bash
cp .env.example .env
```

The default value (`VITE_API_URL=http://localhost:3000`) already points to your local backend. No changes needed.

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Step 4 — Test the Full Flow

1. Click "Try Demo Data" in the browser.
2. KPI cards and the chart appear immediately (no network request yet).
3. After a few seconds, the AI insight panel appears — this confirms the frontend reached the backend, and the backend reached OpenAI successfully.

If the insight panel does not appear, open the browser console and the backend terminal for error details.

---

## Common Issues

### Backend: "OPENAI_API_KEY is not configured"

The `server/.env` file is missing or the key name is wrong. The variable must be exactly `OPENAI_API_KEY`.

### Backend: 401 from OpenAI

Your API key is invalid or has been revoked. Generate a new key at platform.openai.com.

### Frontend: "Failed to fetch" or CORS error

The backend is not running. Start it with `node index.js` from the `server/` directory.

### Frontend: Tailwind styles not applying

Run `npm install` again in the project root. If the issue persists, delete `node_modules` and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Module not found errors in the backend

Run `npm install` from inside the `server/` directory (not the root).

---

## Available Scripts

### Frontend (run from project root)

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server at localhost:5173 |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Serve the production build locally at localhost:4173 |

### Backend (run from `server/`)

| Command | Description |
|---|---|
| `node index.js` | Start the API server |
| `node --watch index.js` | Start with auto-restart on file changes |
