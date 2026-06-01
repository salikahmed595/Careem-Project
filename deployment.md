# Deployment Guide — The Auto-Analyst

The application runs as two separate services:

- **Backend** — Express server on Render. Holds the OpenAI API key. Handles all AI calls.
- **Frontend** — Static React build on GitHub Pages. Calls the Render backend.

Deploy the backend first. You need its URL before building the frontend.

---

## Part 1 — Deploy Backend to Render

### Step 1 — Create the Render service

1. Go to render.com and sign in.
2. Click "New" then "Web Service".
3. Connect your GitHub account and select the `Careem-Project` repository.
4. Configure the service:

| Setting | Value |
|---|---|
| Name | `auto-analyst-api` (or any name you choose) |
| Region | Choose the one closest to your users |
| Root Directory | `server` |
| Build Command | `npm install` |
| Start Command | `node index.js` |
| Instance Type | Free |

### Step 2 — Add the environment variable

In the Render dashboard, go to your service → Environment → Add Environment Variable:

| Key | Value |
|---|---|
| `OPENAI_API_KEY` | Your OpenAI API key |

Click "Save Changes". Render will redeploy automatically.

### Step 3 — Verify the backend is live

Once the deploy log shows "Auto-Analyst API running on port ...", copy your service URL (e.g. `https://auto-analyst-api.onrender.com`) and test it:

```bash
curl https://auto-analyst-api.onrender.com/health
# Expected: {"status":"ok"}
```

Keep this URL — you need it in Part 2.

---

## Part 2 — Deploy Frontend to GitHub Pages

### Step 1 — Add the backend URL as a GitHub secret

1. Go to your GitHub repository: github.com/salikahmed595/Careem-Project
2. Settings → Secrets and variables → Actions → New repository secret
3. Add:

| Name | Value |
|---|---|
| `VITE_API_URL` | `https://auto-analyst-api.onrender.com` (your Render URL) |

### Step 2 — Enable GitHub Pages

1. In your repository, go to Settings → Pages.
2. Under "Source", select "Deploy from a branch".
3. Set the branch to `gh-pages` and the folder to `/ (root)`.
4. Click Save.

### Step 3 — Trigger the deployment

Push any change to the `main` branch (or push the current commits if you haven't already):

```bash
git push origin main
```

GitHub Actions will automatically:
1. Install dependencies
2. Build the React app with `VITE_API_URL` injected
3. Push the `dist/` folder to the `gh-pages` branch

### Step 4 — Verify the live site

After the Actions workflow completes (usually 1-2 minutes), your site is live at:

```
https://salikahmed595.github.io/Careem-Project/
```

---

## How It Works in Production

```
User visits https://salikahmed595.github.io/Careem-Project/
        |
Browser loads static files from GitHub Pages
        |
User uploads CSV or clicks "Try Demo Data"
        |
Frontend POST /api/analyze → https://auto-analyst-api.onrender.com
        |
Render server calls OpenAI with the stored API key
        |
OpenAI returns JSON insight report
        |
Render forwards it to the browser
        |
React renders KPI cards, chart, and insight panel
```

---

## Updating the Application

Any push to `main` triggers a new GitHub Pages deployment automatically.

To update backend code: push to `main` and then trigger a manual deploy in the Render dashboard (or configure Render to auto-deploy on push).

---

## Notes on Render Free Tier

Render free tier services spin down after 15 minutes of inactivity. The first request after a cold start may take 30-60 seconds. Subsequent requests are fast. If you need consistent response times, upgrade to a paid instance.

---

## Security Checklist

- [ ] `OPENAI_API_KEY` is set only in the Render dashboard — not in any file committed to git
- [ ] `.env` and `server/.env` are listed in `.gitignore`
- [ ] `.env.example` and `server/.env.example` contain placeholder values only, no real keys
- [ ] The `VITE_API_URL` secret in GitHub Actions points to your Render URL
- [ ] The Render service CORS list includes your GitHub Pages domain
