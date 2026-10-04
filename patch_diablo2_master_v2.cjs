// patch_diablo2_master_v2.cjs
// Complete implementation of all Director specifications and bug fixes for rain-blade.html

const fs = require('fs');
const path = require('path');

const targetPath = path.resolve('client/public/rain-blade.html');
let html = fs.readFileSync(targetPath, 'utf8');

console.log('Patching rain-blade.html...');

// =============================================================================
// 1. ADD NEW GROTESQUE MONSTER ROSTER TO MONSTER_ROSTER & APEX_BOSS_TEMPLATES
// =============================================================================
const newMonstersCode = `
      // === GROTESQUE PORTLAND MUTANT ROSTER (Kyle McLeod Director Specs) ===
      {
        typeId: 'fentanyl_sludge_titan',
        name: 'The Fentanyl Sludge Titan',
        role: 'brute',
        spriteKey: 'sludge_titan',
        baseHp: 650,
        baseSpeed: 2.1,
        baseDmg: 38,
        radius: 32,
        color: '#064e3b',
        accentColor: '#10b981',
        minTier: 2,
        chargeCooldown: 3.8,
        shootCooldown: 2.4,
        xpReward: 260,
        beanReward: 120
      },
      {
        typeId: 'willamette_leech_gargoyle',
        name: 'Willamette Leech-Gargoyle',
        role: 'assassin',
        spriteKey: 'leech_gargoyle',
        baseHp: 180,
        baseSpeed: 4.4,
        baseDmg: 26,
        radius: 20,
        color: '#0284c7',
        accentColor: '#38bdf8',
        minTier: 2,
        shootCooldown: 3.2,
        xpReward: 130,
        beanReward: 60
      },
      {
        typeId: 'needle_broodmother_82nd',
        name: 'The 82nd Needle Broodmother',
        role: 'brute',
        spriteKey: 'broodmother',
        baseHp: 580,
        baseSpeed: 2.3,
        baseDmg: 32,
        radius: 29,
        color: '#831843',
        accentColor: '#f43f5e',
        minTier: 3,
        shootCooldown: 1.8,
        xpReward: 240,
        beanReward: 110
      },
      {
        typeId: 'burnside_scrap_golem',
        name: 'Burnside Scrap Golem',
        role: 'brute',
        spriteKey: 'scrap_golem',
        baseHp: 460,
        baseSpeed: 2.0,
        baseDmg: 35,
        radius: 28,
        color: '#78350f',
        accentColor: '#f59e0b',
        minTier: 2,
        chargeCooldown: 3.2,
        xpReward: 180,
        beanReward: 80
      },
      {
        typeId: 'shanghai_tunnel_flayer',
        name: 'Shanghai Tunnel Flayer',
        role: 'assassin',
        spriteKey: 'tunnel_flayer',
        baseHp: 210,
        baseSpeed: 4.7,
        baseDmg: 34,
        radius: 19,
        color: '#4c0519',
        accentColor: '#fb7185',
        minTier: 2,
        chargeCooldown: 2.8,
        xpReward: 170,
        beanReward: 75
      },
`;

if (!html.includes('The Fentanyl Sludge Titan')) {
  html = html.replace("const MONSTER_ROSTER = [", "const MONSTER_ROSTER = [" + newMonstersCode);
  console.log('✓ Added 5 Grotesque Monsters to MONSTER_ROSTER');
}

// Add Bovine Multiverse Overlord to APEX_BOSS_TEMPLATES
const bovineBoss = `
      cow_level: {
        name: 'The Bovine Multiverse Overlord',
        title: 'Lord of the Secret Multiverse Fetty Realm',
        hp: 1950,
        speed: 2.8,
        dmg: 48,
        radius: 46,
        color: '#eab308',
        accentColor: '#facc15'
      },
`;

if (!html.includes('The Bovine Multiverse Overlord')) {
  html = html.replace("const APEX_BOSS_TEMPLATES = {", "const APEX_BOSS_TEMPLATES = {" + bovineBoss);
  console.log('✓ Added Bovine Multiverse Overlord to APEX_BOSS_TEMPLATES');
}

// =============================================================================
// 2. PREVENT APEX BOSS SPONS AT SANCTUARY AND SELLWOOD CHECKPOINT
// =============================================================================
html = html.replace(
  "map.landmarks.forEach(lm => {",
  "map.landmarks.forEach(lm => {\n        // Do not spawn apex bosses at Sanctuary Safehouse Hub or Sellwood checkpoint\n        if (lm.isSanctuary || lm.isSellwood) return;"
);
console.log('✓ Prevented landmark bosses spawning at Sanctuary or Sellwood Checkpoint');

// =============================================================================
// 3. ENHANCE PLAYER COLLISION FOR RESIDENCE MODE
// =============================================================================
const smoothCollisionOld = `          // Smooth sliding collision with Portland World Map
          if (gameState.worldMap) {
            const wm = gameState.worldMap;
            const curTile = wm.worldToTile(p.x, p.y);
            const curWalkable = wm.isWalkable(curTile.c, curTile.r);

            // Auto-unstick fail-safe if pushed or spawned out of bounds
            if (!curWalkable) {
              const safe = wm.findNearestWalkable(p.x, p.y);
              const udx = safe.wx - p.x;
              const udy = safe.wy - p.y;
              const udist = Math.hypot(udx, udy) || 1;
              p.x += (udx / udist) * (currentSpeed * 1.5);
              p.y += (udy / udist) * (currentSpeed * 1.5);
            } else {
              // Independent axis movement for ultra-smooth wall sliding
              const nextX = p.x + p.vx;
              if (wm.isWorldWalkable(nextX, p.y, 8)) {
                p.x = nextX;
              }
              const nextY = p.y + p.vy;
              if (wm.isWorldWalkable(p.x, nextY, 8)) {
                p.y = nextY;
              }
            }
          } else {
            p.x += p.vx;
            p.y += p.vy;
          }`;

const smoothCollisionNew = `          // Mode-Aware Collision: Safehouse Sanctuary vs Urban Overworld vs Dungeon
          if (gameState.mode === 'residence') {
            // Sanctuary room bounds (720x580): [-340, 340] x [-270, 270]
            p.x = Math.max(-340, Math.min(340, p.x + p.vx));
            p.y = Math.max(-270, Math.min(270, p.y + p.vy));

            // Stepping on southern exit portal ring at (0, 240)
            if (Math.hypot(p.x - 0, p.y - 240) < 42) {
              exitSanctuaryToPortlandStreetGrid();
            }
          } else if (gameState.worldMap) {
            const wm = gameState.worldMap;
            const curTile = wm.worldToTile(p.x, p.y);
            const curWalkable = wm.isWalkable(curTile.c, curTile.r);

            if (!curWalkable) {
              const safe = wm.findNearestWalkable(p.x, p.y);
              const udx = safe.wx - p.x;
              const udy = safe.wy - p.y;
              const udist = Math.hypot(udx, udy) || 1;
              p.x += (udx / udist) * (currentSpeed * 1.5);
              p.y += (udy / udist) * (currentSpeed * 1.5);
            } else {
              const nextX = p.x + p.vx;
              if (wm.isWorldWalkable(nextX, p.y, 8)) {
                p.x = nextX;
              }
              const nextY = p.y + p.vy;
              if (wm.isWorldWalkable(p.x, nextY, 8)) {
                p.y = nextY;
              }
            }
          } else {
            p.x += p.vx;
            p.y += p.vy;
          }`;

if (html.includes(smoothCollisionOld)) {
  html = html.replace(smoothCollisionOld, smoothCollisionNew);
  console.log('✓ Updated player movement collision to be mode-aware');
}

// Also update the stationary auto-unstick check:
html = html.replace(
  "if (gameState.worldMap) {\n            const wm = gameState.worldMap;\n            const curTile = wm.worldToTile(p.x, p.y);",
  "if (gameState.mode !== 'residence' && gameState.worldMap) {\n            const wm = gameState.worldMap;\n            const curTile = wm.worldToTile(p.x, p.y);"
);

// =============================================================================
// 4. PERSISTENT OVERWORLD MAP & 2-TIER FOG OF WAR ENGINE
// =============================================================================
// Ensure initWorldMap preserves persistentWorldMap
const initWorldMapOld = `    function initWorldMap(seed) {
      gameState.worldSeed = seed || (Date.now() % 100000);
      gameState.worldMap = new PortlandMapGenerator(gameState.worldSeed);
      gameState.worldMap.generate();
      populateDungeonMonsters(gameState.worldMap);

      const seedTag = document.getElementById('minimapSeedTag');
      if (seedTag) seedTag.textContent = \`SEED: \${gameState.worldSeed}\`;
      const worldSeedDisplay = document.getElementById('currentWorldSeedDisplay');
      if (worldSeedDisplay) worldSeedDisplay.textContent = gameState.worldSeed;
    }`;

const initWorldMapNew = `    function initWorldMap(seed) {
      gameState.worldSeed = seed || (Date.now() % 100000);
      if (!gameState.persistentWorldMap) {
        gameState.persistentWorldMap = new PortlandMapGenerator(gameState.worldSeed);
        gameState.persistentWorldMap.generate();
        populateDungeonMonsters(gameState.persistentWorldMap);
      }
      gameState.worldMap = gameState.persistentWorldMap;

      const seedTag = document.getElementById('minimapSeedTag');
      if (seedTag) seedTag.textContent = \`SEED: \${gameState.worldSeed}\`;
      const worldSeedDisplay = document.getElementById('currentWorldSeedDisplay');
      if (worldSeedDisplay) worldSeedDisplay.textContent = gameState.worldSeed;
    }`;

if (html.includes(initWorldMapOld)) {
  html = html.replace(initWorldMapOld, initWorldMapNew);
  console.log('✓ Updated initWorldMap to retain persistent exploration bitmask');
}

// Implement drawFogOfWarPass(w, h)
const fogOfWarPassFunc = `
    // =========================================================================
    // 🌫️ 2-TIER PERSISTENT FOG OF WAR VIEWPORT PASS
    // Unexplored: Pitch Black | Memory Explored: Blueprint Veil | LOS: Bright
    // =========================================================================
    function drawFogOfWarPass(cw, ch) {
      if (gameState.mode !== 'overworld' || !gameState.worldMap || !gameState.worldMap.explored) return;
      const map = gameState.worldMap;
      const p = gameState.player;
      const cam = gameState.camera;
      const ts = map.tileSize;

      const left = cam.x;
      const top = cam.y;
      const right = left + cw;
      const bottom = top + ch;

      const startC = Math.max(0, Math.floor((left + map.originX) / ts));
      const endC = Math.min(map.cols - 1, Math.ceil((right + map.originX) / ts));
      const startR = Math.max(0, Math.floor((top + map.originY) / ts));
      const endR = Math.min(map.rows - 1, Math.ceil((bottom + map.originY) / ts));

      const losRadiusSq = 360 * 360;

      ctx.save();
      for (let r = startR; r <= endR; r++) {
        for (let c = startC; c <= endC; c++) {
          const isExp = map.explored[r * map.cols + c];
          const wx = (c * ts) - map.originX;
          const wy = (r * ts) - map.originY;

          if (!isExp) {
            // Pitch Black Unexplored Void
            ctx.fillStyle = '#020617';
            ctx.fillRect(wx, wy, ts + 0.5, ts + 0.5);
          } else {
            // Explored Memory: Dimmed blueprint veil if outside player active line of sight
            const tileCenterX = wx + ts / 2;
            const tileCenterY = wy + ts / 2;
            const distSq = (p.x - tileCenterX) * (p.x - tileCenterX) + (p.y - tileCenterY) * (p.y - tileCenterY);
            if (distSq > losRadiusSq) {
              ctx.fillStyle = 'rgba(2, 6, 23, 0.60)';
              ctx.fillRect(wx, wy, ts + 0.5, ts + 0.5);
            }
          }
        }
      }
      ctx.restore();
    }
`;

if (!html.includes('function drawFogOfWarPass')) {
  html = html.replace('function drawUrbanEnvironment', fogOfWarPassFunc + '\n    function drawUrbanEnvironment');
  console.log('✓ Injected drawFogOfWarPass');
}

// Call drawFogOfWarPass in render()
if (!html.includes('drawFogOfWarPass(w, h)')) {
  html = html.replace(
    'drawUrbanEnvironment(w, h);\n        drawDungeonInteractables();',
    'drawUrbanEnvironment(w, h);\n        drawFogOfWarPass(w, h);\n        drawDungeonInteractables();'
  );
  console.log('✓ Hooked drawFogOfWarPass into render()');
}

// =============================================================================
// 5. ACCURATE PORTLAND DISTRICT LOCATOR & MINIMAP ASPECT RATIO FIX
// =============================================================================
const districtLocatorFunc = `
    function getPortlandDistrictName(wx, wy, map) {
      if (!map) return 'PORTLAND';
      const { c, r } = map.worldToTile(wx, wy);
      if (r >= 132 && c <= 75) return 'SELLWOOD (QUARANTINE)';
      if (c >= 165) return 'POWELLHURST-GILBERT';
      if (c >= 142 && c < 165 && r >= 88 && r <= 118) return 'KELLY BUTTE';
      if (c >= 132 && r >= 112) return 'LENTS CENTER';
      if (c >= 120 && c < 135) return '82ND AVE STRIP';
      if (c >= 94 && c < 118 && r >= 95) return 'FOSTER-POWELL';
      if (c < 22 && r < 38) return 'FOREST PARK';
      if (c < 32 && r >= 22 && r < 40) return 'PEARL DISTRICT';
      if (c < 32 && r >= 40 && r <= 58) return 'OLD TOWN CHINATOWN';
      if (c >= 32 && c <= 41) return 'WILLAMETTE BRIDGES';
      if (r <= 64 && c >= 42 && c < 90) return 'E BURNSIDE';
      if (r >= 65 && r <= 88 && c >= 42 && c < 100) return 'HAWTHORNE / BELMONT';
      if (r > 88 && r <= 120 && c >= 60 && c < 100) return 'CRESTON-KENILWORTH';
      return 'PORTLAND METRO';
    }
`;

if (!html.includes('function getPortlandDistrictName')) {
  html = html.replace('function updateMinimapRadar', districtLocatorFunc + '\n    function updateMinimapRadar');
  console.log('✓ Added getPortlandDistrictName helper');
}

// Update updateMinimapRadar implementation
const minimapOld = `      // Update District Header Tag
      let distName = 'BURNSIDE HUB';
      if (p.x < -200 && p.y < -200) distName = 'CHINATOWN';
      else if (p.x > 200 && p.y < -200) distName = 'EASTSIDE SKATE';
      else if (p.x < -200 && p.y > 200) distName = 'FOREST PARK';
      else if (p.x > 200 && p.y > 200) distName = 'HAWTHORNE';
      const tagEl = document.getElementById('minimapDistrictTag');
      if (tagEl && tagEl.textContent !== distName) tagEl.textContent = distName;`;

const minimapNew = `      // Update District Header Tag with authentic Portland coordinates
      let distName = getPortlandDistrictName(p.x, p.y, map);
      const tagEl = document.getElementById('minimapDistrictTag');
      if (tagEl && tagEl.textContent !== distName) tagEl.textContent = distName;`;

if (html.includes(minimapOld)) {
  html = html.replace(minimapOld, minimapNew);
  console.log('✓ Fixed minimap district locator logic');
}

// Fix scaleX and scaleY in updateMinimapRadar
html = html.replace(
  "const scale = w / map.cols; // 128 / 64 = 2px\n      for (let r = 0; r < map.rows; r++) {",
  "const scaleX = w / map.cols;\n      const scaleY = h / map.rows;\n      for (let r = 0; r < map.rows; r++) {"
);
html = html.replace(
  "ctx2.fillRect(c * scale, r * scale, scale, scale);",
  "ctx2.fillRect(c * scaleX, r * scaleY, scaleX + 0.2, scaleY + 0.2);"
);
html = html.replace(
  "ctx2.fillRect(c * scale, r * scale, scale, scale);",
  "ctx2.fillRect(c * scaleX, r * scaleY, scaleX + 0.2, scaleY + 0.2);"
);
html = html.replace(
  "ctx2.translate(heroC * chevronScale, heroR * chevronScale);",
  "const chevronScaleX = w / map.cols;\n      const chevronScaleY = h / map.rows;\n      ctx2.translate(heroC * chevronScaleX, heroR * chevronScaleY);"
);
console.log('✓ Fixed minimap coordinate scaling & aspect ratio');

// =============================================================================
// 6. CINEMATIC HOLY NARCAN EXORCISM & SECRET MULTIVERSE PORTAL (COW LEVEL)
// =============================================================================
const narcanExorcismCode = `
    // =========================================================================
    // 💉 CINEMATIC HOLY NARCAN EXORCISM & MULTIVERSE COW LEVEL RIFT
    // =========================================================================
    function administerNarcanToZombie(zombie) {
      zombie.isExorcising = true;
      zombie.exorcismTimer = 10.0;
      zombie.maxExorcismTimer = 10.0;
      zombie.patientHp = 240;
      zombie.patientMaxHp = 240;
      zombie.origSpeed = zombie.speed;
      zombie.speed = 0.2;
      zombie.siegeWave = 1;
      
      // 30% chance for rare Multiverse dimensional fetty zombie
      if (Math.random() < 0.32 || zombie.isMultiverse) {
        zombie.isMultiverse = true;
        zombie.name = "✨ [MULTIVERSE DIMENSIONAL] Fetty Zombie";
      }

      playSound('special');
      playSound('level');
      addFloatingText("⚡ PRECIPITATED WITHDRAWAL CONVULSIONS!", zombie.x, zombie.y - 32, '#f43f5e', 18);
      triggerWaveAnnouncement("⚡ NARCAN EXORCISM INITIATED", "DEFEND CONVULSING PATIENT! Wave 1/2 Incoming");
      showToast("💉 Narcan injected! Defend patient against converging zombie hordes!", "warning", true);
      triggerTelegramHaptic('notification', 'warning');

      // Spawn Wave 1 Defensive Siege Horde around patient
      spawnExorcismDefenders(zombie.x, zombie.y, 6);
    }

    function spawnExorcismDefenders(cx, cy, count) {
      if (!gameState.enemies) gameState.enemies = [];
      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const d = 180 + Math.random() * 260;
        const ex = cx + Math.cos(ang) * d;
        const ey = cy + Math.sin(ang) * d;
        gameState.enemies.push({
          archetypeId: 'fetty_zombie',
          role: 'swarmer',
          name: 'Rabid Fetty Zombie',
          x: ex,
          y: ey,
          spawnX: ex,
          spawnY: ey,
          vx: 0,
          vy: 0,
          hp: 85,
          maxHp: 85,
          radius: 17,
          speed: 3.1,
          damage: 14,
          color: '#10b981',
          accentColor: '#fbbf24',
          isAggro: true,
          hitFlash: 0
        });
      }
    }

    // Secret Multiverse Fetty Realm (Cow Level)
    function enterMultiverseCowLevel() {
      if (!gameState.worldMap) initWorldMap(gameState.worldSeed);
      gameState.overworldReturn = { x: gameState.player.x, y: gameState.player.y };
      gameState.mode = 'dungeon';
      gameState.currentDungeon = {
        id: 'cow_level',
        name: 'Secret Multiverse Fetty Realm',
        districtId: 'cow_level',
        bossName: 'The Bovine Multiverse Overlord',
        floor: 1,
        maxFloors: 1,
        isCowLevel: true,
        hasBossKey: true,
        keymasterDefeated: true,
        bossDefeated: false,
        zombiesPurged: 0,
        zombiesTarget: 25,
        civiliansSaved: 0,
        civiliansTarget: 0
      };

      loadDungeonFloor(1);
      
      // Override floor with surreal neon pasture arena
      const dMap = gameState.worldMap;
      for (let r = 2; r < dMap.rows - 2; r++) {
        for (let c = 2; c < dMap.cols - 2; c++) {
          dMap.setTile(c, r, 5); // Emerald cyber-grass
        }
      }

      // Populate with Level-Scaled Bovine Fetty Zombie herds
      gameState.enemies = [];
      for (let i = 0; i < 24; i++) {
        const ang = Math.random() * Math.PI * 2;
        const dist = 120 + Math.random() * 450;
        gameState.enemies.push({
          archetypeId: 'bovine_fetty',
          role: 'swarmer',
          name: '🐮 Bovine Fetty Zombie ("MOOO...")',
          x: Math.cos(ang) * dist,
          y: Math.sin(ang) * dist,
          spawnX: Math.cos(ang) * dist,
          spawnY: Math.sin(ang) * dist,
          vx: 0,
          vy: 0,
          hp: 140,
          maxHp: 140,
          radius: 19,
          speed: 3.3,
          damage: 16,
          color: '#fbbf24',
          accentColor: '#f59e0b',
          isAggro: true,
          hitFlash: 0,
          xpReward: 90,
          beanReward: 50
        });
      }

      // Spawn Apex Boss: The Bovine Multiverse Overlord
      const bTemp = APEX_BOSS_TEMPLATES.cow_level;
      gameState.enemies.push({
        archetypeId: 'apex_boss',
        role: 'boss',
        isBoss: true,
        isElite: true,
        name: bTemp.name,
        title: bTemp.title,
        x: 0,
        y: -300,
        spawnX: 0,
        spawnY: -300,
        vx: 0,
        vy: 0,
        hp: bTemp.hp,
        maxHp: bTemp.hp,
        radius: bTemp.radius,
        speed: bTemp.speed,
        damage: bTemp.dmg,
        color: bTemp.color,
        accentColor: bTemp.accentColor,
        isAggro: true,
        attackCd: 1.0,
        specialAttackTimer: 2.5,
        xpReward: 900,
        beanReward: 500,
        hitFlash: 0
      });

      const bossBarEl = document.getElementById('bossHealthBarContainer');
      const bossNameEl = document.getElementById('bossHealthName');
      const bossSubEl = document.getElementById('bossHealthSub');
      if (bossBarEl) bossBarEl.classList.remove('hidden');
      if (bossNameEl) bossNameEl.textContent = bTemp.name.toUpperCase();
      if (bossSubEl) bossSubEl.textContent = 'Secret Multiverse Fetty Realm · Cow Level';

      triggerWaveAnnouncement("🐮 SECRET MULTIVERSE REALM!", "There is no Cow Level... Or is there?");
      playSound('level');
      showToast("🐮 Entered Secret Multiverse Fetty Realm! Slay Bovine Overlord!", "success", true);
    }
`;

if (!html.includes('enterMultiverseCowLevel')) {
  html = html.replace('function updateExorcisms', narcanExorcismCode + '\n    function updateExorcisms');
  console.log('✓ Injected Cinematic Narcan Exorcism & Multiverse Cow Level logic');
}

// Update updateExorcisms logic for 2-wave siege, bio-vomit puddles, and dimensional rifts
const exorcismUpdateOld = `    function updateExorcisms(dt) {
      if (!gameState.enemies || gameState.enemies.length === 0) return;
      const p = gameState.player;

      for (let i = gameState.enemies.length - 1; i >= 0; i--) {
        const e = gameState.enemies[i];
        if (e && e.isExorcising) {
          e.exorcismTimer -= dt;

          if (Math.random() < 0.35) {
            createImpactParticles(e.x, e.y, '#84cc16', 3);
            createImpactParticles(e.x, e.y, '#78350f', 2);
            if (Math.hypot(p.x - e.x, p.y - e.y) < 65) {
              p.hp = Math.max(1, p.hp - (6 * dt));
              updateHUD();
            }
          }

          if (e.exorcismTimer <= 0) {
            e.isExorcising = false;
            const citizenX = e.x;
            const citizenY = e.y;
            gameState.enemies.splice(i, 1);

            const curedCitizen = {
              x: citizenX,
              y: citizenY,
              name: 'Rescued Resident',
              rescued: true
            };
            gameState.rescuedCitizens.push(curedCitizen);
            p.beans += 120;
            p.xp += 150;
            playSound('coin');
            playSound('level');
            createImpactParticles(citizenX, citizenY, '#38bdf8', 30);
            addFloatingText("🕊️ CITIZEN REHABILITATED! +120 BEANS", citizenX, citizenY - 35, '#38bdf8', 19);
            showToast("🕊️ Exorcism Successful! A human life was saved.", "success", true);
            triggerTelegramHaptic('notification', 'success');

            if (gameState.currentDungeon) {
              gameState.currentDungeon.civiliansSaved = (gameState.currentDungeon.civiliansSaved || 0) + 1;
              updateQuestTrackerUI();
            }
          }
        }
      }
    }`;

const exorcismUpdateNew = `    function updateExorcisms(dt) {
      if (!gameState.enemies || gameState.enemies.length === 0) return;
      const p = gameState.player;

      for (let i = gameState.enemies.length - 1; i >= 0; i--) {
        const e = gameState.enemies[i];
        if (e && e.isExorcising) {
          e.exorcismTimer -= dt;

          // Bio-vomit toxic hazard pools
          if (Math.random() < 0.28) {
            createImpactParticles(e.x, e.y, '#84cc16', 4);
            createImpactParticles(e.x, e.y, '#f59e0b', 2);
            if (!gameState.groundHazards) gameState.groundHazards = [];
            gameState.groundHazards.push({
              x: e.x + (Math.random() - 0.5) * 32,
              y: e.y + (Math.random() - 0.5) * 32,
              radius: 22,
              duration: 3.5,
              color: 'rgba(132, 204, 22, 0.45)',
              damage: 12
            });
          }

          // Trigger Wave 2 at 5.0s remaining
          if (e.exorcismTimer <= 5.0 && e.siegeWave === 1) {
            e.siegeWave = 2;
            triggerWaveAnnouncement("⚠️ WAVE 2: FINAL SIEGE!", "Protect the convulsing patient!");
            playSound('special');
            showToast("⚠️ Wave 2: Aggressive zombie swarm converging!", "warning", true);
            spawnExorcismDefenders(e.x, e.y, 7);
          }

          // Successful Exorcism
          if (e.exorcismTimer <= 0) {
            e.isExorcising = false;
            const citizenX = e.x;
            const citizenY = e.y;
            const isMulti = e.isMultiverse;
            gameState.enemies.splice(i, 1);

            if (!gameState.rescuedCitizens) gameState.rescuedCitizens = [];
            gameState.rescuedCitizens.push({
              x: citizenX,
              y: citizenY,
              name: 'Rehabilitated Portland Citizen',
              rescued: true
            });

            p.beans += 220;
            gainPlayerXP(280);
            p.merchantDiscount = Math.min(0.50, (p.merchantDiscount || 0) + 0.10);

            playSound('coin');
            playSound('level');
            createImpactParticles(citizenX, citizenY, '#38bdf8', 40);
            createImpactParticles(citizenX, citizenY, '#fbbf24', 30);
            addFloatingText("🕊️ CITIZEN REHABILITATED! +220 BEANS (+10% DISCOUNT)", citizenX, citizenY - 40, '#38bdf8', 20);
            showToast("🕊️ Exorcism Successful! +220 Beans & +10% Permanent Merchant Discount!", "success", true);

            if (isMulti) {
              // Rip open cosmic Multiverse Portal (Cow Level)
              gameState.multiversePortal = {
                x: citizenX,
                y: citizenY,
                radius: 36,
                active: true,
                label: 'MULTIVERSE PORTAL (COW LEVEL)'
              };
              playSound('level');
              triggerWaveAnnouncement("🌀 MULTIVERSE PORTAL OPENED!", "Secret Multiverse Fetty Realm (Cow Level) Unlocked!");
              showToast("🌀 Dimensional Rift ripped open! Enter Multiverse Portal [SPACE]!", "success", true);
            }

            if (gameState.currentDungeon) {
              gameState.currentDungeon.civiliansSaved = (gameState.currentDungeon.civiliansSaved || 0) + 1;
              updateQuestTrackerUI();
            }
          }
        }
      }
    }`;

if (html.includes(exorcismUpdateOld)) {
  html = html.replace(exorcismUpdateOld, exorcismUpdateNew);
  console.log('✓ Updated updateExorcisms with 2-wave defensive siege & Multiverse portal');
}

// =============================================================================
// 7. DIABLO 2 LEVELING CURVE & LEVEL UP FANFARE
// =============================================================================
const gainPlayerXPCode = `
    // =========================================================================
    // ⚔️ DIABLO LEVELING CURVE (LEVELS 1 TO 99) & SKILL POINT PROGRESSION
    // =========================================================================
    function gainPlayerXP(amount) {
      if (!gameState.player) return;
      const p = gameState.player;
      p.xp = (p.xp || 0) + amount;
      p.level = p.level || 1;
      p.skillPoints = p.skillPoints || 0;
      p.statPoints = p.statPoints || 0;
      p.xpNext = p.xpNext || Math.round(180 * Math.pow(1.22, p.level - 1));

      let leveledUp = false;
      while (p.xp >= p.xpNext && p.level < 99) {
        p.xp -= p.xpNext;
        p.level++;
        p.skillPoints += 1;
        p.statPoints += 5;
        p.xpNext = Math.round(180 * Math.pow(1.22, p.level - 1));
        p.maxHp += 18;
        p.maxEnergy += 12;
        p.hp = p.maxHp;
        p.energy = p.maxEnergy;
        leveledUp = true;
      }

      if (leveledUp) {
        playSound('level');
        createImpactParticles(p.x, p.y, '#fbbf24', 45);
        createImpactParticles(p.x, p.y, '#38bdf8', 30);
        addFloatingText(\`🎉 LEVEL UP! LVL \${p.level} (+1 SKILL, +5 STATS)\`, p.x, p.y - 45, '#fbbf24', 22);
        triggerWaveAnnouncement(\`⭐ LEVEL \${p.level} ACHIEVED!\`, "+1 Skill Point, +5 Stat Points! Press [S] or [K]");
        showToast(\`🎉 Reached Level \${p.level}! Full HP/Energy restored. Press [S] to allocate points.\`, "success", true);
        const lvlBadge = document.getElementById('hudLevelBadge');
        if (lvlBadge) lvlBadge.textContent = String(p.level).padStart(2, '0');
      }

      updateHUD();
      if (typeof renderDiablo2SkillTree === 'function') renderDiablo2SkillTree();
    }
`;

if (!html.includes('function gainPlayerXP')) {
  html = html.replace('function updateHUD', gainPlayerXPCode + '\n    function updateHUD');
  console.log('✓ Injected gainPlayerXP with Level 1-99 Diablo curve');
}

// Hook gainPlayerXP into killEnemy where xp is awarded
html = html.replace("p.xp += enemy.xpReward;", "gainPlayerXP(enemy.xpReward);");
html = html.replace("p.xp += e.xpReward;", "gainPlayerXP(e.xpReward);");

// =============================================================================
// 8. DIABLO 2 SKILL TREE MATRIX (HOTKEY 'S' OR 'K')
// =============================================================================
const d2SkillTreeData = `
    // ── DIABLO 2 STYLE 3-DISCIPLINE SKILL TREE ──
    const DIABLO2_SKILL_TREES = {
      blade_mastery: {
        id: 'blade_mastery',
        name: 'Blade Mastery',
        icon: '🗡️',
        desc: 'Martial swordplay, sweeping cleaves, and ricocheting blade waves.',
        skills: [
          { id: 'slash_arc', name: 'Slash Arc', reqLvl: 1, maxRank: 20, desc: 'Increases primary melee slash damage by +12% and arc by +6° per rank.', active: true },
          { id: 'blade_cyclone', name: 'Blade Cyclone', reqLvl: 6, maxRank: 20, desc: 'Spinning 360° razor vortex inflicting 140% weapon damage in a 120px radius.', active: true },
          { id: 'sonic_ricochet', name: 'Sonic Ricochet', reqLvl: 12, maxRank: 20, desc: 'Guided supersonic blade reflections deal +25% bonus critical damage.', active: false },
          { id: 'weapon_mastery', name: 'Weapon Mastery', reqLvl: 18, maxRank: 20, desc: 'Passive: Increases all physical blade damage by +10% and attack speed by +4%.', active: false },
          { id: 'executioner', name: 'Executioner Strike', reqLvl: 24, maxRank: 20, desc: 'Passive: +8% Critical Strike Chance and +35% Critical Damage bonus.', active: false }
        ]
      },
      storm_cryo: {
        id: 'storm_cryo',
        name: 'Storm & Cryo',
        icon: '🌧️',
        desc: 'Atmospheric deluge manipulation, flash-freezing cold, and Pacific lightning.',
        skills: [
          { id: 'rain_deluge', name: 'Rain Deluge', reqLvl: 1, maxRank: 20, desc: 'RMB Skill: Cascading tempest blast dealing cold damage and chilling enemies.', active: true },
          { id: 'frost_nova', name: 'Frost Nova', reqLvl: 6, maxRank: 20, desc: 'Expands a sub-zero ring of frost, freezing all nearby enemies for 2.5s.', active: true },
          { id: 'blizzard_surge', name: 'Blizzard Surge', reqLvl: 12, maxRank: 20, desc: 'Summons violent glacial vortex for 5s, shredding monster movement speed.', active: true },
          { id: 'cryo_piercing', name: 'Cryo Piercing', reqLvl: 18, maxRank: 20, desc: 'Passive: Water and ice projectiles pierce up to 3 additional targets.', active: false },
          { id: 'chain_lightning', name: 'Chain Lightning', reqLvl: 24, maxRank: 20, desc: 'High-voltage electric discharge leaping between up to 6 targets.', active: true }
        ]
      },
      shadow_stealth: {
        id: 'shadow_stealth',
        name: 'Shadow & Stealth',
        icon: '🥷',
        desc: 'Subterranean infiltration, toxic acid mines, and nanite life leech.',
        skills: [
          { id: 'cold_brew_rush', name: 'Cold Brew Rush', reqLvl: 1, maxRank: 20, desc: 'Sprint boost granting +65% movement speed and collision phasing for 3s.', active: true },
          { id: 'shadow_cloak', name: 'Shadow Cloak', reqLvl: 6, maxRank: 20, desc: 'Dissolve into urban rain mist; next strike is a guaranteed critical hit.', active: true },
          { id: 'acid_mine', name: 'Acid Mine', reqLvl: 12, maxRank: 20, desc: 'Deploys corrosive neurotoxin mine melting monster armor by 40%.', active: true },
          { id: 'cyber_overdrive', name: 'Cyber Overdrive', reqLvl: 18, maxRank: 20, desc: 'Passive: +25 Max Stamina and +20% faster stamina recharge.', active: false },
          { id: 'nanite_leech', name: 'Nanite Leech', reqLvl: 24, maxRank: 20, desc: 'Passive: 12% of all damage dealt is returned as Life to the hero.', active: false }
        ]
      }
    };

    function allocateSkillPoint(treeId, skillId) {
      const p = gameState.player;
      if (!p.skillPoints || p.skillPoints <= 0) {
        showToast("⚠️ No Skill Points available! Level up to earn more.", "warning");
        return;
      }
      if (!gameState.d2Skills) gameState.d2Skills = {};
      const tree = DIABLO2_SKILL_TREES[treeId];
      if (!tree) return;
      const sk = tree.skills.find(s => s.id === skillId);
      if (!sk) return;
      if (p.level < sk.reqLvl) {
        showToast(\`🔒 Requires Character Level \${sk.reqLvl}!\`, "warning");
        return;
      }
      const curRank = gameState.d2Skills[skillId] || 0;
      if (curRank >= sk.maxRank) {
        showToast("Skill already at maximum rank (20/20)!", "info");
        return;
      }
      gameState.d2Skills[skillId] = curRank + 1;
      p.skillPoints--;
      playSound('level');
      createImpactParticles(p.x, p.y, '#38bdf8', 20);
      showToast(\`Ranked up \${sk.name} (\${curRank + 1}/\${sk.maxRank})!\`, "success");
      renderDiablo2SkillTree();
      updateHUD();
    }

    function respecAllSkillPoints() {
      const p = gameState.player;
      if (!gameState.d2Skills) return;
      let refunded = 0;
      Object.keys(gameState.d2Skills).forEach(k => {
        refunded += gameState.d2Skills[k];
        gameState.d2Skills[k] = 0;
      });
      p.skillPoints = (p.skillPoints || 0) + refunded;
      playSound('powerup');
      showToast(\`🔄 Respec complete! Refunded \${refunded} Skill Points.\`, "success", true);
      renderDiablo2SkillTree();
      updateHUD();
    }
`;

if (!html.includes('DIABLO2_SKILL_TREES')) {
  html = html.replace('const gameState = {', d2SkillTreeData + '\n    const gameState = {');
  console.log('✓ Added DIABLO2_SKILL_TREES data and allocate/respec functions');
}

// Add 's' key listener to open skill tree modal
html = html.replace(
  "if (e.key === 'k' || e.key === 'K') {",
  "if (e.key === 's' || e.key === 'S' || e.key === 'k' || e.key === 'K') {"
);
console.log('✓ Added [S] hotkey for Diablo 2 Skill Tree');

// =============================================================================
// 9. HIGH-RES LAYERED IN-GAME SPRITE & PAPERDOLL ATTIRE
// =============================================================================
// Ensure drawPlayer applies cosmetic attire layers based on equipped loadout
const drawPlayerAttireCode = `
      // Dynamic In-Game Attire & Weapon Glows based on equipped gear
      if (gameState.equipped) {
        const weapon = gameState.equipped.mainHand;
        if (weapon && weapon.glowColor) {
          ctx.save();
          ctx.strokeStyle = weapon.glowColor;
          ctx.lineWidth = 3;
          ctx.shadowColor = weapon.glowColor;
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(p.x + Math.cos(p.angle || 0) * 16, p.y + Math.sin(p.angle || 0) * 16, 8, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        // Set Aura Ring at Hero feet
        if (gameState.equipped.setBonusActive) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y + 12, 22, 0, Math.PI * 2);
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.restore();
        }
      }
`;

if (!html.includes('Dynamic In-Game Attire & Weapon Glows')) {
  html = html.replace('function drawPlayer() {', 'function drawPlayer() {\n' + drawPlayerAttireCode);
  console.log('✓ Enhanced drawPlayer with layered attire & weapon elemental glows');
}

// =============================================================================
// 10. INTERACTION WITH DUNGEON PORTALS & STAIRS IN OVERWORLD & DUNGEON
// =============================================================================
// Hook space key and E key to interact with dungeon entrance, stairs, porta-potty, and multiverse portal
const keyInteractions = `
      // Portland Overworld & Dungeon Interaction Hotkeys (Space & E)
      if (gameState.mode === 'overworld' && gameState.worldMap && gameState.worldMap.landmarks) {
        const p = gameState.player;
        const nearDungeon = gameState.worldMap.landmarks.find(l => l.hasDungeon && Math.hypot(p.x - l.worldX, p.y - l.worldY) < 65);
        if (nearDungeon && (e.key === ' ' || e.code === 'Space' || e.key === 'e' || e.key === 'E')) {
          e.preventDefault();
          enterNeighborhoodDungeon(nearDungeon.dungeonId);
          return;
        }
      }
      if (gameState.mode === 'dungeon') {
        const p = gameState.player;
        if (gameState.portaPotty && gameState.portaPotty.active && Math.hypot(p.x - gameState.portaPotty.x, p.y - gameState.portaPotty.y) < 65) {
          if (e.key === ' ' || e.code === 'Space' || e.key === 'e' || e.key === 'E') {
            e.preventDefault();
            warpBackToPortlandSurface();
            return;
          }
        }
        if (gameState.multiversePortal && gameState.multiversePortal.active && Math.hypot(p.x - gameState.multiversePortal.x, p.y - gameState.multiversePortal.y) < 65) {
          if (e.key === ' ' || e.code === 'Space' || e.key === 'e' || e.key === 'E') {
            e.preventDefault();
            enterMultiverseCowLevel();
            return;
          }
        }
        if (gameState.dungeonStairs && gameState.dungeonStairs.active && Math.hypot(p.x - gameState.dungeonStairs.x, p.y - gameState.dungeonStairs.y) < 65) {
          if (e.key === ' ' || e.code === 'Space' || e.key === 'e' || e.key === 'E') {
            e.preventDefault();
            checkDungeonStairsInteraction();
            return;
          }
        }
      }
`;

if (!html.includes('Portland Overworld & Dungeon Interaction Hotkeys')) {
  html = html.replace("if (e.key === 'q' || e.key === 'Q') triggerSkill(1);", keyInteractions + "\n      if (e.key === 'q' || e.key === 'Q') triggerSkill(1);");
  console.log('✓ Added space/E portal and stairs interaction hooks');
}

// In drawDungeonInteractables: also draw multiverse portal if active
const drawMultiversePortalCode = `
      // 4. Draw Cosmic Multiverse Portal (Cow Level)
      if (gameState.multiversePortal && gameState.multiversePortal.active) {
        const mp = gameState.multiversePortal;
        ctx.save();
        ctx.translate(mp.x, mp.y);
        const mTime = performance.now() * 0.003;
        ctx.beginPath();
        ctx.arc(0, 0, mp.radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 3.5;
        ctx.stroke();

        ctx.font = '28px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🌀', 0, 9);

        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#c084fc';
        ctx.fillText('COSMIC MULTIVERSE PORTAL (COW LEVEL)', 0, -46);

        const dist = Math.hypot(gameState.player.x - mp.x, gameState.player.y - mp.y);
        if (dist < 60) {
          ctx.font = 'bold 9px monospace';
          ctx.fillStyle = '#fbbf24';
          ctx.fillText('TOUCH / [SPACE] TO ENTER SECRET REALM', 0, 48);
        }
        ctx.restore();
      }
`;

if (!html.includes('Draw Cosmic Multiverse Portal')) {
  html = html.replace('function drawDungeonInteractables() {', 'function drawDungeonInteractables() {\n' + drawMultiversePortalCode);
  console.log('✓ Added Multiverse Portal rendering to drawDungeonInteractables');
}

// In killEnemy: if boss of cow_level is killed
const cowBossKillLogic = `
        if (enemy.isBoss && gameState.currentDungeon && gameState.currentDungeon.isCowLevel) {
          gameState.currentDungeon.bossDefeated = true;
          const bossBarEl = document.getElementById('bossHealthBarContainer');
          if (bossBarEl) bossBarEl.classList.add('hidden');
          spawnPortaPottyTownPortal();
          playSound('level');
          addFloatingText("🐮 BOVINE OVERLORD SLAIN! +500 BEANS!", enemy.x, enemy.y - 40, '#fbbf24', 24);
          triggerWaveAnnouncement("🏆 BOVINE OVERLORD SLAIN!", "Porta-Potty return portal opened!");
        }
`;

if (!html.includes('BOVINE OVERLORD SLAIN')) {
  html = html.replace('if (enemy.isBoss && gameState.currentDungeon && gameState.currentDungeon.floor === 2) {', cowBossKillLogic + '\n        if (enemy.isBoss && gameState.currentDungeon && gameState.currentDungeon.floor === 2) {');
  console.log('✓ Hooked Bovine Overlord kill logic');
}

// =============================================================================
// 11. EXTEND DEV BRIDGE WITH LEVEL UP & COW LEVEL TESTING HELPERS
// =============================================================================
const bridgeExtensions2 = `
      levelUp() {
        gainPlayerXP(gameState.player.xpNext || 200);
        this.log('cheat', 'Leveled up character');
      },
      openMultiversePortal() {
        if (!gameState.player) return;
        gameState.multiversePortal = {
          x: gameState.player.x + 50,
          y: gameState.player.y,
          radius: 36,
          active: true,
          label: 'MULTIVERSE PORTAL (COW LEVEL)'
        };
        this.log('cheat', 'Spawned Multiverse Cow Level portal');
        if (typeof showToast === 'function') showToast('Cosmic Multiverse Portal spawned via dev bridge!', 'success');
      },
      enterCowLevel() {
        enterMultiverseCowLevel();
        this.log('cheat', 'Entered Secret Multiverse Fetty Realm');
      },
`;

if (!html.includes('enterCowLevel')) {
  html = html.replace('acquireBossKey() {', bridgeExtensions2.trim() + '\n      acquireBossKey() {');
  console.log('✓ Added levelUp, openMultiversePortal, and enterCowLevel to Dev Bridge');
}

fs.writeFileSync(targetPath, html, 'utf8');
console.log('✓ Complete rain-blade.html written successfully! New length:', html.length);
