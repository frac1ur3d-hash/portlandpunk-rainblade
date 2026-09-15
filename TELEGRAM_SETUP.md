# Portland Protocol: Rain Blade — Telegram Mini App Setup Guide

This project is now **100% Telegram Mini App (TMA) production-ready**.

---

## 🚀 How to Launch on Telegram in Under 3 Minutes

### Step 1: Host Your Game (Free HTTPS)
Telegram Mini Apps require an HTTPS URL. You can host your `client/dist` folder for free on:
* **Vercel / Cloudflare Pages / Netlify / GitHub Pages**:
  - Simply upload or link your repo and deploy the `client/dist` folder (or just `rain-blade.html`).
* **Local Testing Tunnel (for testing on phone right now)**:
  - Run `npx localtunnel --port 5173` or `ngrok http 5173`.
  - Copy the generated `https://...` address.

---

### Step 2: Register Your Bot with BotFather on Telegram
1. Open Telegram and message **[@BotFather](https://t.me/BotFather)**.
2. Send `/newbot` and follow the prompts to choose a Name and Username (e.g., `PortlandRainBladeBot`).
3. Send `/newapp` to link a Mini App to your bot:
   - Select your bot.
   - Enter title: `Portland Protocol: Rain Blade`.
   - Enter short description: `Retro Cyberpunk Urban ARPG with Dubstep Audio`.
   - Upload an icon (640x360 px) and photo.
   - **Enter Web App URL**: Enter your HTTPS URL (e.g. `https://your-domain.com/rain-blade.html`).
   - Enter short name: `play` (this makes your launch link: `https://t.me/YourBotName/play`).

---

### Step 3: Monetization Options Built In
1. **Telegram Stars (In-App Purchases)**:
   - Use `Telegram.WebApp.openInvoice()` for coffee beans, exclusive skins, or relic crates.
   - Exchange Stars for real revenue via Fragment (TON).
2. **Viral Share / Invite Loops**:
   - The in-game Telegram Share button generates direct challenge links with the player's level, wave, and combo record.
3. **Telegram Ads & Sponsored Mini-App Drops**:
   - Offer bonus coffee beans for joining your official Telegram channel.
