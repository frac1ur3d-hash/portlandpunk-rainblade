const fs = require('fs');
const path = require('path');

const rainBladePath = path.join(__dirname, 'client/public/rain-blade.html');
let content = fs.readFileSync(rainBladePath, 'utf8');

console.log('Original rain-blade.html size:', content.length);

// 1. ADD NEW SPRITE MATRICES (Fetty Zombie, 82nd St Blood Siren, Porta-Potty, Amp Stim)
const newSprites = `
    // 7. Fetty Zombie (Shuffling, Erratic Street Walker)
    const SPRITE_FETTY_ZOMBIE_8BIT = [
      "....00000000....",
      "...0gggggggg0...", // Pale sickly green skin
      "..0g00gg00gg0..",
      "..0gggggggggg0..",
      "..0gRRggRRgg0..", // Bloodshot hollow eyes
      "..0gggggggggg0..",
      ".00gg000000gg00.", // Slumped shoulders, torn hoodie
      "0110gggggggg0110",
      "0110gggggggg0110",
      ".00.01111110.00.",
      "....01111110....",
      "...0220..0220...",
      "...0220..0220...",
      "..0000....0000..",
      "................",
      "................"
    ];

    // 8. 82nd Street Blood Siren (Vampiric Hooded Screecher)
    const SPRITE_BLOOD_SIREN_8BIT = [
      "....00000000....",
      "...0RRRRRRRR0...", // Crimson Hood
      "..0RRRRRRRRRR0..",
      "..0R0WW00WW0R0..", // Piercing white eyes
      "..0R0RR00RR0R0..",
      "..0RRRRRRRRRR0..",
      ".00RR00WW00RR00.", // Fanged screeching maw
      "0PP0RRRRRRRR0PP0", // Neon pink claws
      "0PP0RRRRRRRR0PP0",
      ".00.0RRRRRR0.00.",
      ".....0RRRR0.....",
      "....01100110....",
      "...0110..0110...",
      "..000......000..",
      "................",
      "................"
    ];

    // 9. Porta-Potty Town Portal (Radiant Blue Chemical Teleporter)
    const SPRITE_PORTA_POTTY_8BIT = [
      "...0000000000...", // Curved white/cyan roof
      "..0WWWWWWWWWW0..",
      ".0BBBBBBBBBBBB0.", // Deep blue chemical cabin
      ".0B0000000000B0.",
      ".0B0WW0000WW0B0.", // Vent slits
      ".0B0000000000B0.",
      ".0B0YYYYYYYY0B0.", // Biohazard chemical symbol
      ".0B0YY0000YY0B0.",
      ".0B0YYYYYYYY0B0.",
      ".0B0000000000B0.",
      ".0B0CCCCCCCC0B0.", // Cyan glowing interior threshold
      ".0B0CCCCCCCC0B0.",
      ".0B0000000000B0.",
      ".0BBBBBBBBBBBB0.",
      "0000000000000000",
      "................"
    ];

    // 10. Amp Stim Speed Injector
    const SPRITE_AMP_STIM_8BIT = [
      "......0WW0......", // Plunger
      "......0WW0......",
      ".....00WW00.....",
      "....0YYYYYY0....", // Glowing Golden Amp Fluid
      "....0YYYYYY0....",
      "....0YY00YY0....",
      "....0YYYYYY0....",
      "....0YYYYYY0....",
      "....00YYYY00....",
      ".....00WW00.....",
      "......0WW0......",
      "......0WW0......", // Needle tip
      ".......00.......",
      "................",
      "................",
      "................"
    ];
`;

content = content.replace('const SPRITE_SWARMER_DRONE_8BIT = [', `${newSprites}\n    const SPRITE_SWARMER_DRONE_8BIT = [`);

// 2. UPDATE INITIAL PLAYER STATE WITH AMP CHARGES AND SPAWN AT LENTS
const oldPlayerState = `player: {
        x: 0,
        y: 0,`;
const newPlayerState = `player: {
        x: 1536, // Spawn at Lents Town Center & Encampment
        y: 1280,
        ampCharges: 3,
        ampMaxCharges: 5,
        ampActiveTimer: 0,
        narcanStims: 2,`;
content = content.replace(oldPlayerState, newPlayerState);

// 3. UPDATE PortlandMapGenerator LANDMARKS TO AUTHENTIC GEOGRAPHY & DUNGEON ENTRANCES
const oldLandmarks = `        // 4. Iconic Macro-Landmarks
        this.landmarks = [
          { id: 'burnside_bridge', name: 'Burnside Bridge Hub', tileX: 32, tileY: 32, worldX: 0, worldY: 0, icon: '🌉', district: 'Burnside Hub' },
          { id: 'chinatown_gate', name: 'Old Chinatown Gate', tileX: 16, tileY: 16, worldX: -1024, worldY: -1024, icon: '⛩️', district: 'Chinatown Anomaly' },
          { id: 'burnside_skatepark', name: 'Eastside Skatepark', tileX: 48, tileY: 16, worldX: 1024, worldY: -1024, icon: '🛹', district: 'Eastside Industrial' },
          { id: 'forest_park_shrine', name: 'Forest Park Redwood Sanctuary', tileX: 16, tileY: 48, worldX: -1024, worldY: 1024, icon: '🌲', district: 'Forest Park Wilds' },
          { id: 'hawthorne_undercroft', name: 'Hawthorne Undercroft Market', tileX: 48, tileY: 48, worldX: 1024, worldY: 1024, icon: '🏮', district: 'Hawthorne Bazaar' }
        ];`;

const newLandmarks = `        // 4. Iconic Macro-Landmarks & Authentic Portland Neighborhood Dungeons
        this.landmarks = [
          { id: 'lents_hub', name: 'Lents Town Center & Encampment', tileX: 56, tileY: 52, worldX: 1536, worldY: 1280, icon: '🏚️', district: 'Lents Trenches', hasDungeon: true, dungeonId: 'lents', dungeonName: 'Lents Encampment Trenches', desc: 'Starting Zone: Fend off fetty zombie swarms and rescue stranded civilians.' },
          { id: 'ave_82nd', name: '82nd Avenue Red Light Anomaly', tileX: 54, tileY: 34, worldX: 1408, worldY: 128, icon: '🚨', district: '82nd Ave Strip', hasDungeon: true, dungeonId: 'ave_82nd', dungeonName: '82nd Ave Motel Corridor', desc: 'Red light motels overrun by blood sirens and fetty zombies.' },
          { id: 'powellhurst', name: 'Powellhurst-Gilbert Wasteland', tileX: 58, tileY: 42, worldX: 1664, worldY: 640, icon: '🏗️', district: 'Powellhurst Wasteland', hasDungeon: true, dungeonId: 'powellhurst', dungeonName: 'Scrap Iron Fortress', desc: 'Outer scrap fortress ruled by the Junk Enforcer Warlord.' },
          { id: 'creston_kenilworth', name: 'Creston-Kenilworth Park Undercroft', tileX: 46, tileY: 44, worldX: 896, worldY: 768, icon: '🌲', district: 'Creston Undercroft', hasDungeon: true, dungeonId: 'creston', dungeonName: 'Kenilworth Park Catacombs', desc: 'Sunken park conduits infested with toxic spores and zombie swarms.' },
          { id: 'hawthorne_undercroft', name: 'Hawthorne Undercroft Market', tileX: 42, tileY: 38, worldX: 640, worldY: 384, icon: '🏮', district: 'Hawthorne Bazaar', hasDungeon: true, dungeonId: 'hawthorne', dungeonName: 'Hawthorne Leyline Vault', desc: 'Occult coffee conduits and rogue synthetic barons.' },
          { id: 'burnside_skatepark', name: 'Eastside Burnside Skatepark', tileX: 38, tileY: 28, worldX: 384, worldY: -256, icon: '🛹', district: 'Eastside Industrial', hasDungeon: true, dungeonId: 'burnside', dungeonName: 'Burnside Underpass Arena', desc: 'Concrete battleground guarded by the Brimstone Hydra.' },
          { id: 'burnside_bridge', name: 'Burnside Bridge River Hub', tileX: 32, tileY: 32, worldX: 0, worldY: 0, icon: '🌉', district: 'Burnside River Hub', hasDungeon: false },
          { id: 'chinatown_gate', name: 'Old Chinatown Gate & Alley Vaults', tileX: 24, tileY: 20, worldX: -512, worldY: -768, icon: '⛩️', district: 'Chinatown Anomaly', hasDungeon: true, dungeonId: 'chinatown', dungeonName: 'Jade Dragon Catacombs', desc: 'Alley vaults holding the ancient dragon spirit.' },
          { id: 'pearl_district', name: 'Pearl District High-Rise Citadel', tileX: 22, tileY: 26, worldX: -640, worldY: -384, icon: '💎', district: 'Pearl Citadel', hasDungeon: true, dungeonId: 'pearl', dungeonName: 'Syndicate Executive Vault', desc: 'Corporate high-rises guarded by elite cybernetic enforcers.' },
          { id: 'forest_park_shrine', name: 'Forest Park Redwood Sanctuary', tileX: 14, tileY: 16, worldX: -1152, worldY: -1024, icon: '🌲', district: 'Forest Park Wilds', hasDungeon: true, dungeonId: 'forest_park', dungeonName: 'Primeval Sasquatch Den', desc: 'Dense redwoods holding primeval biomorphic behemoths.' }
        ];`;
content = content.replace(oldLandmarks, newLandmarks);

// 4. ADD DUNGEON ENGINE, PORTA-POTTY TP & AMP STIM LOGIC
const dungeonEngineCode = `
    // =========================================================================
    // 🚪 NEIGHBORHOOD DUNGEON ENGINE, PORTA-POTTY TP & AMP STIM PIPELINE
    // =========================================================================

    gameState.mode = 'overworld'; // 'overworld' | 'dungeon'
    gameState.currentDungeon = null;
    gameState.overworldReturn = { x: 1536, y: 1280 };
    gameState.portaPotty = null;
    gameState.dungeonStairs = null;
    gameState.downedCivilians = [];

    // Amp Stim Speed Overdrive Function
    function useAmpStim() {
      const p = gameState.player;
      if (!p.ampCharges || p.ampCharges <= 0) {
        showToast("⚠️ No Amp Stims! Scavenge crates or purge elites.", "warning");
        playSound('empty');
        return;
      }
      p.ampCharges--;
      p.ampActiveTimer = 15.0; // 15 seconds of super speed & haste
      playSound('special');
      createImpactParticles(p.x, p.y, '#eab308', 25);
      createImpactParticles(p.x, p.y, '#38bdf8', 15);
      addFloatingText("⚡ AMP OVERDRIVE! +85% SPEED", p.x, p.y - 25, '#eab308', 18);
      triggerTelegramHaptic('impact', 'heavy');
      updateAmpHUD();
    }

    function updateAmpHUD() {
      const p = gameState.player;
      const ampBtn = document.getElementById('btnAmpPill');
      if (ampBtn) {
        ampBtn.innerHTML = \`⚡ AMP (\${p.ampCharges || 0})\`;
        if (p.ampActiveTimer > 0) {
          ampBtn.classList.add('animate-pulse', 'border-amber-400', 'bg-amber-500/30');
        } else {
          ampBtn.classList.remove('animate-pulse', 'border-amber-400', 'bg-amber-500/30');
        }
      }
    }

    // Generate Standalone Procedural 2-Level Dungeon
    function enterNeighborhoodDungeon(dungeonId) {
      const lm = gameState.worldMap?.landmarks?.find(l => l.dungeonId === dungeonId);
      const name = lm ? lm.dungeonName : 'Neighborhood Dungeon';

      gameState.overworldReturn = { x: gameState.player.x, y: gameState.player.y };
      gameState.mode = 'dungeon';
      gameState.currentDungeon = {
        id: dungeonId,
        name: name,
        floor: 1,
        maxFloors: 2,
        zombiesPurged: 0,
        zombiesTarget: dungeonId === 'lents' ? 12 : (dungeonId === 'ave_82nd' ? 15 : 14),
        civiliansSaved: 0,
        civiliansTarget: 3,
        bossDefeated: false
      };

      loadDungeonFloor(1);
      triggerWaveAnnouncement(\`⚔️ ENTERING \${name.toUpperCase()}\`, "Floor 1: Purge the Infested Streets");
      playSound('level');
      showToast(\`Entered \${name} (Floor 1/2)\`, "success", true);
    }

    function loadDungeonFloor(floorNum) {
      gameState.currentDungeon.floor = floorNum;
      gameState.enemies = [];
      gameState.particles = [];
      gameState.projectiles = [];
      gameState.groundHazards = [];
      gameState.portaPotty = null;
      chunkCache.clear(); // Clear tile cache for new dungeon environment

      const p = gameState.player;
      p.x = 0;
      p.y = 350; // Start at south entrance
      p.vx = 0;
      p.vy = 0;

      // Generate compact 32x32 dungeon map
      const dMap = new PortlandMapGenerator(gameState.worldSeed + floorNum * 997);
      dMap.cols = 32;
      dMap.rows = 32;
      dMap.width = dMap.cols * dMap.tileSize;
      dMap.height = dMap.rows * dMap.tileSize;
      dMap.originX = dMap.width / 2;
      dMap.originY = dMap.height / 2;
      dMap.grid = new Uint8Array(dMap.cols * dMap.rows);

      // Fill dungeon rooms & corridors
      const dId = gameState.currentDungeon.id;
      const floorTile = (dId === 'ave_82nd') ? 0 : (dId === 'creston' ? 5 : (dId === 'chinatown' ? 6 : 4));

      for (let r = 0; r < dMap.rows; r++) {
        for (let c = 0; c < dMap.cols; c++) {
          if (r <= 1 || r >= dMap.rows - 2 || c <= 1 || c >= dMap.cols - 2) {
            dMap.setTile(c, r, 1); // Solid outer boundary
          } else {
            dMap.setTile(c, r, floorTile);
          }
        }
      }

      // Add barricades and alley corridors
      for (let r = 4; r < dMap.rows - 4; r += 4) {
        for (let c = 4; c < dMap.cols - 4; c += 4) {
          if (Math.abs(c - 16) <= 2 && Math.abs(r - 16) <= 4) continue; // Keep center clear
          if ((c + r) % 3 === 0) {
            dMap.setTile(c, r, 1);
            dMap.setTile(c + 1, r, 1);
          }
        }
      }

      gameState.worldMap = dMap;

      if (floorNum === 1) {
        // Floor 1: Spawn Stairs to Floor 2 at north end
        gameState.dungeonStairs = {
          x: 0,
          y: -400,
          radius: 35,
          active: true,
          label: 'STAIRS TO LEVEL 2: APEX LAIR'
        };

        // Spawn Downed Civilians needing Narcan/Stims
        gameState.downedCivilians = [
          { x: -220, y: 100, rescued: false, name: 'Stranded Medic' },
          { x: 240, y: -50, rescued: false, name: 'Injured Courier' },
          { x: -140, y: -260, rescued: false, name: 'Portland Resident' }
        ];

        // Spawn Fetty Zombies and Blood Sirens
        const count = 18;
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = 180 + Math.random() * 450;
          const ex = Math.cos(angle) * dist;
          const ey = Math.sin(angle) * dist - 80;
          const isSiren = (dId === 'ave_82nd' && Math.random() < 0.45) || (Math.random() < 0.25);

          gameState.enemies.push({
            x: ex,
            y: ey,
            vx: 0,
            vy: 0,
            radius: isSiren ? 16 : 18,
            speed: isSiren ? 4.2 : 2.4,
            hp: isSiren ? 130 : 95,
            maxHp: isSiren ? 130 : 95,
            damage: isSiren ? 16 : 11,
            role: isSiren ? 'assassin' : 'swarmer',
            archetypeId: isSiren ? 'blood_siren' : 'fetty_zombie',
            name: isSiren ? '82nd St Blood Siren' : 'Fetty Zombie',
            isElite: Math.random() < 0.22,
            affix: Math.random() < 0.5 ? 'molten' : 'vampiric',
            accentColor: isSiren ? '#f43f5e' : '#10b981',
            hitFlash: 0
          });
        }
      } else {
        // Floor 2: APEX BOSS ARENA
        gameState.dungeonStairs = null;
        gameState.downedCivilians = [];

        // Spawn District Apex Boss
        let bossName = 'Overdose Behemoth';
        let bossType = 'burnside';
        let bossColor = '#f59e0b';
        let bossHp = 950;
        let bossDmg = 28;

        if (dId === 'ave_82nd') {
          bossName = '82nd Street Siren Queen';
          bossType = 'chinatown';
          bossColor = '#f43f5e';
          bossHp = 1100;
          bossDmg = 32;
        } else if (dId === 'powellhurst') {
          bossName = 'Junk Enforcer Warlord';
          bossType = 'hawthorne';
          bossColor = '#ef4444';
          bossHp = 1250;
          bossDmg = 34;
        } else if (dId === 'creston') {
          bossName = 'Kenilworth Spore Goliath';
          bossType = 'forest_park';
          bossColor = '#10b981';
          bossHp = 1200;
          bossDmg = 30;
        }

        gameState.enemies.push({
          x: 0,
          y: -150,
          vx: 0,
          vy: 0,
          radius: 36,
          speed: 3.2,
          hp: bossHp,
          maxHp: bossHp,
          damage: bossDmg,
          role: 'boss',
          isBoss: true,
          bossType: bossType,
          name: bossName,
          title: \`Apex Guardian of \${gameState.currentDungeon.name}\`,
          accentColor: bossColor,
          hitFlash: 0
        });

        // Spawn escort bodyguards
        for (let b = 0; b < 6; b++) {
          const ba = (Math.PI * 2 / 6) * b;
          gameState.enemies.push({
            x: Math.cos(ba) * 160,
            y: -150 + Math.sin(ba) * 160,
            vx: 0,
            vy: 0,
            radius: 17,
            speed: 3.5,
            hp: 120,
            maxHp: 120,
            damage: 14,
            role: 'assassin',
            archetypeId: 'blood_siren',
            name: 'Elite Siren Guard',
            accentColor: '#f43f5e',
            hitFlash: 0
          });
        }

        triggerWaveAnnouncement(\`⚠️ \${bossName.toUpperCase()} ENGAGED!\`, "Floor 2: Apex Boss Vault");
        playSound('special');
      }

      updateQuestTrackerUI();
    }

    function descendToFloor2() {
      if (gameState.currentDungeon && gameState.currentDungeon.floor === 1) {
        playSound('level');
        loadDungeonFloor(2);
      }
    }

    // Materialize the radiant Porta-Potty Town Portal upon Boss Slay
    function spawnPortaPottyTownPortal() {
      gameState.portaPotty = {
        x: 0,
        y: -150,
        radius: 40,
        active: true,
        label: 'PORTA-POTTY TOWN PORTAL',
        steamTimer: 0
      };
      playSound('level');
      triggerWaveAnnouncement("🏆 APEX BOSS SLAIN!", "Porta-Potty Town Portal has opened!");
      addFloatingText("PORTA-POTTY PORTAL OPENED!", 0, -180, '#38bdf8', 18);
      createImpactParticles(0, -150, '#38bdf8', 35);
      createImpactParticles(0, -150, '#eab308', 25);
      updateQuestTrackerUI();
    }

    // Step into the Porta-Potty to return to Portland Overworld
    function warpBackToPortlandSurface() {
      playSound('teleport');
      playSound('powerup');
      
      const p = gameState.player;
      p.x = gameState.overworldReturn.x;
      p.y = gameState.overworldReturn.y;
      p.vx = 0;
      p.vy = 0;

      // Quest Complete Rewards: Stumptown Beans, XP & Amp Stims
      p.beans += 175;
      p.xp += 350;
      p.ampCharges = Math.min(p.ampMaxCharges, (p.ampCharges || 0) + 2);

      // Drop guaranteed Ancient/Masterwork Boss Loot
      dropLoot(p.x + 30, p.y + 30, true, 2);

      gameState.mode = 'overworld';
      gameState.currentDungeon = null;
      gameState.portaPotty = null;
      gameState.dungeonStairs = null;
      gameState.downedCivilians = [];
      chunkCache.clear();

      initWorldMap(gameState.worldSeed);
      triggerWaveAnnouncement("🎉 DISTRICT DUNGEON CLEARED!", "Extracted back to Portland Surface (+175 Beans, +2 Amp Stims)");
      showToast("🏆 Quest Completed! Returned to dungeon entrance.", "success", true);
      updateQuestTrackerUI();
    }

    // Quest Tracker HUD Updater
    function updateQuestTrackerUI() {
      const tracker = document.getElementById('hudQuestTracker');
      if (!tracker) return;

      if (gameState.mode === 'dungeon' && gameState.currentDungeon) {
        tracker.classList.remove('hidden');
        const d = gameState.currentDungeon;
        const distName = d.name.toUpperCase();
        
        let taskHTML = '';
        if (d.floor === 1) {
          taskHTML = \`
            <div class="flex items-center justify-between text-[10px]">
              <span class="text-emerald-400 font-bold">Purge Fetty Zombies:</span>
              <span class="text-white">\${d.zombiesPurged}/\${d.zombiesTarget}</span>
            </div>
            <div class="flex items-center justify-between text-[10px]">
              <span class="text-cyan-400 font-bold">Stabilize Civilians:</span>
              <span class="text-white">\${d.civiliansSaved}/\${d.civiliansTarget}</span>
            </div>
            <div class="text-[9px] text-amber-300 font-mono pt-1">
              📍 Find Stairs to Level 2: Apex Lair
            </div>
          \`;
        } else {
          if (gameState.portaPotty && gameState.portaPotty.active) {
            taskHTML = \`
              <div class="text-amber-300 font-bold text-xs animate-pulse">
                🏆 BOSS SLAIN! ENTER PORTA-POTTY
              </div>
              <div class="text-[9px] text-cyan-300">
                Warp back to Portland surface entrance
              </div>
            \`;
          } else {
            taskHTML = \`
              <div class="text-rose-400 font-bold text-xs">
                ⚠️ SLAY THE APEX DISTRICT BOSS
              </div>
              <div class="text-[9px] text-slate-400">
                Floor 2: Apex Vault Arena
              </div>
            \`;
          }
        }

        tracker.innerHTML = \`
          <div class="p-2.5 rounded-2xl bg-slate-950/85 border border-amber-500/40 backdrop-blur-md shadow-lg font-mono space-y-1 w-56 sm:w-64">
            <div class="flex items-center justify-between border-b border-slate-800 pb-1">
              <span class="text-[10px] font-extrabold text-amber-400 truncate">\${distName}</span>
              <span class="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">FLR \${d.floor}/2</span>
            </div>
            \${taskHTML}
          </div>
        \`;
      } else {
        // Overworld Exploration Mode
        tracker.classList.remove('hidden');
        tracker.innerHTML = \`
          <div class="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 backdrop-blur-md shadow-lg font-mono space-y-1 w-56 sm:w-64">
            <div class="flex items-center justify-between border-b border-slate-800 pb-1">
              <span class="text-[10px] font-extrabold text-cyan-400">PORTLAND OVERWORLD</span>
              <span class="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">SURFACE</span>
            </div>
            <div class="text-[10px] text-slate-300 leading-tight">
              Route: <span class="text-amber-300 font-bold">Lents</span> ➔ <span class="text-rose-400 font-bold">82nd Ave</span> ➔ <span class="text-emerald-400 font-bold">Inner Core</span>
            </div>
            <div class="text-[9px] text-slate-400 pt-0.5">
              Press [SPACE] near neighborhood portals to enter dungeons.
            </div>
          </div>
        \`;
      }
    }
`;

content = content.replace('const gameState = {', `${dungeonEngineCode}\n    const gameState = {`);

// 5. UPDATE render() TO DRAW DUNGEON STAIRS, DOWNED CIVILIANS & PORTA-POTTY TOWN PORTAL
const renderCallOld = 'drawUrbanEnvironment(w, h);\n      drawGroundHazards();';
const renderCallNew = `drawUrbanEnvironment(w, h);
      drawDungeonInteractables();
      drawGroundHazards();`;
content = content.replace(renderCallOld, renderCallNew);

// Add drawDungeonInteractables function
const drawDungeonInteractablesFn = `
    function drawDungeonInteractables() {
      // 1. Draw Overworld Landmark Dungeon Portals
      if (gameState.mode === 'overworld' && gameState.worldMap && gameState.worldMap.landmarks) {
        const p = gameState.player;
        gameState.worldMap.landmarks.forEach(lm => {
          if (lm.hasDungeon) {
            ctx.save();
            ctx.translate(lm.worldX, lm.worldY);

            // Radiant ground portal ring
            const pTime = performance.now() * 0.002;
            ctx.beginPath();
            ctx.arc(0, 0, 36, 0, Math.PI * 2);
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2.5;
            ctx.setLineDash([6, 6]);
            ctx.stroke();
            ctx.setLineDash([]);

            // Portal icon & banner
            ctx.font = '24px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(lm.icon || '🚪', 0, 8);

            ctx.font = 'bold 10px JetBrains Mono';
            ctx.fillStyle = '#f59e0b';
            ctx.fillText(\`[\${lm.name.toUpperCase()}]\`, 0, -42);

            const dist = Math.hypot(p.x - lm.worldX, p.y - lm.worldY);
            if (dist < 60) {
              ctx.font = 'bold 9px monospace';
              ctx.fillStyle = '#38bdf8';
              ctx.fillText('PRESS [SPACE] TO ENTER DUNGEON', 0, 48);
            }
            ctx.restore();
          }
        });
      }

      // 2. Draw Floor 1 Stairs to Floor 2
      if (gameState.mode === 'dungeon' && gameState.dungeonStairs && gameState.dungeonStairs.active) {
        const st = gameState.dungeonStairs;
        ctx.save();
        ctx.translate(st.x, st.y);

        ctx.beginPath();
        ctx.arc(0, 0, st.radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-20, -20, 40, 40);
        ctx.strokeStyle = '#38bdf8';
        ctx.strokeRect(-20, -20, 40, 40);

        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⬇️', 0, 7);

        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('STAIRS TO LEVEL 2: APEX LAIR', 0, -32);

        const dist = Math.hypot(gameState.player.x - st.x, gameState.player.y - st.y);
        if (dist < 50) {
          ctx.font = 'bold 9px monospace';
          ctx.fillStyle = '#f59e0b';
          ctx.fillText('TOUCH / [SPACE] TO DESCEND', 0, 40);
        }
        ctx.restore();
      }

      // 3. Draw Downed Civilians (Floor 1)
      if (gameState.mode === 'dungeon' && gameState.downedCivilians) {
        gameState.downedCivilians.forEach(civ => {
          if (!civ.rescued) {
            ctx.save();
            ctx.translate(civ.x, civ.y);
            // Red cross distress marker
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('🩹', 0, 4);

            ctx.font = 'bold 9px monospace';
            ctx.fillStyle = '#f43f5e';
            ctx.fillText(civ.name, 0, -18);

            const dist = Math.hypot(gameState.player.x - civ.x, gameState.player.y - civ.y);
            if (dist < 45) {
              ctx.fillStyle = '#10b981';
              ctx.fillText('PRESS [SPACE] TO STABILIZE (+100 XP)', 0, 24);
            }
            ctx.restore();
          }
        });
      }

      // 4. Draw Porta-Potty Town Portal (Floor 2 Boss Victory)
      if (gameState.mode === 'dungeon' && gameState.portaPotty && gameState.portaPotty.active) {
        const pp = gameState.portaPotty;
        ctx.save();
        ctx.translate(pp.x, pp.y);

        // Radiant blue/amber chemical portal aura
        const aTime = performance.now() * 0.003;
        ctx.beginPath();
        ctx.arc(0, 0, pp.radius + 12, 0, Math.PI * 2);
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw Retro 8-bit Porta-Potty Matrix
        drawPixelMatrix(ctx, SPRITE_PORTA_POTTY_8BIT, 0, 0, 2.8, false);

        // Rising steam / bubble particles
        if (Math.random() < 0.3) {
          createImpactParticles(pp.x + (Math.random()-0.5)*20, pp.y - 20, '#38bdf8', 1);
        }

        ctx.font = 'bold 11px JetBrains Mono';
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'center';
        ctx.fillText('🚪 PORTA-POTTY TOWN PORTAL', 0, -pp.radius - 18);

        const dist = Math.hypot(gameState.player.x - pp.x, gameState.player.y - pp.y);
        if (dist < 50) {
          ctx.font = 'bold 10px monospace';
          ctx.fillStyle = '#fbbf24';
          ctx.fillText('TOUCH / [SPACE] TO WARP TO SURFACE', 0, pp.radius + 22);
        }

        ctx.restore();
      }
    }
`;

content = content.replace('function drawUrbanEnvironment(cw, ch) {', `${drawDungeonInteractablesFn}\n    function drawUrbanEnvironment(cw, ch) {`);

// 6. HOOK SPACEBAR / KEYBOARD FOR DUNGEON PORTALS, STAIRS, CIVILIANS & PORTA-POTTY
const oldKeySpaceHandler = `if (e.code === 'Space') {
        e.preventDefault();
        triggerDodge();
      }`;

const newKeySpaceHandler = `if (e.code === 'KeyV') {
        e.preventDefault();
        useAmpStim();
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        // Check for interactive triggers before dodging
        const p = gameState.player;
        
        // (A) Check Porta-Potty Town Portal
        if (gameState.mode === 'dungeon' && gameState.portaPotty && gameState.portaPotty.active) {
          const ppDist = Math.hypot(p.x - gameState.portaPotty.x, p.y - gameState.portaPotty.y);
          if (ppDist < 55) {
            warpBackToPortlandSurface();
            return;
          }
        }

        // (B) Check Dungeon Stairs Down
        if (gameState.mode === 'dungeon' && gameState.dungeonStairs && gameState.dungeonStairs.active) {
          const stDist = Math.hypot(p.x - gameState.dungeonStairs.x, p.y - gameState.dungeonStairs.y);
          if (stDist < 55) {
            descendToFloor2();
            return;
          }
        }

        // (C) Check Downed Civilians
        if (gameState.mode === 'dungeon' && gameState.downedCivilians) {
          for (let c = 0; c < gameState.downedCivilians.length; c++) {
            const civ = gameState.downedCivilians[c];
            if (!civ.rescued && Math.hypot(p.x - civ.x, p.y - civ.y) < 50) {
              civ.rescued = true;
              p.xp += 100;
              p.beans += 35;
              playSound('powerup');
              createImpactParticles(civ.x, civ.y, '#10b981', 15);
              addFloatingText("CIVILIAN STABILIZED! +100 XP", civ.x, civ.y - 20, '#10b981', 14);
              if (gameState.currentDungeon) gameState.currentDungeon.civiliansSaved++;
              updateQuestTrackerUI();
              return;
            }
          }
        }

        // (D) Check Overworld Dungeon Portals
        if (gameState.mode === 'overworld' && gameState.worldMap && gameState.worldMap.landmarks) {
          for (let l = 0; l < gameState.worldMap.landmarks.length; l++) {
            const lm = gameState.worldMap.landmarks[l];
            if (lm.hasDungeon && Math.hypot(p.x - lm.worldX, p.y - lm.worldY) < 65) {
              enterNeighborhoodDungeon(lm.dungeonId);
              return;
            }
          }
        }

        triggerDodge();
      }`;
content = content.replace(oldKeySpaceHandler, newKeySpaceHandler);

// 7. HOOK BOSS SLAY TO SPAWN PORTA-POTTY & UPDATE QUEST ON ENEMY KILL
const oldKillEnemy = `function killEnemy(enemy, idx) {`;
const newKillEnemy = `function killEnemy(enemy, idx) {
      if (gameState.currentDungeon) {
        if (enemy.archetypeId === 'fetty_zombie' || enemy.archetypeId === 'blood_siren') {
          gameState.currentDungeon.zombiesPurged++;
          updateQuestTrackerUI();
        }
        if (enemy.isBoss && gameState.currentDungeon.floor === 2) {
          gameState.currentDungeon.bossDefeated = true;
          spawnPortaPottyTownPortal();
        }
      }`;
content = content.replace(oldKillEnemy, newKillEnemy);

// 8. UPDATE update() FOR AMP STIM SPEED COUNTDOWN
const oldUpdateHpRegen = `if (p.regenRate > 0) {
        p.hp = Math.min(p.maxHp, p.hp + (p.regenRate * dt));
      }`;
const newUpdateHpRegen = `if (p.regenRate > 0) {
        p.hp = Math.min(p.maxHp, p.hp + (p.regenRate * dt));
      }

      // Amp Stim speed overdrive update
      if (p.ampActiveTimer > 0) {
        p.ampActiveTimer = Math.max(0, p.ampActiveTimer - dt);
        p.speed = p.baseSpeed * 1.85; // +85% sprint speed!
        if (Math.random() < 0.3) {
          createImpactParticles(p.x + (Math.random()-0.5)*12, p.y + 12, '#eab308', 2);
        }
        if (p.ampActiveTimer <= 0) {
          p.speed = p.baseSpeed;
          addFloatingText("AMP EXPIRED", p.x, p.y - 18, '#94a3b8', 12);
          updateAmpHUD();
        }
      }`;
content = content.replace(oldUpdateHpRegen, newUpdateHpRegen);

// 9. INSERT HUD QUEST TRACKER WIDGET & AMP PILL IN HTML
const hudLeftPillOld = `<div class="flex items-center gap-2">
      <!-- Player Rank / Level Crest -->`;

const hudLeftPillNew = `<div class="flex flex-col gap-1.5">
      <div class="flex items-center gap-2">
      <!-- Player Rank / Level Crest -->`;

content = content.replace(hudLeftPillOld, hudLeftPillNew);

// Append quest tracker under player bar
const hudPlayerBarEnd = `</div>
      </div>
    </div>`;

const hudQuestTrackerHTML = `</div>
      </div>
    </div>
    <!-- Live Neighborhood Quest Tracker -->
    <div id="hudQuestTracker" class="pointer-events-none select-none"></div>
  </div>`;

// Replace the first occurrence of player bar end
content = content.replace(hudPlayerBarEnd, hudQuestTrackerHTML);

// 10. ADD AMP STIM TOUCH BUTTON ON MOBILE
const touchButtonsOld = `<button id="btnAttackTouch" class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-600/80 active:bg-rose-500 border-2 border-rose-400 text-white font-black text-xl sm:text-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center cursor-pointer">
        ⚔️
      </button>`;

const touchButtonsNew = `<button id="btnAmpPill" onclick="useAmpStim()" class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-500/80 active:bg-amber-400 border-2 border-amber-300 text-slate-950 font-black text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center cursor-pointer font-mono" title="Amp Stim Overdrive (V)">
        ⚡
      </button>
      <button id="btnAttackTouch" class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-600/80 active:bg-rose-500 border-2 border-rose-400 text-white font-black text-xl sm:text-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center cursor-pointer">
        ⚔️
      </button>`;
content = content.replace(touchButtonsOld, touchButtonsNew);

fs.writeFileSync(rainBladePath, content, 'utf8');
console.log('Successfully applied Portland Neighborhood Dungeons, Diablo 3 Quests, Fetty Zombies, Amp Stims & Porta-Potty Portals! New size:', content.length);
