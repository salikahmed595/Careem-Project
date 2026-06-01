# Local Setup — The Auto-Analyst

This guide walks you through setting up The Auto-Analyst on your machine from scratch.

---

## Prerequisites

Before you start, make sure you have the following installed:

| Tool | Minimum Version | How to Check |
|---|---|---|
| Node.js | 18.0.0 | `node --version` |
| npm | 9.0.0 | `npm --version` |
| Git | Any recent version | `git --version` |

You also need an Anthropic API key. Get one at [console.anthropic.com](https://console.anthropic.com) under API Keys.

---

## Step 1 — Create the Project

If you are starting from the Vite template:

```bash
npm create vite@latest auto-analyst -- --template react
cd auto-analyst
```

If you are cloning an existing repository:

```bash
git clone <your-repo-url>
cd auto-analyst
```

---

## Step 2 — Install Dependencies

```bash
npm install recharts papaparse lucide-react
npm install -D tailwindcss postcss autoprefixer
```

Then initialise Tailwind CSS:

```bash
npx tailwindcss init -p
```

---

## Step 3 — Configure Tailwind CSS

Open `tailwind.config.js` and set the content paths:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Open `src/index.css` and replace its contents with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Step 4 — Set Up Your API Key

Create a `.env` file in the project root (next to `package.json`):

```
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Important notes:
- Never commit this file to version control.
- The `VITE_` prefix is required for Vite to expose the variable to the browser bundle.
- If you are deploying, set this variable in your hosting provider's environment settings instead.

Verify your `.gitignore` includes `.env`:

```
.env
.env.local
.env.*.local
```

---

## Step 5 — Add Project Files

Copy all source files from the project specification into the `src/` directory. The expected structure is:

```
auto-analyst/
├── .env
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
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

## Step 6 — Update the API Hook

In `src/hooks/useAutoAnalyst.js`, update the fetch call to read the API key from the environment variable:

```js
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01",
    "anthropic-dangerous-direct-browser-access": "true"
  },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }]
  })
});
```

The `anthropic-dangerous-direct-browser-access` header is required when calling the Anthropic API directly from a browser. In production, route API calls through your own backend to keep the key private.

---

## Step 7 — Run the Development Server

```bash
npm run dev
```

Vite will start a local server. Open the URL shown in the terminal — typically `http://localhost:5173`.

---

## Verifying the Setup

Once the server is running:

1. Open the app in your browser.
2. Click "Try Demo Data" — this does not require an API key call and should render KPI cards and a chart immediately.
3. Wait for the AI analysis to complete. If the API key is correct, the insight panel will appear within a few seconds.
4. If you see an "Analysis failed" error, check the browser console for details and verify your API key in `.env`.

---

## Common Issues

### "Module not found" errors

Run `npm install` again. If the issue persists, delete `node_modules` and `package-lock.json`, then run `npm install` again.

```bash
rm -rf node_modules package-lock.json
npm install
```

### Tailwind classes not applying

Check that `tailwind.config.js` has the correct `content` paths and that `src/index.css` has the three `@tailwind` directives. Restart the dev server after making changes to the Tailwind config.

### API returns 401 Unauthorized

Your API key is missing or incorrect. Open `.env`, confirm the key starts with `sk-ant-`, and make sure there are no extra spaces or quotes around the value.

### API returns 400 Bad Request

The request headers may be missing. Confirm that `anthropic-version` and `anthropic-dangerous-direct-browser-access` headers are included in the fetch call (see Step 6).

### CORS errors in the browser console

Direct browser calls to the Anthropic API require the `anthropic-dangerous-direct-browser-access` header. Add it to the request headers as shown in Step 6.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local development server with hot reload |
| `npm run build` | Compile and bundle for production (outputs to `dist/`) |
| `npm run preview` | Serve the production build locally to verify it before deployment |
