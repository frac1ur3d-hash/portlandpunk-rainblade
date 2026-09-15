/**
 * Portland Dungeon Compendium
 * Each real Portland landmark is an instanced Dungeon with progressive floors/levels,
 * unique demon encounters, dynamic difficulties, and dungeon-specific bosses & relics.
 */

export const PORTLAND_DUNGEONS = [
  {
    id: "powells_catacombs",
    hotspotKey: "powells",
    name: "Powell's Data-Crypt",
    subtitle: "The Infinite Stacks of Forbidden Lore",
    landmarkName: "Powell's City of Books",
    lat: 45.5230,
    lng: -122.6816,
    icon: "📚",
    recommendedLevel: 3,
    difficulty: "Tier 2: Intermediate",
    difficultyColor: "#00f5ff",
    maxFloors: 5,
    floors: [
      { floor: 1, name: "The Rare Book Crypt", enemyCount: 3, enemyTypes: ["Script Imp", "Archive Crawler"] },
      { floor: 2, name: "Floppy Disk Catacombs", enemyCount: 4, enemyTypes: ["Archive Crawler", "Data Poltergeist"] },
      { floor: 3, name: "The Microfiche Vault", enemyCount: 5, enemyTypes: ["Data Poltergeist", "Glitch Stalker"] },
      { floor: 4, name: "Forbidden Manuscript Sanctum", enemyCount: 6, enemyTypes: ["Glitch Stalker", "Corrupted Librarian"] },
      { floor: 5, name: "The Core Lexicon (BOSS)", enemyCount: 1, enemyTypes: ["Arch-Demon Codex Rex"], isBoss: true }
    ],
    relicDrop: "Powell's Tome of Forbidden Code",
    relicStats: { attack: 18, intel: 22 },
    lore: "Over a million printed volumes warped by an infected Wi-Fi mesh. The rare book room turned into a labyrinth of walking binary scripts."
  },
  {
    id: "voodoo_crypt",
    hotspotKey: "voodoo",
    name: "Voodoo Hex Chambers",
    subtitle: "The 24-Hour Sugar Necropolis",
    landmarkName: "Voodoo Doughnut (Old Town)",
    lat: 45.5228,
    lng: -122.6731,
    icon: "🍩",
    recommendedLevel: 5,
    difficulty: "Tier 3: Extreme Danger",
    difficultyColor: "#ff2d55",
    maxFloors: 4,
    floors: [
      { floor: 1, name: "The Glazed Alleyway", enemyCount: 4, enemyTypes: ["Bacon Ghoul", "Sugar Fiend"] },
      { floor: 2, name: "Boiling Oil Vats", enemyCount: 5, enemyTypes: ["Sugar Fiend", "Chant Husk"] },
      { floor: 3, name: "The Pink Box Catacomb", enemyCount: 6, enemyTypes: ["Chant Husk", "Cursed Pastry Golem"] },
      { floor: 4, name: "The Hex Throne (BOSS)", enemyCount: 1, enemyTypes: ["Baron Von Voodoo (Doughnut Lich)"], isBoss: true }
    ],
    relicDrop: "Voodoo Donut Hex Ring",
    relicStats: { attack: 14, luck: 25 },
    lore: "Old Town nightlife crowds emit millions of mobile radio pulses. The occult neon bakeries absorbed the signals to spawn sugar demons."
  },
  {
    id: "steel_bridge_depths",
    hotspotKey: "steel_bridge",
    name: "Steel Bridge Under-Grid",
    subtitle: "The Willamette River Turbine Depths",
    landmarkName: "Steel Bridge",
    lat: 45.5278,
    lng: -122.6685,
    icon: "🌉",
    recommendedLevel: 7,
    difficulty: "Tier 4: Hazardous",
    difficultyColor: "#ff9500",
    maxFloors: 5,
    floors: [
      { floor: 1, name: "Upper Rail Gantry", enemyCount: 4, enemyTypes: ["Rail Jumper", "Spike Drone"] },
      { floor: 2, name: "Lower Lift Mechanism", enemyCount: 5, enemyTypes: ["Spike Drone", "Rust Eater"] },
      { floor: 3, name: "Willamette Pier Foundations", enemyCount: 6, enemyTypes: ["Rust Eater", "River Leech Demon"] },
      { floor: 4, name: "Sub-River Hydro Cables", enemyCount: 7, enemyTypes: ["River Leech Demon", "Turbine Behemoth"] },
      { floor: 5, name: "The Iron Heart (BOSS)", enemyCount: 1, enemyTypes: ["The Steel Leviathan"], isBoss: true }
    ],
    relicDrop: "The Steel Bridge Chainsaw",
    relicStats: { attack: 30, defense: 10 },
    lore: "MAX trains, freight cars, and thousands of commuting smart devices create massive electrical interference along the river."
  },
  {
    id: "providence_arena",
    hotspotKey: "providence_park",
    name: "Providence Blood Colosseum",
    subtitle: "The Echoes of 20,000 Screaming Fans",
    landmarkName: "Providence Park",
    lat: 45.5216,
    lng: -122.6917,
    icon: "🪓",
    recommendedLevel: 8,
    difficulty: "Tier 5: Raid Incursion",
    difficultyColor: "#ffd60a",
    maxFloors: 5,
    floors: [
      { floor: 1, name: "The Concourse Barricades", enemyCount: 5, enemyTypes: ["Hooligan Demon", "Stray Spark"] },
      { floor: 2, name: "Locker Room Catacombs", enemyCount: 6, enemyTypes: ["Stray Spark", "Turf Brute"] },
      { floor: 3, name: "The Pitch (Field of Ash)", enemyCount: 7, enemyTypes: ["Turf Brute", "Sawtooth Phantom"] },
      { floor: 4, name: "Supporters' Roar Stands", enemyCount: 8, enemyTypes: ["Sawtooth Phantom", "Timber Berserker"] },
      { floor: 5, name: "The Goal Post Altar (BOSS)", enemyCount: 1, enemyTypes: ["Timber Joey: Cyber-Lumberjack Primordial"], isBoss: true }
    ],
    relicDrop: "Timbers Axe of Cleaving",
    relicStats: { attack: 35, speed: 12 },
    lore: "The sheer concentration of cell phone signals on match days created a colossal electromagnetic vortex that brought demonic titans to life."
  },
  {
    id: "st_johns_spire",
    hotspotKey: "st_johns_bridge",
    name: "Cathedral Spire of St. Johns",
    subtitle: "Gothic High-Voltage Citadel",
    landmarkName: "St. Johns Bridge",
    lat: 45.5855,
    lng: -122.7650,
    icon: "🏰",
    recommendedLevel: 10,
    difficulty: "Tier 6: Nightmare Spires",
    difficultyColor: "#bf5af2",
    maxFloors: 5,
    floors: [
      { floor: 1, name: "Cathedral Park Crypts", enemyCount: 4, enemyTypes: ["Mist Wraith", "Gargoyle Droid"] },
      { floor: 2, name: "South Gothic Pier", enemyCount: 5, enemyTypes: ["Gargoyle Droid", "Static Harpy"] },
      { floor: 3, name: "Suspension Cable Walkway", enemyCount: 6, enemyTypes: ["Static Harpy", "Lightning Shade"] },
      { floor: 4, name: "North Spire Observation Crown", enemyCount: 7, enemyTypes: ["Lightning Shade", "Sky Siren"] },
      { floor: 5, name: "The Cathedral Crown (BOSS)", enemyCount: 1, enemyTypes: ["Arch-Seraph of the Spires"], isBoss: true }
    ],
    relicDrop: "NoPo Rail Gun of Cathedral Park",
    relicStats: { attack: 42, speed: 18 },
    lore: "Twin gothic towers catch cellular frequencies bouncing off the West Hills, transforming into lightning-infused gargoyle roosts."
  },
  {
    id: "burnside_pit",
    hotspotKey: "burnside_skatepark",
    name: "The Burnside Concrete Abyss",
    subtitle: "The Under-Bridge Anarchy Pit",
    landmarkName: "Burnside Skatepark",
    lat: 45.5229,
    lng: -122.6628,
    icon: "🛹",
    recommendedLevel: 4,
    difficulty: "Tier 2: Street Frenzy",
    difficultyColor: "#30d158",
    maxFloors: 4,
    floors: [
      { floor: 1, name: "Graffiti Halfpipe", enemyCount: 4, enemyTypes: ["Chain Punk", "Skate Fiend"] },
      { floor: 2, name: "Rebar Tunnels", enemyCount: 5, enemyTypes: ["Skate Fiend", "Asphalt Elemental"] },
      { floor: 3, name: "Deep Bowl Reservoir", enemyCount: 6, enemyTypes: ["Asphalt Elemental", "Rogue Shredder"] },
      { floor: 4, name: "The Burnside Core (BOSS)", enemyCount: 1, enemyTypes: ["The Burnside Oracle"], isBoss: true }
    ],
    relicDrop: "Burnside Oracle Staff",
    relicStats: { attack: 20, intel: 20 },
    lore: "Poured by rogue skaters in 1990 without permits, the concrete bowls now reverberate with subterranean cyber pulses."
  }
];
