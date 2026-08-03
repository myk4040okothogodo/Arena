# M-PESA Arena — Interactive Demo

A self-contained, mobile-first prototype of the Arena app (single `index.html`, no build step).
Open it on a phone for the full effect. Safaricom-green UI, live leaderboard, real portfolios, and the full "back a trader / Arena Auto / Swarm Intelligence" flow.

## What the judges can do
On launch they pick a role: **Investor** or **Trader**. Tap **Switch** (top-right) to jump between them.

### Investor
- **Fund wallet** (KES 42,500) with Fund / Withdraw to M-PESA.
- **Live leaderboard** — 10 traders re-rank in real time.
- **Portfolio** with three views: **Overall** (aggregate performance-over-time chart), **By trader**, and **By asset class** (FX / Crypto / Futures / Shares exposure).
- **Back a trader** → the position mirrors their cumulative performance. Tap any backing to **increase** or **withdraw** it.
- **Trader profile**: ranking, **KYC**, portfolio, performance, back / increase / withdraw.
- **AI Pro** subscriptions: **Insights** (KES 500 — AI sentiment advice) and **Auto** (KES 1,000 — AI invests via Swarm Intelligence).

### Trader
- **Assume the trader role** — an authenticated identity (e.g. *Mike Okoth*) that any verified M-PESA user can take on. The role can **place trades (buy/sell)** on the connected platforms but can **never withdraw** funds. (Shown so judges can see the app from a trader's point of view.)
- **Onboarding**: fund the trading wallet with a **minimum of KES 100,000** of your own capital, then trade solo for a **90-day profile-building period** while the AI verifies your track record. **Backing unlocks only after 90 days** — a **▶ Simulate 3 months** button lets judges jump to the backed state.
- **Dashboard**: total **AUM**, number of **backers**, 30-day return, own capital, performance broken down by asset class, and **connected-platform** status (FX / Crypto / Futures / Shares — orchestrated via API).
- **Markets**: live **candlestick charts that move in real time**, with Buy/Sell (orders route to the connected venue and are monitored).
- **Activity**: a live feed of every buy/sell, time-stamped.
- **Backers**: who's backing you and how much.
- **Earnings**: your profit split shown exactly — gross profit, investors' share, **your 17.5% carry**, and **Arena's 27.5% cut** — with a visual split bar.

## Deploy to Vercel (pick one)
**A · Drag & drop (easiest, ~1 min)**
1. Go to https://vercel.com/new
2. Drag this whole `arena-demo` folder onto the page.
3. Name the project **`mpesa-arena-demo`** (important — see QR note) and click **Deploy**.
4. Your live URL will be **https://mpesa-arena-demo.vercel.app**

**B · Vercel CLI**
```
npm i -g vercel
cd arena-demo
vercel --prod        # when asked, set project name to: mpesa-arena-demo
```

**C · GitHub**
Push this folder to a repo, then "Import Project" at vercel.com/new. No build settings needed (static site).

## The QR code
`qr-code.png` / `qr-code.svg` and `scan-poster.svg/pdf` point to **https://mpesa-arena-demo.vercel.app**.
- If you deploy under that exact project name, the QR works immediately.
- If Vercel gives you a different URL (name taken), just send it back and a fresh QR takes seconds to regenerate.

## Files
- `index.html` — page markup (links the CSS and JS below)
- `styles.css` — all styling (Safaricom-green UI)
- `app.js` — all app logic (data model, live-leaderboard engine, back-a-trader/Auto/Swarm)
- `qr-code.png`, `qr-code.svg` — the QR to the live demo
- `scan-poster.svg`, `scan-poster.pdf` — print-ready A4 "scan me" poster for the judges' table
- `vercel.json` — minimal static config

> Note: because it's now split into 3 files, preview it by opening the folder in a browser
> (or run `npx serve` in this folder). All three deploy to Vercel together with no build step.
