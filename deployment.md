# Deployment Guide — The Auto-Analyst

This guide covers how to build the application for production and deploy it to a public URL.

---

## Before You Deploy

### Secure the API Key

The most important thing before deploying is to ensure your Anthropic API key is not bundled into the client-side JavaScript. In local development, using `VITE_ANTHROPIC_API_KEY` as an environment variable is acceptable. In production, any environment variable prefixed with `VITE_` is embedded in the build output and is visible to anyone who views the source.

You have two options:

**Option A — Accept the risk for a private or demo deployment**

If this is a hackathon demo, internal tool, or short-lived link shared with a known audience, you can proceed with the environment variable approach. Set a usage limit and key expiry in the Anthropic console to limit exposure.

**Option B — Add a backend proxy (recommended for any public deployment)**

Create a simple server-side function that receives the prompt from the browser, adds the API key, calls the Anthropic API, and returns the result. The browser never sees the key. The function can be an Edge Function in Vercel, a Cloudflare Worker, or a Netlify Function.

A minimal Vercel Edge Function example (`/api/analyze.js`):

```js
export const config = { runtime: "edge" };

export default async function handler(req) {
  const { prompt } = await req.json();

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}
```

Then update `useAutoAnalyst.js` to call `/api/analyze` instead of the Anthropic URL directly, and remove the browser-specific headers.

---

## Build for Production

Run the production build command:

```bash
npm run build
```

Vite compiles and bundles the application into the `dist/` directory. The output is a set of static HTML, CSS, and JavaScript files with no server-side runtime requirements.

Preview the production build locally before deploying:

```bash
npm run preview
```

This serves the `dist/` directory at `http://localhost:4173`. Test the full analysis flow to confirm everything works.

---

## Deploying to Vercel

Vercel is the recommended platform for this project. It handles the build step automatically and provides environment variable management.

### Using the Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts. When asked about the build command, use `npm run build`. When asked about the output directory, use `dist`.

Set the environment variable:

```bash
vercel env add ANTHROPIC_API_KEY
```

Enter your API key when prompted. Vercel stores it securely and injects it at build time (if needed) or at runtime (for Edge Functions).

Deploy to production:

```bash
vercel --prod
```

### Using the Vercel Dashboard

1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Log in to [vercel.com](https://vercel.com) and click "Add New Project".
3. Import your repository.
4. Under "Environment Variables", add `ANTHROPIC_API_KEY` with your key value.
5. Click "Deploy".

Vercel automatically redeploys when you push to the main branch.

---

## Deploying to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

Or connect your repository through the Netlify dashboard. Set environment variables under Site Settings > Environment Variables.

---

## Deploying to GitHub Pages

GitHub Pages serves static files directly from a repository. It does not support environment variables at runtime.

If you are deploying to GitHub Pages, you must either:
- Hard-code a restricted API key (acceptable only for a short-lived demo)
- Use a separate backend proxy for the API call

To deploy:

1. Install the deployment helper:

```bash
npm install -D gh-pages
```

2. Add to `package.json`:

```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

3. If your repo is not at the root domain (e.g., `username.github.io/auto-analyst`), update `vite.config.js`:

```js
export default {
  base: "/auto-analyst/"
}
```

4. Deploy:

```bash
npm run deploy
```

---

## Environment Variables by Platform

| Platform | How to Set Variables |
|---|---|
| Vercel | Dashboard > Project > Settings > Environment Variables, or `vercel env add` |
| Netlify | Dashboard > Site Settings > Environment Variables |
| GitHub Pages | Not supported — use a proxy or GitHub Actions secrets |
| Cloudflare Pages | Dashboard > Pages > Project > Settings > Environment Variables |
| Railway | Dashboard > Project > Variables |

---

## Post-Deployment Checklist

- [ ] The application loads without errors in the browser.
- [ ] "Try Demo Data" loads the demo dataset and renders KPI cards and a chart.
- [ ] The AI insight panel appears after the demo analysis completes.
- [ ] The API key is not visible in the browser's DevTools > Sources panel.
- [ ] The "New Analysis" button resets the page correctly.
- [ ] The application works on Chrome, Firefox, and Safari.
- [ ] You have set a usage limit on your Anthropic API key in the console.
