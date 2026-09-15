// Portland zone definitions with real neighborhood boundaries (GeoJSON polygons)
export const PORTLAND_ZONES = [
  {
    id: 0,
    name: "The Pearl",
    neighborhood: "Pearl District",
    faction: "Corp Drones",
    factionDesc: "Augmented corporate enforcers patrolling the glass towers of the Pearl.",
    color: "#00f5ff",
    darkColor: "#007a80",
    tier: "high",
    xpMultiplier: 1.5,
    enemies: ["Corp Drone", "Corp Executive", "Data Warden"],
    boss: "The Pearl Specter",
    bounds: {
      type: "Polygon",
      coordinates: [[
        [-122.6853, 45.5265], [-122.6853, 45.5320],
        [-122.6730, 45.5320], [-122.6730, 45.5265],
        [-122.6853, 45.5265]
      ]]
    }
  },
  {
    id: 1,
    name: "Burnside Badlands",
    neighborhood: "Old Town / Burnside",
    faction: "Street Punks",
    factionDesc: "Razor-knuckled street crews claiming the neon-lit strip of Burnside.",
    color: "#ff2d55",
    darkColor: "#80162a",
    tier: "mid",
    xpMultiplier: 1.2,
    enemies: ["Street Rat", "Burnside Brawler", "Chain Witch"],
    boss: "The Burnside Oracle",
    bounds: {
      type: "Polygon",
      coordinates: [[
        [-122.6740, 45.5220], [-122.6740, 45.5265],
        [-122.6670, 45.5265], [-122.6670, 45.5220],
        [-122.6740, 45.5220]
      ]]
    }
  },
  {
    id: 2,
    name: "Rose Quarter Ruins",
    neighborhood: "Lloyd / Rose Quarter",
    faction: "Scavengers",
    factionDesc: "Desperate salvagers picking through the bones of the old sports complex.",
    color: "#ff9500",
    darkColor: "#804b00",
    tier: "mid",
    xpMultiplier: 1.1,
    enemies: ["Scav Picker", "Ruin Stalker", "Coliseum Ghost"],
    boss: "The Memorial Specter",
    bounds: {
      type: "Polygon",
      coordinates: [[
        [-122.6670, 45.5260], [-122.6670, 45.5310],
        [-122.6600, 45.5310], [-122.6600, 45.5260],
        [-122.6670, 45.5260]
      ]]
    }
  },
  {
    id: 3,
    name: "Hawthorne Hackers",
    neighborhood: "SE Hawthorne",
    faction: "Netrunners",
    factionDesc: "Indie tech collective weaponizing coffee shop WiFi and dark-web exploits.",
    color: "#30d158",
    darkColor: "#186a2c",
    tier: "high",
    xpMultiplier: 1.6,
    enemies: ["Script Kiddie", "Black Hat Hacker", "Zero-Day Ghost"],
    boss: "The Hawthorne Kernel",
    bounds: {
      type: "Polygon",
      coordinates: [[
        [-122.6550, 45.5120], [-122.6550, 45.5160],
        [-122.6470, 45.5160], [-122.6470, 45.5120],
        [-122.6550, 45.5120]
      ]]
    }
  },
  {
    id: 4,
    name: "Sellwood Syndicate",
    neighborhood: "Sellwood",
    faction: "River Pirates",
    factionDesc: "Willamette River smugglers running contraband in rusted hydrofoils.",
    color: "#0a84ff",
    darkColor: "#054280",
    tier: "mid",
    xpMultiplier: 1.3,
    enemies: ["River Rat", "Dock Enforcer", "Hydrofoil Raider"],
    boss: "Captain Sellwood",
    bounds: {
      type: "Polygon",
      coordinates: [[
        [-122.6530, 45.4730], [-122.6530, 45.4800],
        [-122.6450, 45.4800], [-122.6450, 45.4730],
        [-122.6530, 45.4730]
      ]]
    }
  },
  {
    id: 5,
    name: "NoPo Wastes",
    neighborhood: "North Portland",
    faction: "Gang Territory",
    factionDesc: "The most dangerous territory in Portland — raw gang warfare and industrial chaos.",
    color: "#bf5af2",
    darkColor: "#602d79",
    tier: "high",
    xpMultiplier: 2.0,
    enemies: ["NoPo Gangster", "Industrial Enforcer", "Yard Dog"],
    boss: "The St. Johns Bridge Specter",
    bounds: {
      type: "Polygon",
      coordinates: [[
        [-122.7200, 45.5600], [-122.7200, 45.5720],
        [-122.7050, 45.5720], [-122.7050, 45.5600],
        [-122.7200, 45.5600]
      ]]
    }
  },
  {
    id: 6,
    name: "Forest Park Glitch",
    neighborhood: "NW / Forest Park",
    faction: "Feral Drones",
    factionDesc: "Decommissioned military drones gone feral, merged with the forest ecosystem.",
    color: "#ffd60a",
    darkColor: "#806b05",
    tier: "rare",
    xpMultiplier: 1.8,
    enemies: ["Root Drone", "Canopy Hunter", "Bio-Mech Elk"],
    boss: "The Leif Erikson Overseer",
    bounds: {
      type: "Polygon",
      coordinates: [[
        [-122.7500, 45.5350], [-122.7500, 45.5600],
        [-122.7200, 45.5600], [-122.7200, 45.5350],
        [-122.7500, 45.5350]
      ]]
    }
  },
  {
    id: 7,
    name: "MAX Corridor",
    neighborhood: "Division / Powell",
    faction: "Transit Raiders",
    factionDesc: "Cybernetically-enhanced raiders who ride — and raid — Portland's MAX lines.",
    color: "#ff6961",
    darkColor: "#803430",
    tier: "mid",
    xpMultiplier: 1.4,
    enemies: ["Rail Jumper", "Transit Enforcer", "MAX Ghost"],
    boss: "The Division Street Phantom",
    bounds: {
      type: "Polygon",
      coordinates: [[
        [-122.6550, 45.5040], [-122.6550, 45.5090],
        [-122.6400, 45.5090], [-122.6400, 45.5040],
        [-122.6550, 45.5040]
      ]]
    }
  }
];

/** Check if a lat/lng point falls inside any Portland zone */
export function detectZone(lat, lng) {
  for (const zone of PORTLAND_ZONES) {
    if (pointInPolygon([lng, lat], zone.bounds.coordinates[0])) {
      return zone;
    }
  }
  return null;
}

/** Ray-casting point-in-polygon test */
function pointInPolygon(point, polygon) {
  const [px, py] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersect = ((yi > py) !== (yj > py)) &&
      (px < ((xj - xi) * (py - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}
