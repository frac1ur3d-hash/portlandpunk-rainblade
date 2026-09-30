import https from 'https';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8750320549:AAFZnpFHl25VLfXX0WhZYDZMFfk2B39sTI0';
const GAME_URL = process.env.GAME_URL || 'https://frac1ur3d-hash.github.io/rain-blade.html';

function callApi(method, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = https.request(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve({ ok: false, error: body });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

export async function sendWelcomeGameMessage(chatId) {
  return callApi('sendMessage', {
    chat_id: chatId,
    text: `⚡ *PORTLAND PROTOCOL // RAIN BLADE* ⚡\n\nRain-soaked neo-noir streets. Tactical blade ricochet. 10-slot masterwork Diablo gear loadout.\n\nReady to hunt, Rain-Walker?`,
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '⚔️ Launch Rain Blade (Full Screen)',
            web_app: { url: GAME_URL }
          }
        ],
        [
          {
            text: '📢 Share Challenge Link',
            switch_inline_query: 'I reached Wave 15 in Rain Blade! Can you beat my high score?'
          }
        ]
      ]
    }
  });
}

let offset = 0;
async function pollUpdates() {
  try {
    const res = await callApi('getUpdates', { offset, timeout: 30 });
    if (res.ok && Array.isArray(res.result)) {
      for (const update of res.result) {
        offset = update.update_id + 1;
        if (update.message && update.message.chat) {
          const chatId = update.message.chat.id;
          const text = update.message.text || '';
          if (text.startsWith('/start') || text.startsWith('/play')) {
            await sendWelcomeGameMessage(chatId);
          }
        }
      }
    }
  } catch (err) {
    console.error('Polling error:', err.message);
  }
  setTimeout(pollUpdates, 1000);
}

if (process.argv.includes('--start-bot')) {
  console.log('Starting Rain Blade Telegram Bot daemon...');
  pollUpdates();
}
