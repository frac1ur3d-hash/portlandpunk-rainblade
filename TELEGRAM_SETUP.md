# Portland Protocol: Rain Blade — Telegram Mini App Setup & Live Links

Your Telegram Bot and GitHub Pages hosting are now **100% configured and live**!

---

## 🎮 Live Game URLs (GitHub Pages & CDN)

| Target | Live HTTPS URL | Status |
| :--- | :--- | :--- |
| **Direct Game (GitHub Pages)** | `https://frac1ur3d-hash.github.io/rain-blade.html` | ✅ LIVE (200 OK) |
| **Root Portal (GitHub Pages)** | `https://frac1ur3d-hash.github.io/` | ✅ LIVE (200 OK) |
| **Repo GitHub Pages** | `https://frac1ur3d-hash.github.io/portlandpunk-rainblade/` | ✅ LIVE (200 OK) |
| **Netlify Backup** | `https://portland-rain-blade.netlify.app/rain-blade.html` | ✅ LIVE (200 OK) |

---

## 🤖 Configured Telegram Bot Details

- **Bot Username**: [@rainblade_bot](https://t.me/rainblade_bot)
- **Bot Name**: `rain-blade`
- **Bot ID**: `8750320549`
- **Default Menu Button**: Set to **`⚔️ Play Rain Blade`** ➔ opens `https://frac1ur3d-hash.github.io/rain-blade.html` in full screen Telegram Web App!
- **Commands Configured**: `/play` (Launch Game), `/help`

---

## 🚀 Quick Steps in BotFather (To create direct `t.me/rainblade_bot/play` link)

The menu button is already live, but to create the direct `/play` link:

1. Open Telegram and open your chat with **[@BotFather](https://t.me/BotFather)**.
2. Send command: `/newapp`
3. Select your bot: `@rainblade_bot`
4. Enter Title:
   ```text
   Portland Protocol: Rain Blade
   ```
5. Enter Description:
   ```text
   Retro Cyberpunk Urban ARPG with Dubstep Audio, Diablo 3 Skill Runes, and Masterwork Gear!
   ```
6. Send an image / photo (640x360 px or any game screenshot).
7. When asked for **Web App URL**, enter:
   ```text
   https://frac1ur3d-hash.github.io/rain-blade.html
   ```
8. When asked for **short name**, enter:
   ```text
   play
   ```
9. **Done!** BotFather will give you: `https://t.me/rainblade_bot/play`!

---

## 💎 Features Active in Telegram Mini App
- **Haptic Feedback**: Telegram native tactile vibrations on swings, hits, and item socketing (`window.Telegram.WebApp.HapticFeedback`).
- **Cloud Storage**: Persistent cloud saves across mobile devices (`window.Telegram.WebApp.CloudStorage`).
- **Viral Share**: Challenge friends and share high scores directly to Telegram chats.
- **Telegram Stars**: Ready for coffee bean and relic purchases (`openInvoice`).
