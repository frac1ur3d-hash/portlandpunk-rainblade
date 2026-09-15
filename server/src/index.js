import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PORTLAND_ZONES } from '../../shared/zones.js';
import { ENEMY_TYPES } from '../../shared/enemies.js';
import { ITEM_POOL, generateLootDrop } from '../../shared/items.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory player database for MVP / local runner
const players = new Map();

// ── HEALTH / STATUS ──
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    game: 'PortlandPunk',
    version: '0.1.0',
    chain: 'Base Sepolia (84532)',
    zonesCount: PORTLAND_ZONES.length,
    enemiesCount: Object.keys(ENEMY_TYPES).length
  });
});

// ── WORLD & ZONES ──
app.get('/api/zones', (req, res) => {
  res.json({ zones: PORTLAND_ZONES });
});

app.get('/api/enemies', (req, res) => {
  res.json({ enemies: ENEMY_TYPES });
});

// ── PLAYER STATE ──
app.get('/api/player/:address', (req, res) => {
  const { address } = req.params;
  const player = players.get(address.toLowerCase()) || {
    address,
    characterName: 'RUNNER',
    classId: 0,
    level: 1,
    xp: 0,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    punkBalance: 0,
    inventory: [],
    equipped: {}
  };
  res.json({ player });
});

app.post('/api/player/sync', (req, res) => {
  const { address, character, inventory, punkBalance } = req.body;
  if (!address) return res.status(400).json({ error: 'Address required' });

  const data = {
    address: address.toLowerCase(),
    character,
    inventory,
    punkBalance,
    updatedAt: new Date().toISOString()
  };
  players.set(address.toLowerCase(), data);
  res.json({ success: true, player: data });
});

// ── LOOT & ON-CHAIN MINT ORACLE ──
app.post('/api/loot/drop', (req, res) => {
  const { zoneId, zoneTier } = req.body;
  const item = generateLootDrop(zoneId, zoneTier);
  res.json({ item });
});

// Oracle signature endpoint for minting loot NFT on Base Sepolia
app.post('/api/loot/sign-mint', (req, res) => {
  const { playerAddress, itemId, zoneId } = req.body;
  if (!playerAddress) {
    return res.status(400).json({ error: 'playerAddress required' });
  }

  // Simulated server oracle signature
  const fakeSignature = '0x' + Array.from({ length: 130 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  const nonce = Date.now();

  res.json({
    success: true,
    playerAddress,
    itemId,
    zoneId,
    nonce,
    signature: fakeSignature,
    chain: 'Base Sepolia',
    chainId: 84532
  });
});

app.listen(PORT, () => {
  console.log(`[PortlandPunk Server] Running at http://localhost:${PORT}`);
  console.log(`[Base Blockchain Oracle] Ready for Base Sepolia (84532)`);
});
