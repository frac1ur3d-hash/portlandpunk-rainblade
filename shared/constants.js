export const GAME_NAME = "PortlandPunk";
export const VERSION   = "0.1.0";

// Blockchain
export const CHAIN_ID   = 84532;
export const CHAIN_NAME = "Base Sepolia";
export const BASE_SEPOLIA_RPC = "https://sepolia.base.org";

// Map defaults — centered on Portland, OR
export const DEFAULT_MAP_CENTER = { lat: 45.5231, lng: -122.6765 };
export const DEFAULT_MAP_ZOOM   = 14;

// Gameplay
export const ENEMY_SPAWN_RADIUS_METERS = 300;
export const MAX_ENEMIES_ON_MAP        = 12;
export const COMBAT_DURATION_MAX_MS    = 120_000;
export const ENEMY_RESPAWN_MS          = 30_000;

// Loot rarity
export const LOOT_RARITY_COLORS = {
  0: "#9e9e9e", // Common    — grey
  1: "#4caf50", // Uncommon  — green
  2: "#2196f3", // Rare      — blue
  3: "#9c27b0", // Epic      — purple
  4: "#ff9800", // Legendary — orange
};

export const LOOT_RARITY_NAMES = {
  0: "Common",
  1: "Uncommon",
  2: "Rare",
  3: "Epic",
  4: "Legendary",
};

// Classes
export const CLASSES = ["samurai", "netrunner", "infiltrator", "shaman"];
export const CLASS_NAMES = {
  samurai:     "Street Samurai",
  netrunner:   "Netrunner",
  infiltrator: "Corp Infiltrator",
  shaman:      "River Shaman",
};
export const CLASS_DESCRIPTIONS = {
  samurai:     "Old Town's hardest brawler. Melee burst damage, high raw power, low defense.",
  netrunner:   "Hawthorne hacker turned street fighter. Ranged attacks and enemy debuffs.",
  infiltrator: "Pearl District spy who went rogue. Stealth, burst, and misdirection.",
  shaman:      "Sellwood's riverside mystic. AoE elemental attacks and party heals.",
};
export const CLASS_IDS = { samurai: 0, netrunner: 1, infiltrator: 2, shaman: 3 };

// XP curve — XP required to REACH each level (index = level, starts at level 2)
export const XP_PER_LEVEL = (() => {
  const curve = [0, 0]; // levels 0 and 1 are baseline
  for (let lvl = 2; lvl <= 50; lvl++) {
    curve.push(Math.floor(100 * Math.pow(lvl, 2.2)));
  }
  return curve;
})();

// Portland Relic IDs (match deploy.js)
export const RELIC_IDS = {
  POWELLS_TOME:         1,
  VOODOO_DONUT_RING:    2,
  STEEL_BRIDGE_CHAINSAW:3,
  TIMBERS_AXE:          4,
  BURNSIDE_ORACLE_STAFF:5,
  ROSE_QUARTER_SHIELD:  6,
  NOPO_RAIL_GUN:        7,
  FOREST_PARK_SPEAR:    8,
};

// Map style ID — use DEMO_MAP_ID for development (enables AdvancedMarkers)
export const MAP_ID = "DEMO_MAP_ID";
