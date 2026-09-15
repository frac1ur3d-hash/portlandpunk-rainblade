import { LOOT_RARITY_COLORS } from "./constants.js";

// Rarity: 0=Common, 1=Uncommon, 2=Rare, 3=Epic, 4=Legendary
export const ITEM_POOL = [
  // ─── COMMON ───────────────────────────────────────────────────────────────
  { id: "rusty-switchblade",    name: "Rusty Switchblade",    type: "weapon",    rarity: 0, zone: "all",
    stats: { attack: 5,  defense: 0, speed: 2,  intel: 0, luck: 0 },
    description: "Worn but still sharp. A Burnside street classic." },
  { id: "torn-jacket",          name: "Torn Leather Jacket",  type: "armor",     rarity: 0, zone: "all",
    stats: { attack: 0,  defense: 4, speed: 1,  intel: 0, luck: 0 },
    description: "More holes than jacket, but hey, it stops some bullets." },
  { id: "cracked-datajack",     name: "Cracked Datajack",     type: "accessory", rarity: 0, zone: 0,
    stats: { attack: 0,  defense: 0, speed: 0,  intel: 4, luck: 1 },
    description: "Salvaged from a Corp Drone. Still transmits data, kind of." },
  { id: "bent-steel-rod",       name: "Bent Steel Rod",       type: "weapon",    rarity: 0, zone: "all",
    stats: { attack: 6,  defense: 0, speed: -1, intel: 0, luck: 0 },
    description: "Rebar from the Coliseum ruins. Heavier than it looks." },
  { id: "energy-drink-pack",    name: "Energy Drink Pack",    type: "accessory", rarity: 0, zone: "all",
    stats: { attack: 0,  defense: 0, speed: 3,  intel: 0, luck: 0 },
    description: "Portland-brand 'GLITCH FUEL.' Gives you wings, briefly." },
  { id: "cracked-laptop",       name: "Cracked Laptop",       type: "accessory", rarity: 0, zone: 3,
    stats: { attack: 0,  defense: 0, speed: 0,  intel: 6, luck: 0 },
    description: "Still runs Kali Linux. Barely." },
  { id: "river-contraband",     name: "River Contraband",     type: "accessory", rarity: 0, zone: 4,
    stats: { attack: 0,  defense: 0, speed: 0,  intel: 0, luck: 5 },
    description: "Smuggled goods from upriver. Useful in ways you can't explain." },
  { id: "nopo-switchblade",     name: "NoPo Switchblade",     type: "weapon",    rarity: 0, zone: 5,
    stats: { attack: 7,  defense: 0, speed: 2,  intel: 0, luck: 0 },
    description: "North Portland steel. They forge 'em meaner up here." },
  { id: "transit-shiv",         name: "Transit Pass Shiv",    type: "weapon",    rarity: 0, zone: 7,
    stats: { attack: 4,  defense: 0, speed: 3,  intel: 0, luck: 0 },
    description: "A MAX transit card sharpened to a point. Recycling at its finest." },
  { id: "stimpack",             name: "Stimpack",             type: "accessory", rarity: 0, zone: "all",
    stats: { attack: 2,  defense: 0, speed: 2,  intel: 0, luck: 0 },
    description: "One-shot adrenal boost. Black market medical surplus." },

  // ─── UNCOMMON ─────────────────────────────────────────────────────────────
  { id: "chrome-knuckles",      name: "Chrome Knuckles",      type: "weapon",    rarity: 1, zone: 1,
    stats: { attack: 14, defense: 2, speed: 1,  intel: 0, luck: 0 },
    description: "Polished chrome duster knuckles. Old school, still terrifying." },
  { id: "waterproof-pistol",    name: "Waterproof Pistol",    type: "weapon",    rarity: 1, zone: 4,
    stats: { attack: 16, defense: 0, speed: 2,  intel: 0, luck: 1 },
    description: "Sellwood river-grade pistol. Works after full submersion." },
  { id: "neural-cufflinks",     name: "Neural Cufflinks",     type: "accessory", rarity: 1, zone: 0,
    stats: { attack: 0,  defense: 0, speed: 0,  intel: 12, luck: 2 },
    description: "Pearl District fashion with a side of neural-hack capability." },
  { id: "electro-chain",        name: "Electro-Chain Whip",   type: "weapon",    rarity: 1, zone: 1,
    stats: { attack: 18, defense: 0, speed: 3,  intel: 0, luck: 0 },
    description: "Electricity-conducting chain whip. Wide arc attack." },
  { id: "thermal-goggles",      name: "Thermal Vision Goggles", type: "accessory", rarity: 1, zone: 2,
    stats: { attack: 3,  defense: 0, speed: 0,  intel: 5, luck: 3 },
    description: "See enemies through walls. Heat signatures never lie." },
  { id: "stealth-cloak",        name: "Stealth Cloak",        type: "armor",     rarity: 1, zone: 3,
    stats: { attack: 0,  defense: 6, speed: 4,  intel: 0, luck: 0 },
    description: "Light-bending fabric. Technically illegal in Oregon." },
  { id: "hydraulic-fist",       name: "Hydraulic Fist",       type: "weapon",    rarity: 1, zone: 5,
    stats: { attack: 22, defense: 0, speed: -2, intel: 0, luck: 0 },
    description: "Compressed-air-powered punch. Crumples car doors." },
  { id: "taser-baton",          name: "TriMet Taser Baton",   type: "weapon",    rarity: 1, zone: 7,
    stats: { attack: 15, defense: 3, speed: 0,  intel: 0, luck: 1 },
    description: "Stolen from a MAX security enforcer. 50,000 volts." },
  { id: "canopy-module",        name: "Canopy Stealth Module", type: "accessory", rarity: 1, zone: 6,
    stats: { attack: 0,  defense: 3, speed: 5,  intel: 3, luck: 0 },
    description: "Forest Park drone stealth tech. Bends light around you." },
  { id: "speed-amp-chip",       name: "Speed Amp Chip",       type: "accessory", rarity: 1, zone: 7,
    stats: { attack: 0,  defense: 0, speed: 8,  intel: 0, luck: 0 },
    description: "Neural speed implant. MAX Ghost tech, salvaged." },

  // ─── RARE ─────────────────────────────────────────────────────────────────
  { id: "custom-exploit-deck",  name: "Custom Exploit Deck",  type: "accessory", rarity: 2, zone: 3,
    stats: { attack: 8,  defense: 0, speed: 0,  intel: 20, luck: 5 },
    description: "Hand-compiled zero-day exploits. Crashes enemies' augment software." },
  { id: "plasma-torch",         name: "Plasma Torch",         type: "weapon",    rarity: 2, zone: 5,
    stats: { attack: 30, defense: 0, speed: -1, intel: 5, luck: 0 },
    description: "Industrial plasma cutter repurposed as a weapon. Burns through armor." },
  { id: "anchor-chain",         name: "Ship Anchor Chain",    type: "weapon",    rarity: 2, zone: 4,
    stats: { attack: 28, defense: 5, speed: -3, intel: 0, luck: 0 },
    description: "A full anchor chain repurposed as a whip. Absurdly heavy, absurdly effective." },
  { id: "quantum-processor",    name: "Quantum Processor",    type: "accessory", rarity: 2, zone: 3,
    stats: { attack: 5,  defense: 0, speed: 2,  intel: 25, luck: 3 },
    description: "A stolen quantum chip from a Hawthorne server farm." },
  { id: "gene-splice-serum",    name: "Gene-Splice Serum",    type: "accessory", rarity: 2, zone: 5,
    stats: { attack: 10, defense: 8, speed: 6,  intel: 0, luck: 0 },
    description: "Experimental NoPo bio-augmentation. Unpredictable results." },
  { id: "phase-drive",          name: "Phase Drive Module",   type: "accessory", rarity: 2, zone: 7,
    stats: { attack: 0,  defense: 0, speed: 12, intel: 8, luck: 0 },
    description: "Allows brief quantum phasing. Used by MAX Ghost raiders." },
  { id: "harpoon-gun",          name: "Pressurized Harpoon Gun", type: "weapon", rarity: 2, zone: 4,
    stats: { attack: 32, defense: 0, speed: 1,  intel: 0, luck: 4 },
    description: "Sellwood's signature ranged weapon. Pneumatic, compact, brutal." },
  { id: "plasma-antler",        name: "Plasma Antler Spike",  type: "weapon",    rarity: 2, zone: 6,
    stats: { attack: 35, defense: 0, speed: 0,  intel: 5, luck: 2 },
    description: "Severed from a Bio-Mech Elk. Still crackling with plasma energy." },
  { id: "industrial-plating",   name: "Industrial Plating",   type: "armor",     rarity: 2, zone: 5,
    stats: { attack: 0,  defense: 22, speed: -4, intel: 0, luck: 0 },
    description: "NoPo factory-grade ablative plating. Stops small arms fire." },
  { id: "specter-blade",        name: "Specter's Wraith Blade", type: "weapon",  rarity: 2, zone: 2,
    stats: { attack: 28, defense: 0, speed: 5,  intel: 6, luck: 0 },
    description: "Blade forged from a Coliseum ghost's essence. Phases through light armor." },

  // ─── EPIC ─────────────────────────────────────────────────────────────────
  { id: "kernels-fragment",     name: "Kernel Fragment",      type: "accessory", rarity: 3, zone: 3,
    stats: { attack: 12, defense: 5, speed: 5,  intel: 35, luck: 8 },
    description: "A shard of the Hawthorne Kernel's rogue AI consciousness." },
  { id: "bridge-chain-shackles", name: "Bridge Chain Shackles", type: "weapon", rarity: 3, zone: 5,
    stats: { attack: 45, defense: 10, speed: -2, intel: 0, luck: 5 },
    description: "Spectral iron chains from the St. Johns Bridge Specter. Binds enemies on hit." },
  { id: "plasma-cutlass",       name: "Captain's Plasma Cutlass", type: "weapon", rarity: 3, zone: 4,
    stats: { attack: 48, defense: 5, speed: 4,  intel: 5, luck: 6 },
    description: "Captain Sellwood's personal plasma-edged cutlass. Still warm from his grip." },
  { id: "overseer-crystal",     name: "Overseer Core Crystal", type: "accessory", rarity: 3, zone: 6,
    stats: { attack: 8,  defense: 15, speed: 5, intel: 20, luck: 10 },
    description: "The neural core crystal of the Forest Park Overseer. Pulses with bio-energy." },
  { id: "ghost-train-core",     name: "Ghost Train Engine Core", type: "accessory", rarity: 3, zone: 7,
    stats: { attack: 15, defense: 8, speed: 18, intel: 5, luck: 5 },
    description: "The engine core of the Division Street Phantom's ghost train. Accelerates everything." },

  // ─── LEGENDARY PORTLAND RELICS ────────────────────────────────────────────
  {
    id: "powells-tome",
    name: "Powell's Tome of Forbidden Code",
    type: "relic", rarity: 4, zone: "all", relicId: 1,
    stats: { attack: 15, defense: 10, speed: 5, intel: 50, luck: 10 },
    description: "Stolen from Portland's greatest bookstore. Contains the source code to reality itself. Reduces all skill cooldowns by 40%.",
  },
  {
    id: "voodoo-ring",
    name: "Voodoo Donut Hex Ring",
    type: "relic", rarity: 4, zone: "all", relicId: 2,
    stats: { attack: 20, defense: 20, speed: 10, intel: 20, luck: 40 },
    description: "A cursed sprinkle ring from SE Burnside's famous shop. Applies a random enchantment at the start of each combat — could be incredible or catastrophic.",
  },
  {
    id: "steel-bridge-chainsaw",
    name: "The Steel Bridge Chainsaw",
    type: "relic", rarity: 4, zone: "all", relicId: 3,
    stats: { attack: 70, defense: 5, speed: -5, intel: 0, luck: 5 },
    description: "Forged from the Steel Bridge's lift mechanism. Cleaves through armor like a Willamette current. Arc damage hits all enemies in front.",
  },
  {
    id: "timbers-axe",
    name: "Timbers Axe",
    type: "relic", rarity: 4, zone: "all", relicId: 4,
    stats: { attack: 60, defense: 10, speed: 5, intel: 5, luck: 10 },
    description: "The legendary lumberjack axe of the Portland Timbers. Ground-slam AoE that stuns all nearby enemies for 2 seconds.",
  },
  {
    id: "oracle-staff",
    name: "Burnside Oracle Staff",
    type: "relic", rarity: 4, zone: "all", relicId: 5,
    stats: { attack: 40, defense: 20, speed: 5, intel: 40, luck: 15 },
    description: "The Oracle of Burnside's quantum-crystalline staff. Channels prophetic AoE curses that slow and weaken entire enemy groups.",
  },
  {
    id: "nopo-rail-gun",
    name: "NoPo Rail Gun of Cathedral Park",
    type: "relic", rarity: 4, zone: "all", relicId: 6,
    stats: { attack: 75, defense: 0, speed: 8, intel: 15, luck: 10 },
    description: "Harvested from the gothic spires of St. Johns. Emits high-voltage electromagnetic beams that pierce through all demonic defenses.",
  },

  // ─── DUNGEON FLOOR-SPECIFIC GEAR & WEAPONS ──────────────────────────────────
  // Powell's Data-Crypt Floor Drops
  { id: "archive-dagger", name: "Archive Data-Dagger", type: "weapon", rarity: 1, dungeon: "powells_catacombs", floor: 1,
    stats: { attack: 14, defense: 0, speed: 4, intel: 6, luck: 2 },
    description: "Forged from catalog index blades. Quick stabs siphon encrypted code." },
  { id: "binary-scroll-shield", name: "Binary Codex Shield", type: "armor", rarity: 2, dungeon: "powells_catacombs", floor: 2,
    stats: { attack: 0, defense: 16, speed: -1, intel: 10, luck: 0 },
    description: "Bound in hardbound book covers layered with copper Faraday shielding." },
  { id: "microfiche-visor", name: "Microfiche Optical Visor", type: "accessory", rarity: 2, dungeon: "powells_catacombs", floor: 3,
    stats: { attack: 4, defense: 2, speed: 2, intel: 22, luck: 6 },
    description: "Scans enemy vulnerabilities across 50,000 archived microfiche pages." },
  { id: "lexicon-cipher-blade", name: "Lexicon Cipher Blade", type: "weapon", rarity: 3, dungeon: "powells_catacombs", floor: 4,
    stats: { attack: 38, defense: 4, speed: 5, intel: 25, luck: 5 },
    description: "Pours pure hexadecimal fire across anything it strikes." },

  // Voodoo Hex Chambers Floor Drops
  { id: "sugar-coated-spikes", name: "Sugar-Coated Spikes", type: "weapon", rarity: 1, dungeon: "voodoo_crypt", floor: 1,
    stats: { attack: 16, defense: 0, speed: 3, intel: 0, luck: 8 },
    description: "Hardened caramelized sugar daggers. Sweet, sticky, and lethal." },
  { id: "bacon-maple-mail", name: "Bacon-Maple Carbon Mail", type: "armor", rarity: 2, dungeon: "voodoo_crypt", floor: 2,
    stats: { attack: 2, defense: 20, speed: 1, intel: 0, luck: 10 },
    description: "Ablative body armor cured in sweet synthetic syrup. Deflects slashing blows." },
  { id: "voodoo-hex-doll", name: "Occult Cyber-Doll", type: "accessory", rarity: 2, dungeon: "voodoo_crypt", floor: 3,
    stats: { attack: 8, defense: 5, speed: 0, intel: 18, luck: 18 },
    description: "Infused with rogue cellular packets from Old Town nightclubs." },
  { id: "lich-sprinkle-wand", name: "Baron's Glazed Scepter", type: "weapon", rarity: 3, dungeon: "voodoo_crypt", floor: 4,
    stats: { attack: 44, defense: 6, speed: 2, intel: 30, luck: 15 },
    description: "The pastry lich's primary scepter. Casts necrotic pink confectionery explosions." },

  // Steel Bridge Under-Grid Floor Drops
  { id: "rail-spike-knuckles", name: "Rail-Spike Knuckles", type: "weapon", rarity: 1, dungeon: "steel_bridge_depths", floor: 1,
    stats: { attack: 18, defense: 4, speed: 1, intel: 0, luck: 1 },
    description: "Heavy forged steel railway spikes bound into a combat grip." },
  { id: "lift-gear-buckler", name: "Trunnion Lift Buckler", type: "armor", rarity: 2, dungeon: "steel_bridge_depths", floor: 2,
    stats: { attack: 0, defense: 24, speed: -2, intel: 0, luck: 3 },
    description: "Salvaged from the lower counterweight gearing of the Steel Bridge." },
  { id: "willamette-scuba-rig", name: "Willamette Sub-Breather", type: "accessory", rarity: 2, dungeon: "steel_bridge_depths", floor: 3,
    stats: { attack: 5, defense: 10, speed: 6, intel: 10, luck: 5 },
    description: "Filters toxic river runoff and provides electrical grounding." },
  { id: "hydro-turbine-cleaver", name: "Hydro-Turbine Cleaver", type: "weapon", rarity: 3, dungeon: "steel_bridge_depths", floor: 4,
    stats: { attack: 52, defense: 8, speed: -1, intel: 0, luck: 4 },
    description: "Ripped straight out of the Willamette river power generator. Whirs with devastating momentum." },

  // Providence Blood Colosseum Floor Drops
  { id: "concourse-baton", name: "Concourse Riot Baton", type: "weapon", rarity: 2, dungeon: "providence_arena", floor: 1,
    stats: { attack: 26, defense: 6, speed: 2, intel: 0, luck: 3 },
    description: "Standard stadium security baton upgraded with high-amp capacitors." },
  { id: "turf-cleat-greaves", name: "Synthetic Turf Greaves", type: "armor", rarity: 2, dungeon: "providence_arena", floor: 2,
    stats: { attack: 4, defense: 22, speed: 8, intel: 0, luck: 2 },
    description: "Reinforced stadium armor giving unmatched sprint agility on pavement or turf." },
  { id: "timber-scarf-shroud", name: "Timber Army Battle Shroud", type: "accessory", rarity: 3, dungeon: "providence_arena", floor: 3,
    stats: { attack: 12, defense: 12, speed: 6, intel: 12, luck: 12 },
    description: "Embroidered with resonant green-and-gold runes that rally inner strength." },
  { id: "log-cutter-broadsword", name: "Victory Log Broadsword", type: "weapon", rarity: 3, dungeon: "providence_arena", floor: 4,
    stats: { attack: 56, defense: 10, speed: 0, intel: 0, luck: 8 },
    description: "A colossal greatsword modeled after fresh cedar logs sliced after goals." },

  // Cathedral Spire of St. Johns Drops
  { id: "gothic-gargoyle-shield", name: "Gothic Gargoyle Aegis", type: "armor", rarity: 3, dungeon: "st_johns_spire", floor: 2,
    stats: { attack: 0, defense: 35, speed: -2, intel: 15, luck: 5 },
    description: "Chiseled green stone infused with Cathedral Park electrostatic shielding." },
  { id: "lightning-shade-lance", name: "High-Tension Wire Lance", type: "weapon", rarity: 3, dungeon: "st_johns_spire", floor: 3,
    stats: { attack: 58, defense: 0, speed: 7, intel: 20, luck: 6 },
    description: "A charged steel lance vibrating at 120,000 volts from the suspension cables." },

  // Burnside Concrete Abyss Drops
  { id: "burnside-deck-blade", name: "Grip-Tape Edge Deck", type: "weapon", rarity: 1, dungeon: "burnside_pit", floor: 1,
    stats: { attack: 19, defense: 2, speed: 5, intel: 0, luck: 4 },
    description: "7-ply Canadian maple with a diamond-grit blade along the rails." },
  { id: "rebar-exo-cage", name: "DIY Rebar Exo-Cage", type: "armor", rarity: 2, dungeon: "burnside_pit", floor: 2,
    stats: { attack: 0, defense: 24, speed: -1, intel: 0, luck: 2 },
    description: "Hand-welded concrete reinforcement bars that shield the wearer's torso." },
  { id: "asphalt-core-talisman", name: "Asphalt Core Talisman", type: "accessory", rarity: 2, dungeon: "burnside_pit", floor: 3,
    stats: { attack: 8, defense: 8, speed: 4, intel: 12, luck: 10 },
    description: "A polished pebble of original 1990 Burnside concrete radiating outlaw energy." },
];

/** Generate a random loot drop based on zone tier */
export function generateLootDrop(zoneId, zoneTier) {
  const rarityRolls = {
    low:  [0, 0, 0, 0, 1],           // 80% common, 20% uncommon
    mid:  [0, 0, 1, 1, 2],           // 40% common, 40% uncommon, 20% rare
    high: [0, 1, 1, 2, 2, 3],        // weighted toward rare/epic
    rare: [1, 2, 2, 3, 3, 4],        // starts at uncommon, can get legendary
  };

  const rolls = rarityRolls[zoneTier] || rarityRolls.mid;
  const rarity = rolls[Math.floor(Math.random() * rolls.length)];

  const pool = ITEM_POOL.filter(
    (item) => item.rarity === rarity && (item.zone === "all" || item.zone === zoneId)
  );

  if (pool.length === 0) return ITEM_POOL[0]; // fallback
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Generate targeted dungeon & floor specific loot
 * Drops dungeon specific weapons, armor, relics, or high-tier zone items
 */
export function generateDungeonLoot(dungeonId, floorNumber, isBoss = false) {
  // If boss floor, 65% chance to drop the signature Legendary Relic!
  if (isBoss) {
    const bossRelic = ITEM_POOL.find((item) => item.rarity === 4 && (
      (dungeonId === "powells_catacombs" && item.id === "powells-tome") ||
      (dungeonId === "voodoo_crypt" && item.id === "voodoo-ring") ||
      (dungeonId === "steel_bridge_depths" && item.id === "steel-bridge-chainsaw") ||
      (dungeonId === "providence_arena" && item.id === "timbers-axe") ||
      (dungeonId === "st_johns_spire" && item.id === "nopo-rail-gun") ||
      (dungeonId === "burnside_pit" && item.id === "oracle-staff")
    ));

    if (bossRelic && Math.random() < 0.65) {
      return bossRelic;
    }
  }

  // Look for items specific to this dungeon & floor
  const floorItems = ITEM_POOL.filter(
    (item) => item.dungeon === dungeonId && (item.floor === floorNumber || item.floor === undefined)
  );

  if (floorItems.length > 0 && Math.random() < 0.70) {
    return floorItems[Math.floor(Math.random() * floorItems.length)];
  }

  // Fallback to high tier roll
  const tier = floorNumber >= 4 ? "rare" : floorNumber >= 2 ? "high" : "mid";
  return generateLootDrop("all", tier);
}
