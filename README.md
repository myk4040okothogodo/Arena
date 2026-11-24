# M-PESA Arena on ZiiDi Trader — interactive prototype

A single-file, mobile-first prototype (`index.html`, no build step) showing how Arena plugs into ZiiDi Trader: a skill-ranked trader leaderboard and copy trading, built on ZiiDi's existing buy and sell flows. All data is simulated.

Live: https://mpesaarena.netlify.app/ (QR code: `qr-code.png` / `qr-code.svg`).

## Design rules
- Reuse ZiiDi's existing flows. No trading wallet and no new external integration. Money stays in M-PESA.
- Nothing trades without the customer's M-PESA PIN. Arena groups orders so one PIN covers a group.
- Four touchpoints only: Home "Top traders" row, Trade > Traders, Portfolio > Copying, Account > Become a copy trader.

## What you can do
### Copier
- Browse traders ranked by the **Arena Score** (0–1000, six measures: risk-adjusted returns, consistency, capital efficiency, decision quality, track record, diversification). The highest raw return can rank last.
- Open a profile: score breakdown, stats, risk, holdings as of last close.
- **Copy**: choose an amount and a loss-alert level, review the **basket** (whole shares, fees, what stays in M-PESA), accept the agreement, enter the PIN **once**.
- **Portfolio > Copying**: when the trader changes their mix, review only the **difference** and approve with one PIN.
- **Loss alert** at your chosen level: nothing is sold automatically; you choose whether to sell (one PIN).
- **Stop**: keep your shares (no PIN) or sell everything (one PIN).
- **Swarm Intelligence**: one basket weighted by the Arena Score of the top traders.

### Trader
- **Account > Become a copy trader**: eligibility, agreement, one PIN to confirm.
- Dashboard: record-building progress (day N of 90), league, trend charts (copiers, earnings, copied capital; Rising, Flat or Falling), copiers, copied amount, earnings calculated at each copier sale on realised profit, taken from proceeds, with the trader's share paid once daily after close.

## Storyboard states (for documentation)
Open `index.html#s=<name>` to jump to a screen. Add `&bare` for a frameless phone. Names: `home traders profile holdings copy basket pin1 placed copying update updreview pin2 loss lossreview sellpin stop account optin pin3 tdash tdash2 order0 order`.

## Deploy
Static site: publish the repo root. `netlify.toml` already sets this.

## Files
- `index.html` — the prototype (self-contained)
- `qr-code.png`, `qr-code.svg` — QR code to the live site
- `app.js`, `styles.css`, `images/`, `scan-poster.*` — assets from the earlier Arena demo, not used by the current `index.html`
