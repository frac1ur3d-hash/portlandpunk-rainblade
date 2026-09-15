// Enemy definitions for all 8 Portland zones
export const ENEMY_TYPES = {
  // ── Zone 0: Pearl District — Corp Drones ───────────────────────────────
  "Corp Drone": {
    name: "Corp Drone", zoneId: 0, tier: "trash",
    hp: 60, damage: 8, speed: 1.2, xpReward: 15, punkReward: 3,
    svgColor: "#00f5ff",
    description: "Mass-produced corporate security drone. Fragile but always comes in numbers.",
    ability: "DataJack Stun",
    lootTable: [
      { item: "Cracked Datajack",    weight: 50 },
      { item: "Corp Keycard",        weight: 30 },
      { item: "Glitch Shard",        weight: 20 },
    ],
  },
  "Corp Executive": {
    name: "Corp Executive", zoneId: 0, tier: "elite",
    hp: 180, damage: 22, speed: 0.8, xpReward: 60, punkReward: 15,
    svgColor: "#00c4cc",
    description: "Augmented middle-management with a money-shield implant.",
    ability: "Credit Shield",
    lootTable: [
      { item: "Executive Sidearm",   weight: 35 },
      { item: "Neural Cufflinks",    weight: 40 },
      { item: "Pearl Blazer Armor",  weight: 25 },
    ],
  },
  "Data Warden": {
    name: "Data Warden", zoneId: 0, tier: "elite",
    hp: 140, damage: 18, speed: 1.0, xpReward: 50, punkReward: 12,
    svgColor: "#0097a7",
    description: "AI-controlled tower guardian protecting Pearl District servers.",
    ability: "Firewall Pulse",
    lootTable: [
      { item: "Warden's Encryption Key", weight: 40 },
      { item: "Server Shard",            weight: 35 },
      { item: "Rare Data Core",          weight: 25 },
    ],
  },
  "The Pearl Specter": {
    name: "The Pearl Specter", zoneId: 0, tier: "boss",
    hp: 1200, damage: 55, speed: 1.4, xpReward: 500, punkReward: 100,
    svgColor: "#00ffff",
    description: "A digital ghost haunting the Pearl's fiber-optic veins. Teleports and phase-shifts.",
    ability: "Phase Shift + Data Barrage",
    lootTable: [
      { item: "Specter's Phantom Blade", weight: 30 },
      { item: "Pearl Relic Fragment",    weight: 50 },
      { item: "Voodoo Donut Hex Ring",   weight: 20, relicId: 2 },
    ],
  },

  // ── Zone 1: Burnside Badlands — Street Punks ────────────────────────────
  "Street Rat": {
    name: "Street Rat", zoneId: 1, tier: "trash",
    hp: 45, damage: 10, speed: 1.8, xpReward: 12, punkReward: 2,
    svgColor: "#ff2d55",
    description: "Fast and desperate. Hits hard before you can react.",
    ability: "Razor Rush",
    lootTable: [
      { item: "Rusty Switchblade",    weight: 55 },
      { item: "Torn Leather Jacket",  weight: 30 },
      { item: "Stolen $PUNK Chip",    weight: 15 },
    ],
  },
  "Burnside Brawler": {
    name: "Burnside Brawler", zoneId: 1, tier: "elite",
    hp: 200, damage: 35, speed: 1.0, xpReward: 65, punkReward: 18,
    svgColor: "#cc2244",
    description: "Chrome-knuckled veteran who has survived ten gang wars on Burnside.",
    ability: "Pile Driver",
    lootTable: [
      { item: "Chrome Knuckles",      weight: 40 },
      { item: "Burnside Biker Vest",  weight: 35 },
      { item: "Pain Stim Injector",   weight: 25 },
    ],
  },
  "Chain Witch": {
    name: "Chain Witch", zoneId: 1, tier: "elite",
    hp: 120, damage: 28, speed: 1.5, xpReward: 55, punkReward: 14,
    svgColor: "#ff6680",
    description: "She swings electrified chains in wide arcs. Keep your distance.",
    ability: "Lightning Lash",
    lootTable: [
      { item: "Electro-Chain Whip",   weight: 45 },
      { item: "Shock Gloves",         weight: 35 },
      { item: "Arc Battery",          weight: 20 },
    ],
  },
  "The Burnside Oracle": {
    name: "The Burnside Oracle", zoneId: 1, tier: "boss",
    hp: 1000, damage: 48, speed: 0.9, xpReward: 450, punkReward: 90,
    svgColor: "#ff0033",
    description: "Ancient mystic who has read the fate of every Burnside gang for 30 years. Curses entire screens.",
    ability: "Prophetic Curse + AoE Hex",
    lootTable: [
      { item: "Burnside Oracle Staff",  weight: 30, relicId: 5 },
      { item: "Cursed Tarot Blade",     weight: 40 },
      { item: "Blood Punk Armor",       weight: 30 },
    ],
  },

  // ── Zone 2: Rose Quarter Ruins — Scavengers ─────────────────────────────
  "Scav Picker": {
    name: "Scav Picker", zoneId: 2, tier: "trash",
    hp: 55, damage: 9, speed: 1.3, xpReward: 13, punkReward: 3,
    svgColor: "#ff9500",
    description: "Opportunistic scavenger picking through old sports coliseum wreckage.",
    ability: "Debris Throw",
    lootTable: [
      { item: "Scavenged Circuit Board", weight: 50 },
      { item: "Bent Steel Rod",          weight: 30 },
      { item: "Old Arena Ticket",        weight: 20 },
    ],
  },
  "Ruin Stalker": {
    name: "Ruin Stalker", zoneId: 2, tier: "elite",
    hp: 160, damage: 25, speed: 1.2, xpReward: 55, punkReward: 13,
    svgColor: "#cc7700",
    description: "Predatory scavenger who has claimed the Coliseum's upper decks as hunting ground.",
    ability: "Ambush Tackle",
    lootTable: [
      { item: "Ruin Stalker Claws",     weight: 40 },
      { item: "Scrap Metal Armor",       weight: 35 },
      { item: "Thermal Vision Goggles",  weight: 25 },
    ],
  },
  "Coliseum Ghost": {
    name: "Coliseum Ghost", zoneId: 2, tier: "elite",
    hp: 130, damage: 20, speed: 1.6, xpReward: 50, punkReward: 12,
    svgColor: "#ffb74d",
    description: "The digital echo of a dead Trail Blazer player. Phase-walks through walls.",
    ability: "Phase Walk",
    lootTable: [
      { item: "Rose Quarter Shield",    weight: 35, relicId: 6 },
      { item: "Ghost Fragment",         weight: 40 },
      { item: "Blazer Jersey Armor",    weight: 25 },
    ],
  },
  "The Memorial Specter": {
    name: "The Memorial Specter", zoneId: 2, tier: "boss",
    hp: 950, damage: 42, speed: 1.1, xpReward: 400, punkReward: 80,
    svgColor: "#ff8c00",
    description: "A colossal spirit fused from every ghost trapped in the Memorial Coliseum's concrete.",
    ability: "Structural Collapse + Soul Drain",
    lootTable: [
      { item: "Rose Quarter Shield",     weight: 40, relicId: 6 },
      { item: "Memorial Coliseum Shard", weight: 35 },
      { item: "Specter's Wraith Blade",  weight: 25 },
    ],
  },

  // ── Zone 3: Hawthorne Hackers — Netrunners ──────────────────────────────
  "Script Kiddie": {
    name: "Script Kiddie", zoneId: 3, tier: "trash",
    hp: 40, damage: 12, speed: 1.1, xpReward: 14, punkReward: 4,
    svgColor: "#30d158",
    description: "Overconfident teenager armed with stolen exploit toolkits.",
    ability: "DDoS Burst",
    lootTable: [
      { item: "Cracked Laptop",         weight: 55 },
      { item: "Basic Exploit Kit",       weight: 30 },
      { item: "Energy Drink Pack",       weight: 15 },
    ],
  },
  "Black Hat Hacker": {
    name: "Black Hat Hacker", zoneId: 3, tier: "elite",
    hp: 150, damage: 30, speed: 1.0, xpReward: 65, punkReward: 16,
    svgColor: "#25a244",
    description: "Serious operator running custom zero-days from a Hawthorne coffee shop.",
    ability: "Neural Override",
    lootTable: [
      { item: "Custom Exploit Deck",    weight: 40 },
      { item: "Black Market RAM",        weight: 35 },
      { item: "Hawthorne Hoodie Armor",  weight: 25 },
    ],
  },
  "Zero-Day Ghost": {
    name: "Zero-Day Ghost", zoneId: 3, tier: "elite",
    hp: 120, damage: 25, speed: 1.3, xpReward: 55, punkReward: 14,
    svgColor: "#00e676",
    description: "AI trained on leaked NSA exploits. Invisible until it strikes.",
    ability: "Invisibility Protocol",
    lootTable: [
      { item: "Zero-Day Exploit Chip",  weight: 45 },
      { item: "Ghost RAM",               weight: 35 },
      { item: "Stealth Cloak",           weight: 20 },
    ],
  },
  "The Hawthorne Kernel": {
    name: "The Hawthorne Kernel", zoneId: 3, tier: "boss",
    hp: 1100, damage: 50, speed: 0.7, xpReward: 480, punkReward: 95,
    svgColor: "#00ff88",
    description: "A rogue AI kernel that has infected every device on SE Hawthorne. It manifests as a crackling humanoid of pure data.",
    ability: "Reality Rewrite + Kernel Panic",
    lootTable: [
      { item: "Powell's Tome of Forbidden Code", weight: 25, relicId: 1 },
      { item: "Kernel Fragment",                 weight: 45 },
      { item: "Quantum Processor",               weight: 30 },
    ],
  },

  // ── Zone 4: Sellwood Syndicate — River Pirates ──────────────────────────
  "River Rat": {
    name: "River Rat", zoneId: 4, tier: "trash",
    hp: 65, damage: 11, speed: 1.4, xpReward: 14, punkReward: 3,
    svgColor: "#0a84ff",
    description: "Low-tier Willamette smuggler. Swims and shoots.",
    ability: "Harpoon Shot",
    lootTable: [
      { item: "Waterproof Pistol",      weight: 50 },
      { item: "Salvaged Life Vest",      weight: 30 },
      { item: "River Contraband",        weight: 20 },
    ],
  },
  "Dock Enforcer": {
    name: "Dock Enforcer", zoneId: 4, tier: "elite",
    hp: 190, damage: 27, speed: 0.9, xpReward: 60, punkReward: 15,
    svgColor: "#0055cc",
    description: "Heavy-set Syndicate boss who controls the Sellwood riverside docks.",
    ability: "Anchor Slam",
    lootTable: [
      { item: "Ship Anchor Chain",       weight: 40 },
      { item: "Dock Boss Coat",          weight: 35 },
      { item: "Pressurized Harpoon Gun", weight: 25 },
    ],
  },
  "Hydrofoil Raider": {
    name: "Hydrofoil Raider", zoneId: 4, tier: "elite",
    hp: 140, damage: 22, speed: 1.7, xpReward: 55, punkReward: 14,
    svgColor: "#40a0ff",
    description: "Speed freak on a cryo-fuel hydrofoil. Attacks in fast drive-by passes.",
    ability: "Drive-By Barrage",
    lootTable: [
      { item: "Hydrofoil Boarding Axe", weight: 45 },
      { item: "Cryo Fuel Cell",          weight: 35 },
      { item: "Wave Rider Armor",        weight: 20 },
    ],
  },
  "Captain Sellwood": {
    name: "Captain Sellwood", zoneId: 4, tier: "boss",
    hp: 1050, damage: 44, speed: 1.2, xpReward: 440, punkReward: 88,
    svgColor: "#0070ff",
    description: "The legendary pirate captain of the Willamette. Fights with a plasma cutlass and calls river-wave attacks.",
    ability: "Tidal Surge + Plasma Cutlass Combo",
    lootTable: [
      { item: "Captain's Plasma Cutlass", weight: 35 },
      { item: "Sellwood Pirate Flag",      weight: 40 },
      { item: "River Shaman Totem",        weight: 25 },
    ],
  },

  // ── Zone 5: NoPo Wastes — Gang Territory ────────────────────────────────
  "NoPo Gangster": {
    name: "NoPo Gangster", zoneId: 5, tier: "trash",
    hp: 75, damage: 14, speed: 1.3, xpReward: 18, punkReward: 5,
    svgColor: "#bf5af2",
    description: "Hardened NoPo street fighter — scarred, augmented, and angry.",
    ability: "Shiv Rush",
    lootTable: [
      { item: "NoPo Switchblade",        weight: 50 },
      { item: "Gang Tag Spray",           weight: 30 },
      { item: "Stimpack",                 weight: 20 },
    ],
  },
  "Industrial Enforcer": {
    name: "Industrial Enforcer", zoneId: 5, tier: "elite",
    hp: 220, damage: 38, speed: 0.8, xpReward: 75, punkReward: 20,
    svgColor: "#9a45d4",
    description: "Mechanically-augmented factory enforcer with steel arms.",
    ability: "Hydraulic Crush",
    lootTable: [
      { item: "Hydraulic Fist",           weight: 40 },
      { item: "Industrial Plating",        weight: 35 },
      { item: "Plasma Torch",              weight: 25 },
    ],
  },
  "Yard Dog": {
    name: "Yard Dog", zoneId: 5, tier: "elite",
    hp: 165, damage: 30, speed: 1.6, xpReward: 65, punkReward: 17,
    svgColor: "#d070ff",
    description: "Half-human, half-attack-dog gene-splice gone wrong. Fast and vicious.",
    ability: "Savage Bite + Pounce",
    lootTable: [
      { item: "Feral Claw Gauntlets",    weight: 45 },
      { item: "Gene-Splice Serum",        weight: 35 },
      { item: "Yard Dog Collar",          weight: 20 },
    ],
  },
  "The St. Johns Bridge Specter": {
    name: "The St. Johns Bridge Specter", zoneId: 5, tier: "boss",
    hp: 1400, damage: 60, speed: 1.0, xpReward: 580, punkReward: 120,
    svgColor: "#cc00ff",
    description: "The gothic spirit of St. Johns Bridge, awakened by NoPo gang rituals. Summons chains of spectral iron.",
    ability: "Gothic Chain Bind + Bridge Collapse",
    lootTable: [
      { item: "NoPo Rail Gun",           weight: 30, relicId: 7 },
      { item: "Bridge Chain Shackles",   weight: 40 },
      { item: "Specter Crown",            weight: 30 },
    ],
  },

  // ── Zone 6: Forest Park Glitch — Feral Drones ───────────────────────────
  "Root Drone": {
    name: "Root Drone", zoneId: 6, tier: "trash",
    hp: 70, damage: 10, speed: 1.1, xpReward: 16, punkReward: 4,
    svgColor: "#ffd60a",
    description: "Drone chassis overgrown with tree roots. Slow but sturdy.",
    ability: "Root Tangle",
    lootTable: [
      { item: "Drone Circuit",           weight: 55 },
      { item: "Bark-Plated Shield",       weight: 30 },
      { item: "Sap Battery",              weight: 15 },
    ],
  },
  "Canopy Hunter": {
    name: "Canopy Hunter", zoneId: 6, tier: "elite",
    hp: 155, damage: 28, speed: 1.4, xpReward: 62, punkReward: 16,
    svgColor: "#cc9f00",
    description: "Drone that drops from tree canopies. Near-invisible before striking.",
    ability: "Canopy Drop Strike",
    lootTable: [
      { item: "Canopy Stealth Module",   weight: 40 },
      { item: "Forest Park Camo Vest",    weight: 35 },
      { item: "Thermal Scanner",          weight: 25 },
    ],
  },
  "Bio-Mech Elk": {
    name: "Bio-Mech Elk", zoneId: 6, tier: "elite",
    hp: 250, damage: 40, speed: 1.3, xpReward: 80, punkReward: 22,
    svgColor: "#ffe066",
    description: "A massive elk fused with military-grade drone chassis. Charges with plasma antlers.",
    ability: "Plasma Antler Charge",
    lootTable: [
      { item: "Plasma Antler Spike",     weight: 40 },
      { item: "Bio-Mech Pelt",            weight: 35 },
      { item: "Forest Amplifier",         weight: 25 },
    ],
  },
  "The Leif Erikson Overseer": {
    name: "The Leif Erikson Overseer", zoneId: 6, tier: "boss",
    hp: 1300, damage: 52, speed: 0.9, xpReward: 540, punkReward: 110,
    svgColor: "#ffdd00",
    description: "The supreme forest AI: an ancient drone colony that has merged into one enormous tree-machine Overseer.",
    ability: "Forest Barrage + Root Network Attack",
    lootTable: [
      { item: "Forest Park Spear",       weight: 30, relicId: 8 },
      { item: "Overseer Core Crystal",   weight: 40 },
      { item: "Ancient Drone Plating",   weight: 30 },
    ],
  },

  // ── Zone 7: MAX Corridor — Transit Raiders ───────────────────────────────
  "Rail Jumper": {
    name: "Rail Jumper", zoneId: 7, tier: "trash",
    hp: 50, damage: 12, speed: 1.9, xpReward: 15, punkReward: 3,
    svgColor: "#ff6961",
    description: "Parkour-augmented raider who hitches MAX trains and leaps at passengers.",
    ability: "Parkour Strike",
    lootTable: [
      { item: "Transit Pass Shiv",        weight: 55 },
      { item: "Rail Grease",              weight: 30 },
      { item: "Augmented Knee Joints",    weight: 15 },
    ],
  },
  "Transit Enforcer": {
    name: "Transit Enforcer", zoneId: 7, tier: "elite",
    hp: 175, damage: 26, speed: 1.0, xpReward: 58, punkReward: 15,
    svgColor: "#cc4444",
    description: "Former TriMet security officer who went rogue, now enforces raider law on the MAX.",
    ability: "Taser Slam",
    lootTable: [
      { item: "TriMet Taser Baton",       weight: 40 },
      { item: "Transit Authority Armor",  weight: 35 },
      { item: "Body Cam Jammer",          weight: 25 },
    ],
  },
  "MAX Ghost": {
    name: "MAX Ghost", zoneId: 7, tier: "elite",
    hp: 110, damage: 22, speed: 2.0, xpReward: 52, punkReward: 13,
    svgColor: "#ff9999",
    description: "Quantum-phased apparition that phases through MAX cars at full speed.",
    ability: "Phase Through + Speed Burst",
    lootTable: [
      { item: "Phase Drive Module",       weight: 45 },
      { item: "Transit Ghost Cloak",      weight: 35 },
      { item: "Speed Amp Chip",           weight: 20 },
    ],
  },
  "The Division Street Phantom": {
    name: "The Division Street Phantom", zoneId: 7, tier: "boss",
    hp: 1000, damage: 46, speed: 1.5, xpReward: 430, punkReward: 85,
    svgColor: "#ff3333",
    description: "A wraith born from every MAX crash that ever happened on Division. Commands a ghost train.",
    ability: "Ghost Train Summon + Phantom Barrage",
    lootTable: [
      { item: "Timbers Axe",              weight: 20, relicId: 4 },
      { item: "Ghost Train Engine Core",  weight: 45 },
      { item: "Division Phantom Shroud",  weight: 35 },
    ],
  },
};
