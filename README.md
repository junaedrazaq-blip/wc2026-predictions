# ⚽ WC2026 Predictions App

A full-stack score predictions app for FIFA World Cup 2026.  
Built for Netlify — deploy in under 5 minutes.

---

## Features

- **72 group-stage fixtures** (all 12 groups, 48 teams) pre-loaded
- **Score predictions form** with per-match inputs and live progress tracker
- **Leaderboard** — auto-scored as results come in (3pts exact, 1pt correct result)
- **Admin panel** — password-protected result entry
- **Persistent storage** via Netlify Blobs (no external DB needed)
- Predictions saved in browser localStorage so users can come back and complete them

---

## Deploy to Netlify

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "WC2026 predictions app"
# Create a repo on GitHub and push:
git remote add origin https://github.com/YOUR_USERNAME/wc2026-predictions.git
git push -u origin main
```

### 2. Connect to Netlify
1. Go to [netlify.com](https://netlify.com) and click **Add new site → Import an existing project**
2. Choose your GitHub repo
3. Build settings (auto-detected from `netlify.toml`):
   - **Build command:** *(leave blank)*
   - **Publish directory:** `public`
4. Click **Deploy site**

### 3. Set your Admin Key
1. In Netlify dashboard → **Site configuration → Environment variables**
2. Add variable: `ADMIN_KEY` = *your chosen secret password*
3. Redeploy (or it takes effect on next function call)

> Default admin key is `wc2026admin` if you don't set one — **change this!**

### 4. Enable Netlify Blobs
Netlify Blobs is enabled automatically for all sites. No configuration needed.

---

## Local Development
```bash
npm install
npx netlify dev
```
Requires [Netlify CLI](https://docs.netlify.com/cli/get-started/).

---

## Scoring Rules

| Result | Points |
|--------|--------|
| Exact score (e.g. 2–1 predicted, 2–1 actual) | **3 pts** |
| Correct outcome (win/draw/loss, wrong score) | **1 pt** |
| Wrong result | **0 pts** |

---

## File Structure

```
wc2026-predictions/
├── netlify.toml                        # Netlify config
├── package.json
├── netlify/functions/
│   ├── matches-data.js                 # All 72 group fixtures (shared data)
│   ├── matches.js                      # GET /matches
│   ├── submit-prediction.js            # POST /submit-prediction
│   ├── get-predictions.js              # GET /get-predictions?key=ADMIN_KEY
│   └── leaderboard.js                  # GET /leaderboard  |  POST /leaderboard (set result)
└── public/
    └── index.html                      # Full SPA frontend
```

---

## Sharing with Friends

Once deployed, just share your Netlify URL (e.g. `https://your-site.netlify.app`).  
Each person enters their name and submits their predictions.

**Tip:** Set a deadline before the tournament starts (11 June 2026) so no one can update
their predictions after seeing Group A results!

---

## Admin Usage

1. Click the **Admin** tab on the site
2. Enter your `ADMIN_KEY`
3. Filter by group, enter actual scores, click **Save**
4. The leaderboard updates instantly for everyone

To view all raw predictions:
```
GET https://your-site.netlify.app/.netlify/functions/get-predictions?key=YOUR_ADMIN_KEY
```
