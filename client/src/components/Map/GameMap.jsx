import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import usePlayerStore from '../../store/playerStore.js';
import useWorldStore from '../../store/worldStore.js';
import useCombatStore from '../../store/combatStore.js';
import { PORTLAND_ZONES, detectZone } from '@shared/zones.js';
import { ENEMY_TYPES } from '@shared/enemies.js';
import { SPRITES, drawPixelSprite } from '../../graphics/pixelSprites.js';
import chiptune from '../../audio/chiptune.js';

import { PORTLAND_DUNGEONS } from '@shared/dungeons.js';
import DungeonRaidModal from '../Dungeons/DungeonRaidModal.jsx';

// Famous real Portland landmarks for relic & boss encounters
const PORTLAND_LANDMARKS = [
  {
    id: "powells_catacombs",
    name: "Powell's City of Books",
    lat: 45.5230, lng: -122.6816,
    icon: "📚",
    relic: "Powell's Tome of Forbidden Code",
    desc: "Legendary multi-story bookstore. Rogue netrunners coded a reality-bending exploit into the rare book room."
  },
  {
    id: "voodoo_crypt",
    name: "Voodoo Doughnut (Old Town)",
    lat: 45.5228, lng: -122.6731,
    icon: "🍩",
    relic: "Voodoo Donut Hex Ring",
    desc: "World-famous 24/7 doughnut haunt. Cursed bacon maple bar recipes infused with chaotic cyber-magic."
  },
  {
    id: "steel_bridge_depths",
    name: "Steel Bridge",
    lat: 45.5278, lng: -122.6685,
    icon: "🌉",
    relic: "The Steel Bridge Chainsaw",
    desc: "Double-deck lift bridge spanning the Willamette. Industrial scavengers salvaged high-torque river saws."
  },
  {
    id: "providence_arena",
    name: "Providence Park (Timbers Field)",
    lat: 45.5216, lng: -122.6917,
    icon: "🪓",
    relic: "Timbers Axe",
    desc: "Historic soccer cathedral. Timber Joey's chainsaw and woodcutter axe fused into an 8-bit relic."
  },
  {
    id: "st_johns_spire",
    name: "St. Johns Bridge",
    lat: 45.5855, lng: -122.7650,
    icon: "🏰",
    relic: "NoPo Rail Gun",
    desc: "Gothic suspension bridge towering over Cathedral Park. The St. Johns Bridge Specter lurks on the towers."
  },
  {
    id: "burnside_pit",
    name: "Burnside Skatepark",
    lat: 45.5229, lng: -122.6628,
    icon: "🛹",
    relic: "Burnside Oracle Staff",
    desc: "Underneath the bridge lies the birthplace of DIY street skate culture and the Burnside Oracle's altar."
  }
];

const CARTO_KEY = 'cb1_311c_1_f8729718e9bb33070a35c358';
const TILE_URLS = {
  voyager: `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${CARTO_KEY}`,
  dark: `https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=${CARTO_KEY}`
};

export default function GameMap() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const playerMarkerRef = useRef(null);
  const enemyMarkersRef = useRef([]);

  const playerLat = usePlayerStore((s) => s.lat);
  const playerLng = usePlayerStore((s) => s.lng);
  const setPosition = usePlayerStore((s) => s.setPosition);
  const currentZone = usePlayerStore((s) => s.currentZone);
  const setCurrentZone = usePlayerStore((s) => s.setCurrentZone);
  const character = usePlayerStore((s) => s.character);

  const enemies = useWorldStore((s) => s.enemies);
  const spawnEnemies = useWorldStore((s) => s.spawnEnemies);
  const killEnemy = useWorldStore((s) => s.killEnemy);
  const startCombat = useCombatStore((s) => s.startCombat);

  const [activeZoneBanner, setActiveZoneBanner] = useState(null);
  const [tileMode, setTileMode] = useState('voyager'); // 'voyager' | 'dark'
  const [gpsActive, setGpsActive] = useState(false);
  const [activeDungeon, setActiveDungeon] = useState(null);

  const classNames = ['samurai', 'netrunner', 'infiltrator', 'shaman'];
  const playerSpriteName = classNames[character?.classId || 0] || 'samurai';

  // Helper to generate a sprite canvas HTML string for Leaflet divIcon
  const createSpriteHtml = (spriteKey, size = 32, label = '') => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const sprite = SPRITES[spriteKey] || SPRITES.samurai;
    drawPixelSprite(ctx, sprite, 0, 0, Math.floor(size / 16));
    const dataUrl = canvas.toDataURL();

    return `
      <div style="text-align: center; cursor: pointer;">
        <img src="${dataUrl}" style="width: ${size}px; height: ${size}px; image-rendering: pixelated; filter: drop-shadow(0 0 6px #00f5ff);" />
        ${label ? `<div style="font-family: 'Press Start 2P', monospace; font-size: 7px; color: #fff; background: rgba(0,0,0,0.8); padding: 1px 3px; border: 1px solid #00f5ff; margin-top: 2px; white-space: nowrap;">${label}</div>` : ''}
      </div>
    `;
  };

  // 1. Initialize OpenStreetMap Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create Leaflet Map centered on downtown Portland, OR
    const map = L.map(mapContainerRef.current, {
      center: [playerLat, playerLng],
      zoom: 14,
      zoomControl: true,
      attributionControl: true,
    });
    mapInstanceRef.current = map;

    // Add CartoDB Tiles with your API Key (defaulting to Voyager)
    const tiles = L.tileLayer(TILE_URLS.voyager, {
      maxZoom: 19,
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors',
      subdomains: 'abcd'
    }).addTo(map);
    tileLayerRef.current = tiles;

    // Click anywhere on Portland streets to walk there
    map.on('click', (e) => {
      handleMoveTo(e.latlng.lat, e.latlng.lng);
    });

    // Add Portland Cyberpunk Zone Boundaries
    PORTLAND_ZONES.forEach((zone) => {
      // GeoJSON is [lng, lat], Leaflet polygon expects [lat, lng]
      const latLngs = zone.bounds?.coordinates?.[0]?.map(([lng, lat]) => [lat, lng]) || [];
      if (latLngs.length === 0) return;

      const polygon = L.polygon(latLngs, {
        color: zone.color,
        fillColor: zone.color,
        fillOpacity: 0.14,
        weight: 2,
        dashArray: '4, 6'
      }).addTo(map);

      polygon.bindPopup(`
        <div style="font-family: 'Press Start 2P', monospace; font-size: 8px; max-width: 180px;">
          <div style="color: ${zone.color}; font-weight: bold;">${zone.name.toUpperCase()}</div>
          <div style="color: #00f5ff; margin: 4px 0;">TIER: ${zone.tier.toUpperCase()}</div>
          <div style="color: #e0e0ff; font-size: 7px; line-height: 1.3;">${zone.factionDesc || ''}</div>
        </div>
      `);
    });

    // Add Portland Landmark Relic Pins
    PORTLAND_LANDMARKS.forEach((lm) => {
      const landmarkIcon = L.divIcon({
        className: 'landmark-pin',
        html: `
          <div style="text-align: center; cursor: pointer; animation: bounce 2s infinite;">
            <div style="font-size: 20px; filter: drop-shadow(0 0 8px #ffd60a);">${lm.icon}</div>
            <div style="font-family: 'Press Start 2P', monospace; font-size: 6px; color: #ffd60a; background: rgba(0,0,0,0.85); border: 1px solid #ffd60a; padding: 1px 2px; white-space: nowrap;">
              ${lm.name.toUpperCase()}
            </div>
            <div style="font-family: 'Press Start 2P', monospace; font-size: 5px; color: #00f5ff; background: rgba(0,0,0,0.9); border: 1px solid #00f5ff; margin-top: 1px;">
              [CLICK TO RAID]
            </div>
          </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 32]
      });

      const marker = L.marker([lm.lat, lm.lng], { icon: landmarkIcon }).addTo(map);
      marker.on('click', () => {
        chiptune.playSelect();
        const dungeonDef = PORTLAND_DUNGEONS.find(d => d.id === lm.id) || PORTLAND_DUNGEONS[0];
        setActiveDungeon(dungeonDef);
      });
    });

    // Initial zone detection & spawn
    const initZone = detectZone(playerLat, playerLng) || PORTLAND_ZONES[0];
    setCurrentZone(initZone);
    spawnEnemies(playerLat, playerLng, initZone.tier);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Real-time GPS Geolocation Tracker
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setGpsActive(true);
        const { latitude, longitude } = pos.coords;
        // Only auto-center if user is within Oregon / Portland region
        if (latitude > 45.0 && latitude < 46.0 && longitude < -122.0 && longitude > -123.5) {
          handleMoveTo(latitude, longitude);
        }
      },
      (err) => {
        setGpsActive(false);
        console.log("GPS Notice (using simulator / click-to-walk):", err.message);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // 3. Move player position and check zones
  const handleMoveTo = (newLat, newLng) => {
    setPosition(newLat, newLng);

    const newZone = detectZone(newLat, newLng);
    if (newZone && newZone.id !== currentZone?.id) {
      setCurrentZone(newZone);
      setActiveZoneBanner(newZone);
      chiptune.playLevelUp();
      spawnEnemies(newLat, newLng, newZone.tier);
      setTimeout(() => setActiveZoneBanner(null), 3000);
    }
  };

  // 4. Update Player Marker on Leaflet Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!playerMarkerRef.current) {
      const playerIcon = L.divIcon({
        className: 'player-div-icon',
        html: createSpriteHtml(playerSpriteName, 36, character?.characterName || 'YOU'),
        iconSize: [36, 44],
        iconAnchor: [18, 36]
      });

      playerMarkerRef.current = L.marker([playerLat, playerLng], { icon: playerIcon, zIndexOffset: 1000 }).addTo(map);
    } else {
      playerMarkerRef.current.setLatLng([playerLat, playerLng]);
      // Smoothly pan map with player
      map.panTo([playerLat, playerLng], { animate: true, duration: 0.5 });
    }
  }, [playerLat, playerLng, playerSpriteName]);

  // 5. Update Enemy Markers on Leaflet Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    enemyMarkersRef.current.forEach((m) => map.removeLayer(m));
    enemyMarkersRef.current = [];

    // Create new markers for enemies on OSM
    enemies.forEach((enemy) => {
      const sprite = enemy.tier === 'boss' ? 'boss_specter' :
        enemy.tier === 'elite' ? 'street_rat' : 'drone';

      const enemyIcon = L.divIcon({
        className: 'enemy-div-icon',
        html: createSpriteHtml(sprite, 32, enemy.tier.toUpperCase()),
        iconSize: [32, 40],
        iconAnchor: [16, 32]
      });

      const marker = L.marker([enemy.lat, enemy.lng], { icon: enemyIcon }).addTo(map);

      marker.on('click', () => {
        engageEnemy(enemy);
      });

      enemyMarkersRef.current.push(marker);
    });
  }, [enemies]);

  const engageEnemy = (enemyInstance) => {
    chiptune.playLaserSlash();
    const zoneEnemies = currentZone?.enemies || ['Corp Drone'];
    const enemyName = zoneEnemies[Math.floor(Math.random() * zoneEnemies.length)];
    const enemyData = ENEMY_TYPES[enemyName] || {
      name: enemyName,
      hp: 120,
      damage: 18,
      speed: 1.2,
      xpReward: 40,
      punkReward: 8,
      tier: enemyInstance.tier || 'trash'
    };

    killEnemy(enemyInstance.id);
    startCombat(enemyData);
  };

  // D-Pad Walker
  const walk = (dLat, dLng) => {
    chiptune.playSelect();
    handleMoveTo(playerLat + dLat, playerLng + dLng);
  };

  return (
    <div className="relative w-full h-full bg-[#05050a] flex flex-col items-center justify-center crt-overlay">
      {/* Zone Transition Banner Popup */}
      {activeZoneBanner && (
        <div className="absolute top-14 z-[2000] pixel-box-cyan p-3 text-center animate-bounce">
          <div className="text-[11px] text-[#00f5ff] font-bold">
            ENTERING {activeZoneBanner.name.toUpperCase()}
          </div>
          <div className="text-[8px] text-white mt-1">
            FACTION: {activeZoneBanner.faction} // TIER: {activeZoneBanner.tier.toUpperCase()}
          </div>
        </div>
      )}

      {/* Main Leaflet Map Container */}
      <div className="relative pixel-box w-full max-w-[900px] h-[540px] overflow-hidden">
        <div
          ref={mapContainerRef}
          className={`w-full h-full ${tileMode === 'neon' ? 'cyber-tiles' : 'dark-matter-tiles'}`}
          style={{ minHeight: '540px' }}
        />

        {/* GPS / Location Status Badge */}
        <div className="absolute top-3 left-4 z-[1000] pixel-box p-2 text-[8px] flex items-center gap-3 bg-black/90">
          <div>
            <span className="text-[#757599]">OPENSTREETMAP GPS: </span>
            <span className="text-[#00f5ff]">{playerLat.toFixed(4)}° N, {Math.abs(playerLng).toFixed(4)}° W</span>
          </div>
          <div>
            <span className="text-[#757599]">ZONE: </span>
            <span style={{ color: currentZone?.color || '#00f5ff' }}>
              {currentZone?.name?.toUpperCase()}
            </span>
          </div>
          <div className="text-[7px]">
            {gpsActive ? (
              <span className="text-[#30d158]">📡 GPS LOCKED</span>
            ) : (
              <span className="text-[#ffd60a]">🕹️ SIMULATOR</span>
            )}
          </div>
        </div>

        {/* Tile Style Toggle */}
        <div className="absolute top-3 right-14 z-[1000] flex gap-2">
          <button
            onClick={() => {
              const nextMode = tileMode === 'voyager' ? 'dark' : 'voyager';
              setTileMode(nextMode);
              if (tileLayerRef.current) {
                tileLayerRef.current.setUrl(TILE_URLS[nextMode]);
              }
              chiptune.playSelect();
            }}
            className="pixel-btn text-[7px] px-2 py-1 bg-black/90 text-[#00f5ff] border-[#00f5ff]"
            title="Toggle Carto Voyager / Dark Matter Map"
          >
            STYLE: {tileMode.toUpperCase()}
          </button>
        </div>

        {/* 8-Bit Retro On-Screen D-Pad Controller */}
        <div className="absolute bottom-4 right-4 z-[1000] pixel-box p-2 bg-black/90 flex flex-col items-center gap-1">
          <button
            onClick={() => walk(0.0025, 0)}
            className="pixel-btn text-[10px] w-[34px] h-[34px] p-0 flex items-center justify-center"
          >
            ▲
          </button>
          <div className="flex gap-1">
            <button
              onClick={() => walk(0, -0.0025)}
              className="pixel-btn text-[10px] w-[34px] h-[34px] p-0 flex items-center justify-center"
            >
              ◀
            </button>
            <button
              onClick={() => walk(-0.0025, 0)}
              className="pixel-btn text-[10px] w-[34px] h-[34px] p-0 flex items-center justify-center"
            >
              ▼
            </button>
            <button
              onClick={() => walk(0, 0.0025)}
              className="pixel-btn text-[10px] w-[34px] h-[34px] p-0 flex items-center justify-center"
            >
              ▶
            </button>
          </div>
          <div className="text-[6px] text-[#757599] mt-0.5">D-PAD WALK</div>
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-[1000] pixel-box p-2 bg-black/90 text-[7px] flex flex-col gap-1 text-[#757599]">
          <div><span className="text-[#00f5ff]">●</span> YOU (CLICK STREET TO WALK)</div>
          <div><span className="text-[#ff2d55]">●</span> ENEMY MARKERS (CLICK TO FIGHT)</div>
          <div><span className="text-[#ffd60a]">📚</span> REAL PORTLAND RELIC SITES</div>
          <div className="text-[6px] text-[#30d158] mt-0.5">100% OPEN-SOURCE (OPENSTREETMAP + LEAFLET)</div>
        </div>
      </div>

      {/* Dungeon Raid Briefing & Telemetry Modal */}
      {activeDungeon && (
        <DungeonRaidModal
          dungeon={activeDungeon}
          onClose={() => setActiveDungeon(null)}
          onEnterDungeon={(dungeon, floorNum, floorData, densityInfo) => {
            setActiveDungeon(null);
            const isBossFloor = floorData.isBoss;
            const enemyName = isBossFloor ? floorData.enemyTypes[0] : `${floorData.enemyTypes[0]} Swarm`;
            const baseHp = isBossFloor ? 300 + (floorNum * 60) : 100 + (floorNum * 25) + ((densityInfo?.demonCount || 5) * 6);

            startCombat({
              id: `dungeon-${dungeon.id}-f${floorNum}-${Date.now()}`,
              name: enemyName,
              hp: baseHp,
              tier: isBossFloor ? 'boss' : 'dungeon_demon',
              speed: isBossFloor ? 1.5 : 1.3,
              damage: 12 + (floorNum * 4),
              attackRate: 1400,
              xpReward: 90 * floorNum,
              punkReward: 25 * floorNum,
              dungeonId: dungeon.id,
              floor: floorNum,
              isBoss: isBossFloor,
              demonsInFloor: (densityInfo?.demonCount || 5) + (floorNum * 2),
            });
          }}
        />
      )}
    </div>
  );
}

