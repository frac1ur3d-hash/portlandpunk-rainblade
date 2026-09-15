/**
 * Real-Time Cell Density & Digital Demon Density Engine
 * 
 * In PortlandPunk, the demonic cyber-incursion feeds on ambient wireless signals,
 * cell tower density, network traffic, and real-world population activity.
 * 
 * We calculate the estimated active cell phone / mobile connection density for any
 * coordinate or landmark in Portland, Oregon:
 * - Time of day multiplier (lunch rush, evening nightlife, midnight deadzone)
 * - Neighborhood base density (Downtown, Pearl, Old Town, Rose Quarter event nights)
 * - Transit corridor traffic (Pioneer Square hub, MAX light rail stations)
 */

// Baseline mobile device active density (devices per square km / active connections)
export const PORTLAND_CELL_HOTSPOTS = {
  "powells": {
    name: "Powell's City of Books",
    baseDevices: 3400,
    peakHours: [12, 13, 14, 15, 16, 17, 18],
    signalType: "5G Ultra-Wide / Public Wi-Fi Mesh",
    glitchIntensity: "High",
    dangerClass: "Archive Demon Overload"
  },
  "voodoo": {
    name: "Voodoo Doughnut (Old Town)",
    baseDevices: 2800,
    peakHours: [0, 1, 2, 19, 20, 21, 22, 23], // Nightlife late-night rush
    signalType: "Cellular Roaming Cluster",
    glitchIntensity: "Extreme",
    dangerClass: "Cursed Sugar Crypt"
  },
  "steel_bridge": {
    name: "Steel Bridge",
    baseDevices: 1900,
    peakHours: [7, 8, 9, 16, 17, 18], // Commuter rush
    signalType: "Transit Corridor RF Spike",
    glitchIntensity: "Severe",
    dangerClass: "Grid Rail Phantoms"
  },
  "providence_park": {
    name: "Providence Park",
    baseDevices: 5200,
    peakHours: [18, 19, 20, 21, 22], // Match night crowds
    signalType: "Stadium Carrier Aggregation",
    glitchIntensity: "Maximum",
    dangerClass: "Colosseum Titan Swarm"
  },
  "burnside_skatepark": {
    name: "Burnside Skatepark",
    baseDevices: 1600,
    peakHours: [14, 15, 16, 17, 18, 19],
    signalType: "Under-Bridge Rogue Hotspots",
    glitchIntensity: "Unstable",
    dangerClass: "Concrete Demon Pit"
  },
  "st_johns_bridge": {
    name: "St. Johns Bridge",
    baseDevices: 1200,
    peakHours: [10, 11, 12, 13, 14, 15],
    signalType: "High-Elevation Spire RF",
    glitchIntensity: "Eerie",
    dangerClass: "Gothic Spire Haunt"
  },
  "pioneer_square": {
    name: "Pioneer Courthouse Square",
    baseDevices: 6100,
    peakHours: [11, 12, 13, 14, 17, 18],
    signalType: "Central Transit Cellular Core",
    glitchIntensity: "Critical",
    dangerClass: "Downtown Core Incursion"
  }
};

/**
 * Calculate dynamic live cell phone activity and demon spawn density
 * for a given landmark or coordinate.
 */
export function getLiveCellDensity(dungeonKey, customHour = null) {
  const hotspot = PORTLAND_CELL_HOTSPOTS[dungeonKey] || {
    name: "Portland Grid",
    baseDevices: 1500,
    peakHours: [12, 13, 17, 18],
    signalType: "Standard Cellular Coverage",
    glitchIntensity: "Moderate",
    dangerClass: "Roaming Cyber Demons"
  };

  const currentHour = customHour !== null ? customHour : new Date().getHours();
  const isPeak = hotspot.peakHours.includes(currentHour);

  // Time-of-day fluctuation formula
  const timeFactor = isPeak ? 1.45 + (Math.sin(currentHour) * 0.15) : 0.70 + (Math.cos(currentHour) * 0.10);
  
  // Real-time jitter (simulates micro-surges in mobile devices)
  const jitter = 0.92 + (Math.random() * 0.16);

  const estimatedPhones = Math.round(hotspot.baseDevices * timeFactor * jitter);

  // Demon calculation:
  // Every ~150-250 active signals attract 1 wandering digital demon
  const demonMultiplier = estimatedPhones > 4000 ? 0.0035 : 0.0025;
  const demonCount = Math.max(3, Math.min(24, Math.round(estimatedPhones * demonMultiplier)));

  const threatLevel = 
    estimatedPhones > 4500 ? "CODE RED: SWARM" :
    estimatedPhones > 2500 ? "HIGH INFESTATION" :
    estimatedPhones > 1500 ? "MODERATE SURGE" : "LOW GLITCH";

  return {
    ...hotspot,
    currentHour,
    isPeak,
    estimatedPhones,
    demonCount,
    threatLevel,
    demonSpawnRate: (demonCount / 10).toFixed(1)
  };
}
