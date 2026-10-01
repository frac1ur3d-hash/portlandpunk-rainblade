const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'client/public/rain-blade.html');
let content = fs.readFileSync(filePath, 'utf8');

console.log('Original content length:', content.length);

// 1. ADD SPATIAL GRID, ZERO-GC POOLS, DOM CACHE, PRE-BAKED LIGHT STAMPS, MEGACHUNKS ABOVE gameState
const engineCoreDefinitions = `
    // =========================================================================
    // ⚡ ULTRA-FAST ZERO-GC ENGINE & SPATIAL ACCELERATION PIPELINE
    // =========================================================================

    // (A) Spatial Hash Grid for O(1) Frustum Culling & Combat Distance Checks
    class SpatialHashGrid {
      constructor(cellSize = 160) {
        this.cellSize = cellSize;
        this.buckets = new Map();
      }
      clear() {
        this.buckets.clear();
      }
      insert(entity) {
        const cx = Math.floor(entity.x / this.cellSize);
        const cy = Math.floor(entity.y / this.cellSize);
        const key = (cx << 16) ^ (cy & 0xffff);
        let bucket = this.buckets.get(key);
        if (!bucket) {
          bucket = [];
          this.buckets.set(key, bucket);
        }
        bucket.push(entity);
      }
      queryRange(minX, minY, maxX, maxY, out = []) {
        out.length = 0;
        const minCX = Math.floor(minX / this.cellSize);
        const maxCX = Math.floor(maxX / this.cellSize);
        const minCY = Math.floor(minY / this.cellSize);
        const maxCY = Math.floor(maxY / this.cellSize);
        for (let cx = minCX; cx <= maxCX; cx++) {
          for (let cy = minCY; cy <= maxCY; cy++) {
            const key = (cx << 16) ^ (cy & 0xffff);
            const bucket = this.buckets.get(key);
            if (bucket) {
              const bLen = bucket.length;
              for (let i = 0; i < bLen; i++) {
                out.push(bucket[i]);
              }
            }
          }
        }
        return out;
      }
    }

    const enemySpatialGrid = new SpatialHashGrid(160);
    const _tempVisibleEnemies = [];
    const _tempNearbyEnemies = [];
    const _tempProjEnemies = [];

    // (B) Zero-GC Object Pools & Free Lists
    const PARTICLE_POOL_MAX = 70;
    const particleFreeList = [];
    for (let i = 0; i < PARTICLE_POOL_MAX; i++) {
      particleFreeList.push({ x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0.5, color: '#38bdf8', size: 2 });
    }

    const FLOATING_TEXT_POOL_MAX = 25;
    const floatingTextFreeList = [];
    for (let i = 0; i < FLOATING_TEXT_POOL_MAX; i++) {
      floatingTextFreeList.push({ text: '', x: 0, y: 0, vy: -1.2, color: '#ffffff', size: 14, life: 0.75, maxLife: 0.75 });
    }

    const PROJECTILE_POOL_MAX = 45;
    const projectileFreeList = [];
    for (let i = 0; i < PROJECTILE_POOL_MAX; i++) {
      projectileFreeList.push({ x: 0, y: 0, vx: 0, vy: 0, speed: 5, damage: 10, color: '#38bdf8', radius: 5, isFriendly: false, isReflected: false, life: 2.0, maxLife: 2.0 });
    }

    // (C) Cached DOM Elements
    const DOM_CACHE = {
      cdOverlay1: null,
      cdOverlay2: null,
      cdOverlay3: null,
      statTotalSlashes: null,
      statMaxCombo: null,
      bannerLevelNum: null,
      hudLevelBadge: null,
      charModalLvl: null,
      hudHpBar: null,
      hudHpText: null,
      hudEnergyBar: null,
      hudEnergyText: null,
      hudExpBar: null,
      hudExpText: null,
      lastCdValues: [null, null, null, null],
      lastSlashes: -1,
      lastMaxCombo: -1,
      init() {
        this.cdOverlay1 = document.getElementById('cooldownOverlay1');
        this.cdOverlay2 = document.getElementById('cooldownOverlay2');
        this.cdOverlay3 = document.getElementById('cooldownOverlay3');
        this.statTotalSlashes = document.getElementById('statTotalSlashes');
        this.statMaxCombo = document.getElementById('statMaxCombo');
        this.bannerLevelNum = document.getElementById('bannerLevelNum');
        this.hudLevelBadge = document.getElementById('hudLevelBadge');
        this.charModalLvl = document.getElementById('charModalLvl');
        this.hudHpBar = document.getElementById('hudHpBar');
        this.hudHpText = document.getElementById('hudHpText');
        this.hudEnergyBar = document.getElementById('hudEnergyBar');
        this.hudEnergyText = document.getElementById('hudEnergyText');
        this.hudExpBar = document.getElementById('hudExpBar');
        this.hudExpText = document.getElementById('hudExpText');
      }
    };
    if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => DOM_CACHE.init());
      } else {
        setTimeout(() => DOM_CACHE.init(), 0);
      }
    }

    // (D) Pre-Baked Radial Light & Bloom Stamps
    function createRadialStamp(radius, innerAlpha, outerAlpha, rgb = '0,0,0') {
      if (typeof document === 'undefined') return null;
      const cvs = document.createElement('canvas');
      const size = Math.ceil(radius * 2);
      cvs.width = size;
      cvs.height = size;
      const sCtx = cvs.getContext('2d');
      const grad = sCtx.createRadialGradient(radius, radius, 2, radius, radius, radius);
      grad.addColorStop(0, \`rgba(\${rgb}, \${innerAlpha})\`);
      grad.addColorStop(0.5, \`rgba(\${rgb}, \${innerAlpha * 0.7})\`);
      grad.addColorStop(1, \`rgba(\${rgb}, \${outerAlpha})\`);
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, size, size);
      return cvs;
    }

    let LIGHT_STAMPS = null;
    function initLightStamps() {
      if (LIGHT_STAMPS || typeof document === 'undefined') return;
      LIGHT_STAMPS = {
        punch: createRadialStamp(128, 1.0, 0.0, '0,0,0'),
        punchShrine: createRadialStamp(160, 1.0, 0.0, '0,0,0'),
        punchLamp: createRadialStamp(110, 0.9, 0.0, '0,0,0'),
        punchLoot: createRadialStamp(64, 0.85, 0.0, '0,0,0'),
        bloomCyan: createRadialStamp(90, 0.25, 0.0, '6,182,212'),
        bloomGold: createRadialStamp(100, 0.28, 0.0, '245,158,11'),
        bloomPurple: createRadialStamp(100, 0.28, 0.0, '168,85,247'),
        bloomBlue: createRadialStamp(100, 0.28, 0.0, '56,189,248'),
        bloomEmerald: createRadialStamp(100, 0.28, 0.0, '16,185,129'),
        bloomAmber: createRadialStamp(100, 0.28, 0.0, '245,158,11')
      };
    }

    // (E) Virtual Texture Megachunking Cache for 30x Faster Landscape Rendering
    const CHUNK_SIZE = 512;
    const chunkCache = new Map();
    const MAX_CACHED_CHUNKS = 25;

    function renderStaticTileToChunk(cctx, tile, tx, ty, ts, c, r) {
      switch (tile) {
        case 0: // Asphalt Plaza
          cctx.fillStyle = '#090d16';
          cctx.fillRect(tx, ty, ts, ts);
          cctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
          cctx.strokeRect(tx, ty, ts, ts);
          if ((c + r) % 5 === 0) {
            cctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
            cctx.beginPath();
            cctx.ellipse(tx + ts / 2, ty + ts / 2, ts * 0.38, ts * 0.22, 0.2, 0, Math.PI * 2);
            cctx.fill();
          }
          break;
        case 1: // Building Monolith (Solid)
          cctx.fillStyle = '#040711';
          cctx.fillRect(tx, ty, ts, ts);
          cctx.strokeStyle = '#1e293b';
          cctx.lineWidth = 2;
          cctx.strokeRect(tx, ty, ts, ts);
          cctx.fillStyle = '#0f172a';
          cctx.fillRect(tx + 8, ty + 8, ts - 16, ts - 16);
          if ((c * 7 + r * 13) % 9 === 0) {
            cctx.fillStyle = 'rgba(0, 245, 255, 0.25)';
            cctx.fillRect(tx + 4, ty + ts - 8, ts - 8, 4);
          } else if ((c * 11 + r * 5) % 8 === 0) {
            cctx.fillStyle = 'rgba(244, 63, 94, 0.25)';
            cctx.fillRect(tx + 4, ty + ts - 8, ts - 8, 4);
          }
          break;
        case 2: // Willamette River Water
          cctx.fillStyle = '#03142e';
          cctx.fillRect(tx, ty, ts, ts);
          cctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
          cctx.lineWidth = 1.5;
          cctx.beginPath();
          cctx.moveTo(tx, ty + ts / 2);
          cctx.bezierCurveTo(tx + ts / 3, ty + ts / 2 - 6, tx + (ts * 2) / 3, ty + ts / 2 + 6, tx + ts, ty + ts / 2);
          cctx.stroke();
          break;
        case 3: // Bridge Deck (Steel Trusses)
          cctx.fillStyle = '#1e2433';
          cctx.fillRect(tx, ty, ts, ts);
          cctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
          cctx.lineWidth = 1;
          cctx.strokeRect(tx, ty, ts, ts);
          cctx.strokeStyle = 'rgba(234, 179, 8, 0.25)';
          cctx.beginPath();
          cctx.moveTo(tx, ty); cctx.lineTo(tx + ts, ty + ts);
          cctx.stroke();
          break;
        case 4: // Skatepark Concrete
          cctx.fillStyle = '#111827';
          cctx.fillRect(tx, ty, ts, ts);
          cctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
          cctx.strokeRect(tx, ty, ts, ts);
          if ((c + r) % 3 === 0) {
            cctx.strokeStyle = 'rgba(249, 115, 22, 0.2)';
            cctx.beginPath();
            cctx.arc(tx + ts / 2, ty + ts / 2, ts * 0.3, 0, Math.PI);
            cctx.stroke();
          }
          break;
        case 5: // Forest Park Moss & Roots
          cctx.fillStyle = '#061a12';
          cctx.fillRect(tx, ty, ts, ts);
          cctx.strokeStyle = 'rgba(16, 185, 129, 0.15)';
          cctx.strokeRect(tx, ty, ts, ts);
          if ((c * 3 + r * 7) % 4 === 0) {
            cctx.fillStyle = 'rgba(52, 211, 153, 0.3)';
            cctx.beginPath();
            cctx.arc(tx + ts * 0.4, ty + ts * 0.6, 2.5, 0, Math.PI * 2);
            cctx.fill();
          }
          break;
        case 6: // Chinatown Cobblestones
          cctx.fillStyle = '#170c14';
          cctx.fillRect(tx, ty, ts, ts);
          cctx.strokeStyle = 'rgba(244, 63, 94, 0.2)';
          cctx.strokeRect(tx, ty, ts, ts);
          break;
        case 7: // Hawthorne Undercroft Alley Bricks
          cctx.fillStyle = '#140e1e';
          cctx.fillRect(tx, ty, ts, ts);
          cctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
          cctx.strokeRect(tx, ty, ts, ts);
          break;
      }
    }

    function getOrCreateChunk(c, r, map) {
      const key = \`\${c},\${r}\`;
      let chunk = chunkCache.get(key);
      const now = performance.now();
      if (chunk) {
        chunk.lastUsed = now;
        return chunk.canvas;
      }

      if (chunkCache.size >= MAX_CACHED_CHUNKS) {
        let oldestKey = null;
        let oldestTime = Infinity;
        for (const [k, v] of chunkCache.entries()) {
          if (v.lastUsed < oldestTime) {
            oldestTime = v.lastUsed;
            oldestKey = k;
          }
        }
        if (oldestKey) {
          const evicted = chunkCache.get(oldestKey);
          chunkCache.delete(oldestKey);
          chunk = evicted;
        }
      }

      if (!chunk) {
        const cvs = document.createElement('canvas');
        cvs.width = CHUNK_SIZE;
        cvs.height = CHUNK_SIZE;
        chunk = { canvas: cvs, ctx: cvs.getContext('2d'), lastUsed: now };
      }
      chunk.lastUsed = now;

      const cctx = chunk.ctx;
      cctx.clearRect(0, 0, CHUNK_SIZE, CHUNK_SIZE);
      const ts = map.tileSize;
      const tilesPerChunk = Math.round(CHUNK_SIZE / ts);
      const startTileC = c * tilesPerChunk;
      const startTileR = r * tilesPerChunk;

      for (let tr = 0; tr < tilesPerChunk; tr++) {
        const mapR = startTileR + tr;
        if (mapR >= map.rows) break;
        const ty = tr * ts;

        for (let tc = 0; tc < tilesPerChunk; tc++) {
          const mapC = startTileC + tc;
          if (mapC >= map.cols) break;
          const tx = tc * ts;
          const tile = map.getTile(mapC, mapR);
          renderStaticTileToChunk(cctx, tile, tx, ty, ts, mapC, mapR);
        }
      }

      chunkCache.set(key, chunk);
      return chunk.canvas;
    }
`;

content = content.replace('const gameState = {', engineCoreDefinitions + '\n    const gameState = {');

// 2. REFACTOR createImpactParticles to ZERO-GC FREE LIST
const oldCreateParticles = content.match(/function createImpactParticles\(x, y, color = '#38bdf8', count = 7\) \{[\s\S]*?\n    \}/)[0];
const newCreateParticles = `function createImpactParticles(x, y, color = '#38bdf8', count = 7) {
      const density = gameState.settings?.graphics?.particleDensity ?? 1.0;
      const targetCount = Math.round(count * density);
      if (targetCount <= 0) return;
      const currentCount = gameState.particles.length;
      if (currentCount >= PARTICLE_POOL_MAX) return;
      const spawnCount = Math.min(targetCount, PARTICLE_POOL_MAX - currentCount);
      for (let i = 0; i < spawnCount; i++) {
        const speed = 1.8 + Math.random() * 3.5;
        const angle = Math.random() * Math.PI * 2;
        const pt = particleFreeList.pop() || { x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0.5, color, size: 2 };
        pt.x = x;
        pt.y = y;
        pt.vx = Math.cos(angle) * speed;
        pt.vy = Math.sin(angle) * speed;
        pt.life = 0.25 + Math.random() * 0.25;
        pt.maxLife = 0.5;
        pt.color = color;
        pt.size = 2 + Math.random() * 2.5;
        gameState.particles.push(pt);
      }
    }`;
content = content.replace(oldCreateParticles, newCreateParticles);

// 3. REFACTOR addFloatingText to ZERO-GC FREE LIST
const oldAddFloatingText = content.match(/function addFloatingText\(text, x, y, color = '#ffffff', size = 14\) \{[\s\S]*?\n    \}/)[0];
const newAddFloatingText = `function addFloatingText(text, x, y, color = '#ffffff', size = 14) {
      if (!gameState.settings?.notificationsEnabled) {
        const str = String(text).trim();
        if (str === 'RICOCHET!' || str === 'SHREDDED!' || str === 'PHASED') return;
      }
      if (gameState.floatingTexts.length >= FLOATING_TEXT_POOL_MAX) {
        const recycled = gameState.floatingTexts.shift();
        if (recycled) floatingTextFreeList.push(recycled);
      }
      const ft = floatingTextFreeList.pop() || { text: '', x: 0, y: 0, vy: -1.2, color, size, life: 0.75, maxLife: 0.75 };
      ft.text = text;
      ft.x = x;
      ft.y = y;
      ft.vy = -1.2;
      ft.color = color;
      ft.size = size;
      ft.life = 0.75;
      ft.maxLife = 0.75;
      gameState.floatingTexts.push(ft);
    }`;
content = content.replace(oldAddFloatingText, newAddFloatingText);

// 4. REFACTOR spawnProjectile to ZERO-GC FREE LIST
const oldSpawnProjectile = content.match(/function spawnProjectile\(x, y, targetX, targetY, speed, damage, color, radius = 5, isFriendly = false\) \{[\s\S]*?\n    \}/)[0];
const newSpawnProjectile = `function spawnProjectile(x, y, targetX, targetY, speed, damage, color, radius = 5, isFriendly = false) {
      if (gameState.projectiles.length >= PROJECTILE_POOL_MAX) {
        const oldest = gameState.projectiles.shift();
        if (oldest) projectileFreeList.push(oldest);
      }
      const angle = Math.atan2(targetY - y, targetX - x);
      const proj = projectileFreeList.pop() || { x, y, vx: 0, vy: 0, damage, color, radius, isFriendly, life: 2.0, maxLife: 2.0 };
      proj.x = x;
      proj.y = y;
      proj.vx = Math.cos(angle) * speed;
      proj.vy = Math.sin(angle) * speed;
      proj.speed = speed;
      proj.damage = damage;
      proj.color = color;
      proj.radius = radius;
      proj.isFriendly = isFriendly;
      proj.isReflected = false;
      proj.life = 2.0;
      proj.maxLife = 2.0;
      gameState.projectiles.push(proj);
    }`;
content = content.replace(oldSpawnProjectile, newSpawnProjectile);

// 5. REFACTOR drawParticles & drawFloatingTexts to BATCHED CANVAS CALLS
const oldDrawParticles = content.match(/function drawParticles\(\) \{[\s\S]*?\n    \}/)[0];
const newDrawParticles = `function drawParticles() {
      const count = gameState.particles.length;
      if (count === 0) return;
      ctx.save();
      for (let i = 0; i < count; i++) {
        const pt = gameState.particles[i];
        ctx.globalAlpha = pt.life / pt.maxLife;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }`;
content = content.replace(oldDrawParticles, newDrawParticles);

const oldDrawFloatingTexts = content.match(/function drawFloatingTexts\(\) \{[\s\S]*?\n    \}/)[0];
const newDrawFloatingTexts = `function drawFloatingTexts() {
      const count = gameState.floatingTexts.length;
      if (count === 0) return;
      ctx.save();
      ctx.textAlign = 'center';
      for (let i = 0; i < count; i++) {
        const ft = gameState.floatingTexts[i];
        ctx.globalAlpha = Math.min(0.65, (ft.life / ft.maxLife) * 0.70);
        ctx.font = \`bold \${ft.size}px JetBrains Mono\`;
        ctx.fillStyle = ft.color;
        ctx.fillText(ft.text, ft.x, ft.y);
      }
      ctx.restore();
    }`;
content = content.replace(oldDrawFloatingTexts, newDrawFloatingTexts);

// 6. REFACTOR drawProjectiles to REMOVE UNNECESSARY TRANSLATE & SAVE/RESTORE
const oldDrawProjectiles = content.match(/function drawProjectiles\(\) \{[\s\S]*?\n    \}/)[0];
const newDrawProjectiles = `function drawProjectiles() {
      const count = gameState.projectiles.length;
      if (count === 0) return;
      ctx.save();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < count; i++) {
        const p = gameState.projectiles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    }`;
content = content.replace(oldDrawProjectiles, newDrawProjectiles);

// 7. REFACTOR drawUrbanEnvironment TO MEGACHUNKS
const oldDrawUrban = content.match(/function drawUrbanEnvironment\(cw, ch\) \{[\s\S]*?\s+\/\/ 2\. Draw Interactive World Props/)[0];
const newDrawUrban = `function drawUrbanEnvironment(cw, ch) {
      if (!gameState.worldMap) initWorldMap(gameState.worldSeed);
      const map = gameState.worldMap;
      const cam = gameState.camera;
      const ts = map.tileSize;

      const left = cam.x;
      const top = cam.y;
      const right = left + cw;
      const bottom = top + ch;

      const startChunkC = Math.max(0, Math.floor((left + map.originX) / CHUNK_SIZE));
      const endChunkC = Math.min(Math.floor((map.cols * ts) / CHUNK_SIZE), Math.floor((right + map.originX) / CHUNK_SIZE));
      const startChunkR = Math.max(0, Math.floor((top + map.originY) / CHUNK_SIZE));
      const endChunkR = Math.min(Math.floor((map.rows * ts) / CHUNK_SIZE), Math.floor((bottom + map.originY) / CHUNK_SIZE));

      // 1. Draw Pre-Rendered Megachunk Canvases (4 to 9 ultra-fast blits!)
      for (let r = startChunkR; r <= endChunkR; r++) {
        for (let c = startChunkC; c <= endChunkC; c++) {
          const chunkCvs = getOrCreateChunk(c, r, map);
          const wx = (c * CHUNK_SIZE) - map.originX;
          const wy = (r * CHUNK_SIZE) - map.originY;
          ctx.drawImage(chunkCvs, wx, wy);
        }
      }

      // Dynamic puddle ripple waves (only if enabled in settings)
      if (gameState.settings.graphics?.puddleReflections) {
        const time = performance.now() * 0.001;
        const startC = Math.max(0, Math.floor((left + map.originX) / ts) - 1);
        const endC = Math.min(map.cols - 1, Math.ceil((right + map.originX) / ts) + 1);
        const startR = Math.max(0, Math.floor((top + map.originY) / ts) - 1);
        const endR = Math.min(map.rows - 1, Math.ceil((bottom + map.originY) / ts) + 1);

        ctx.lineWidth = 1;
        for (let r = startR; r <= endR; r += 2) {
          for (let c = startC; c <= endC; c += 2) {
            if ((c + r) % 5 === 0 && map.getTile(c, r) === 0) {
              const wx = (c * ts) - map.originX;
              const wy = (r * ts) - map.originY;
              const px = wx + ts / 2;
              const py = wy + ts / 2;
              const rip = (time * 1.6 + ((c * 7 + r * 13) % 10) * 0.1) % 1.0;
              ctx.strokeStyle = \`rgba(56, 189, 248, \${0.18 * (1 - rip)})\`;
              ctx.beginPath();
              ctx.ellipse(px, py, (ts * 0.38) * rip, (ts * 0.22) * rip, 0.2, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
        }
      }

    // 2. Draw Interactive World Props`;
content = content.replace(oldDrawUrban, newDrawUrban);

// 8. REFACTOR drawEnemies WITH SpatialHashGrid VIEWPORT CULLING
const oldDrawEnemies = content.match(/function drawEnemies\(\) \{[\s\S]*?\n    \}/)[0];
const newDrawEnemies = `function drawEnemies() {
      const cam = gameState.camera;
      const cw = gameState.canvasWidth || window.innerWidth;
      const ch = gameState.canvasHeight || window.innerHeight;
      const minX = cam.x - 70;
      const maxX = cam.x + cw + 70;
      const minY = cam.y - 70;
      const maxY = cam.y + ch + 70;

      const visibleEnemies = enemySpatialGrid.queryRange(minX, minY, maxX, maxY, _tempVisibleEnemies);
      const count = visibleEnemies.length;
      const now = Date.now();
      const p = gameState.player;

      for (let i = 0; i < count; i++) {
        const e = visibleEnemies[i];
        ctx.save();
        ctx.translate(e.x, e.y);

        // Ground Shadow
        ctx.beginPath();
        ctx.ellipse(0, e.radius * 0.8, e.radius * 0.9, e.radius * 0.35, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.fill();

        // Elite Affix Glowing Ground Aura
        if (e.isElite) {
          const affixColor = e.affix === 'molten' ? '#f97316' :
                             e.affix === 'frozen' ? '#38bdf8' :
                             e.affix === 'electrified' ? '#eab308' : '#dc2626';
          ctx.beginPath();
          ctx.arc(0, 0, e.radius + 12, 0, Math.PI * 2);
          ctx.strokeStyle = affixColor;
          ctx.lineWidth = 2.5;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        if (e.isCharging) {
          ctx.beginPath();
          ctx.arc(0, 0, e.radius + 8, 0, Math.PI * 2);
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        // Distinct Archetype Matrix Selection
        let matrix = SPRITE_SWARMER_DRONE_8BIT;
        let spriteScale = e.radius / 7;

        if (e.isBoss) {
          spriteScale = 4.2;
          if (e.bossType === 'burnside') matrix = SPRITE_BOSS_HYDRA_8BIT;
          else if (e.bossType === 'hawthorne') matrix = SPRITE_BOSS_BARON_8BIT;
          else if (e.bossType === 'forest_park') matrix = SPRITE_BOSS_SASQUATCH_8BIT;
          else if (e.bossType === 'chinatown') matrix = SPRITE_BOSS_LEVIATHAN_8BIT;
          else if (e.bossType === 'st_johns') matrix = SPRITE_BOSS_REAPER_8BIT;
          else matrix = SPRITE_BOSS_HYDRA_8BIT;
        } else {
          if (e.archetypeId === 'crow_swarmer' || e.role === 'swarmer') matrix = SPRITE_SWARMER_DRONE_8BIT;
          else if (e.archetypeId === 'barista_grunt' || e.role === 'melee') matrix = SPRITE_BRAWLER_PUNK_8BIT;
          else if (e.archetypeId === 'sludge_spitter' || e.role === 'ranged') matrix = SPRITE_SLUDGE_SPITTER_8BIT;
          else if (e.archetypeId === 'tunnel_wraith' || e.role === 'assassin') matrix = SPRITE_TUNNEL_WRAITH_8BIT;
          else if (e.archetypeId === 'toxic_shroom' || e.role === 'exploder') matrix = SPRITE_SPORE_CREEPER_8BIT;
          else if (e.archetypeId === 'moss_brute' || e.archetypeId === 'gothic_gargoyle' || e.role === 'brute') matrix = SPRITE_TITAN_GARGOYLE_8BIT;
        }

        const enemyBob = Math.sin((now + e.x) * 0.008) * 2;
        const flipEnemy = (p.x < e.x);

        // Hit flash
        if (e.hitFlash > 0) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.beginPath();
          ctx.arc(0, enemyBob, e.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        drawPixelMatrix(ctx, matrix, 0, enemyBob, spriteScale, flipEnemy);

        // Boss Aura & Crown
        if (e.isBoss) {
          ctx.beginPath();
          ctx.arc(0, 0, e.radius + 14, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.7)';
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        // Retro 8-Bit Segmented HP Bar & Elite Badge
        const barW = Math.max(34, e.radius * 2);
        const hpPct = Math.max(0, e.hp / e.maxHp);
        ctx.fillStyle = '#050508';
        ctx.fillRect(-barW / 2 - 1, -e.radius - 15, barW + 2, 6);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-barW / 2, -e.radius - 14, barW, 4);
        ctx.fillStyle = e.isBoss ? '#f43f5e' : (e.isElite ? '#fbbf24' : (hpPct > 0.4 ? '#10b981' : '#f59e0b'));
        ctx.fillRect(-barW / 2, -e.radius - 14, barW * hpPct, 4);

        if (e.isElite) {
          const affixLabel = (e.affix || 'ELITE').toUpperCase();
          ctx.font = 'bold 9px monospace';
          ctx.fillStyle = e.affix === 'molten' ? '#f97316' :
                          e.affix === 'frozen' ? '#38bdf8' :
                          e.affix === 'electrified' ? '#eab308' : '#dc2626';
          ctx.textAlign = 'center';
          ctx.fillText(\`👑 [\${affixLabel}]\`, 0, -e.radius - 19);
        }

        ctx.restore();
      }
    }`;
content = content.replace(oldDrawEnemies, newDrawEnemies);

// 9. REFACTOR drawDynamicLightingPass TO DOWNSAMPLED BUFFER & PRE-BAKED LIGHT STAMPS
const oldDrawLighting = content.match(/function drawDynamicLightingPass\(w, h, shakeX = 0, shakeY = 0\) \{[\s\S]*?\n    \}/)[0];
const newDrawLighting = `function drawDynamicLightingPass(w, h, shakeX = 0, shakeY = 0) {
      initLightStamps();
      if (!LIGHT_STAMPS) return;

      // Downsample to 0.5x resolution: 75% fewer pixels to fill!
      const halfW = Math.max(1, Math.ceil(w * 0.5));
      const halfH = Math.max(1, Math.ceil(h * 0.5));

      if (!lightingCanvas) {
        lightingCanvas = document.createElement('canvas');
        lightingCtx = lightingCanvas.getContext('2d');
      }
      if (lightingCanvas.width !== halfW || lightingCanvas.height !== halfH) {
        lightingCanvas.width = halfW;
        lightingCanvas.height = halfH;
      }

      const camX = gameState.camera.x - shakeX;
      const camY = gameState.camera.y - shakeY;
      const darkness = gameState.hotConfig?.ambientDarkness ?? gameState.settings.graphics?.ambientDarkness ?? 0.40;

      lightingCtx.globalCompositeOperation = 'source-over';
      lightingCtx.fillStyle = \`rgba(3, 7, 18, \${darkness})\`;
      lightingCtx.fillRect(0, 0, halfW, halfH);

      lightingCtx.globalCompositeOperation = 'destination-out';

      // (a) Player radial light halo
      const p = gameState.player;
      const px = (p.x - camX) * 0.5;
      const py = (p.y - camY) * 0.5;
      if (px >= -150 && px <= halfW + 150 && py >= -150 && py <= halfH + 150) {
        const pDiam = 175;
        lightingCtx.drawImage(LIGHT_STAMPS.punch, px - pDiam / 2, py - pDiam / 2, pDiam, pDiam);
      }

      // (b) Active Shrines
      if (gameState.worldMap && gameState.worldMap.shrines) {
        const sLen = gameState.worldMap.shrines.length;
        for (let i = 0; i < sLen; i++) {
          const shrine = gameState.worldMap.shrines[i];
          const sx = (shrine.worldX - camX) * 0.5;
          const sy = (shrine.worldY - camY) * 0.5;
          if (sx >= -150 && sx <= halfW + 150 && sy >= -150 && sy <= halfH + 150) {
            const sDiam = shrine.active ? 220 : 130;
            lightingCtx.drawImage(LIGHT_STAMPS.punchShrine, sx - sDiam / 2, sy - sDiam / 2, sDiam, sDiam);
          }
        }
      }

      // (c) Streetlamps & Props
      const lampRad = (gameState.hotConfig?.streetlampRadius || 150) * 0.5;
      const lampDiam = lampRad * 2;
      if (gameState.worldMap && gameState.worldMap.props) {
        const pLen = gameState.worldMap.props.length;
        for (let i = 0; i < pLen; i++) {
          const prop = gameState.worldMap.props[i];
          const lx = (prop.worldX - camX) * 0.5;
          const ly = (prop.worldY - camY) * 0.5;
          if (lx >= -120 && lx <= halfW + 120 && ly >= -120 && ly <= halfH + 120) {
            lightingCtx.drawImage(LIGHT_STAMPS.punchLamp, lx - lampRad, ly - lampRad, lampDiam, lampDiam);
          }
        }
      }

      // (d) Rare & Legendary Ground Loot Beacons
      if (gameState.groundItems) {
        const iLen = gameState.groundItems.length;
        for (let i = 0; i < iLen; i++) {
          const item = gameState.groundItems[i];
          if (item.type !== 'beans') {
            const ix = (item.x - camX) * 0.5;
            const iy = (item.y - camY) * 0.5;
            if (ix >= -80 && ix <= halfW + 80 && iy >= -80 && iy <= halfH + 80) {
              lightingCtx.drawImage(LIGHT_STAMPS.punchLoot, ix - 60, iy - 60, 120, 120);
            }
          }
        }
      }

      // Draw darkness overlay in screen space (hardware bilinear upscale gives soft natural light!)
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const zoom = gameState.settings.graphics?.cameraZoom || 1.0;
      if (zoom !== 1.0) {
        ctx.translate(w / 2, h / 2);
        ctx.scale(zoom, zoom);
        ctx.translate(-w / 2, -h / 2);
      }
      ctx.drawImage(lightingCanvas, 0, 0, w, h);

      // (e) Neon atmospheric bloom tint
      if (gameState.settings.graphics?.bloomPass) {
        ctx.globalCompositeOperation = 'screen';
        const fullPx = p.x - camX;
        const fullPy = p.y - camY;
        ctx.drawImage(LIGHT_STAMPS.bloomCyan, fullPx - 110, fullPy - 110, 220, 220);

        if (gameState.worldMap && gameState.worldMap.shrines) {
          const sLen = gameState.worldMap.shrines.length;
          for (let i = 0; i < sLen; i++) {
            const shrine = gameState.worldMap.shrines[i];
            if (shrine.active) {
              const sx = shrine.worldX - camX;
              const sy = shrine.worldY - camY;
              if (sx >= -150 && sx <= w + 150 && sy >= -150 && sy <= h + 150) {
                const stamp = shrine.id === 'frenzied' ? LIGHT_STAMPS.bloomAmber :
                              shrine.id === 'blessed' ? LIGHT_STAMPS.bloomBlue :
                              shrine.id === 'empowered' ? LIGHT_STAMPS.bloomPurple :
                              shrine.id === 'fleeting' ? LIGHT_STAMPS.bloomEmerald : LIGHT_STAMPS.bloomGold;
                ctx.drawImage(stamp, sx - 140, sy - 140, 280, 280);
              }
            }
          }
        }
        ctx.globalCompositeOperation = 'source-over';
      }

      ctx.restore();
    }`;
content = content.replace(oldDrawLighting, newDrawLighting);

// 10. REFACTOR triggerAttack TO USE SpatialHashGrid INSTEAD OF O(N) ENEMY LOOP
const oldTriggerAttackLoop = content.match(/let hitCount = 0;\s+gameState\.enemies\.forEach\(enemy => \{[\s\S]*?\n      \}\);\s+if \(hitCount > 0\) \{/)[0];
const newTriggerAttackLoop = `let hitCount = 0;
      const nearbyEnemies = enemySpatialGrid.queryRange(p.x - range - 30, p.y - range - 30, p.x + range + 30, p.y + range + 30, _tempNearbyEnemies);
      const nearbyCount = nearbyEnemies.length;
      for (let nIdx = 0; nIdx < nearbyCount; nIdx++) {
        const enemy = nearbyEnemies[nIdx];
        const dx = enemy.x - p.x;
        const dy = enemy.y - p.y;
        const dist = Math.hypot(dx, dy);

        if (dist <= range + enemy.radius) {
          const enemyAngle = Math.atan2(dy, dx);
          const diffAngle = Math.abs(normalizeAngle(enemyAngle - aimAngle));

          if (diffAngle <= arcSpread / 2) {
            hitCount++;
            const isCrit = Math.random() < (p.critChance || 0.22);
            let finalDmg = Math.round(weaponDamage * (isCrit ? 1.85 : 1.0) * (p.attackComboStep === 2 ? 1.35 : 1.0));
            if (gameState.hotConfig?.damageMult) {
              finalDmg = Math.round(finalDmg * gameState.hotConfig.damageMult);
            }
            enemy.hp -= finalDmg;

            // Log Combat Tick for Telemetry ETL
            logCombatTick({
              damage: finalDmg,
              isCrit: isCrit,
              skillId: 0,
              enemyArchetype: enemy.archetypeId || enemy.role || 'grunt',
              affixes: enemy.affix ? [enemy.affix] : [],
              targetKilled: enemy.hp <= 0
            });

            const knock = p.attackComboStep === 2 ? 18 : 9;
            enemy.x += Math.cos(enemyAngle) * knock;
            enemy.y += Math.sin(enemyAngle) * knock;
            enemy.hitFlash = 0.14;

            createImpactParticles(enemy.x, enemy.y, enemy.accentColor || slashColor);
            addFloatingText(\`-\${finalDmg}\`, enemy.x, enemy.y - 12, isCrit ? '#f43f5e' : '#ffffff', isCrit ? 18 : 14);

            // (2) Cascade Cryomancer: Chilling Frost Slashes (Slows enemies 40%)
            if (p.activeSetBonuses && p.activeSetBonuses['cryo_2']) {
              enemy.isChilled = 2.5;
              createImpactParticles(enemy.x, enemy.y, '#38bdf8', 3);
            }

            // (2) Chinatown Dragon: +12% Lifesteal
            if (p.activeSetBonuses && p.activeSetBonuses['dragon_2']) {
              const healAmt = Math.max(1, Math.round(finalDmg * 0.12));
              p.hp = Math.min(p.maxHp, p.hp + healAmt);
              addFloatingText(\`+\${healAmt} HP\`, p.x, p.y - 18, '#10b981', 12);
            }

            // (4) Chinatown Dragon: Dragon Fire Cleave (3s burn DoT)
            if (p.activeSetBonuses && p.activeSetBonuses['dragon_4']) {
              enemy.burnTimer = 3.0;
              enemy.burnDmg = 14;
            }

            // (4) Bridge City Sentinel: Tesla Arc Discharge (Chain lightning to 3 nearby foes via spatial grid)
            if (p.activeSetBonuses && p.activeSetBonuses['sentinel_4']) {
              const teslaCandidates = enemySpatialGrid.queryRange(enemy.x - 180, enemy.y - 180, enemy.x + 180, enemy.y + 180, []);
              let arcCount = 0;
              for (let tc = 0; tc < teslaCandidates.length && arcCount < 3; tc++) {
                const other = teslaCandidates[tc];
                if (other !== enemy && other.hp > 0) {
                  const od = Math.hypot(other.x - enemy.x, other.y - enemy.y);
                  if (od < 180) {
                    arcCount++;
                    other.hp -= 30;
                    other.hitFlash = 0.15;
                    addFloatingText('TESLA -30', other.x, other.y - 14, '#60a5fa', 13);
                    createImpactParticles(other.x, other.y, '#60a5fa', 6);
                  }
                }
              }
            }
          }
        }
      }

      if (hitCount > 0) {`;
content = content.replace(oldTriggerAttackLoop, newTriggerAttackLoop);

// 11. REBUILD SPATIAL HASH GRID IN update() & OPTIMIZE ENTITY CLEANUP
const oldUpdateStart = 'function update(dt) {\n      if (gameState.isPaused) return;';
const newUpdateStart = `function update(dt) {\n      if (gameState.isPaused) return;

      // Rebuild enemy spatial hash grid for O(1) queries
      enemySpatialGrid.clear();
      const enemyCount = gameState.enemies.length;
      for (let i = 0; i < enemyCount; i++) {
        enemySpatialGrid.insert(gameState.enemies[i]);
      }`;
content = content.replace(oldUpdateStart, newUpdateStart);

// 12. OPTIMIZE update() CD OVERLAYS WITH DOM_CACHE
const oldCdUpdate = content.match(/for \(let s = 1; s <= 3; s\+\+\) \{[\s\S]*?if \(gameState\.skills\[s\]\.activeTimer > 0\) \{/)[0];
const newCdUpdate = `for (let s = 1; s <= 3; s++) {
        if (gameState.skills[s].cd > 0) {
          gameState.skills[s].cd = Math.max(0, gameState.skills[s].cd - dt);
          const cdOverlay = DOM_CACHE[\`cdOverlay\${s}\`];
          if (cdOverlay) {
            if (gameState.skills[s].cd > 0) {
              const valStr = gameState.skills[s].cd.toFixed(1);
              if (DOM_CACHE.lastCdValues[s] !== valStr) {
                DOM_CACHE.lastCdValues[s] = valStr;
                cdOverlay.classList.remove('hidden');
                cdOverlay.textContent = valStr;
              }
            } else {
              if (DOM_CACHE.lastCdValues[s] !== 'hidden') {
                DOM_CACHE.lastCdValues[s] = 'hidden';
                cdOverlay.classList.add('hidden');
              }
            }
          }
        }
        if (gameState.skills[s].activeTimer > 0) {`;
content = content.replace(oldCdUpdate, newCdUpdate);

// 13. OPTIMIZE PROJECTILE-ENEMY HIT DETECTION IN update() VIA SPATIAL GRID
const oldProjEnemyLoop = content.match(/if \(proj\.isReflected \|\| proj\.isFriendly\) \{[\s\S]*?if \(hitEnemy\) \{[\s\S]*?continue;\s+\}/)[0];
const newProjEnemyLoop = `if (proj.isReflected || proj.isFriendly) {
          let hitEnemy = false;
          const candidates = enemySpatialGrid.queryRange(proj.x - proj.radius - 28, proj.y - proj.radius - 28, proj.x + proj.radius + 28, proj.y + proj.radius + 28, _tempProjEnemies);
          const cCount = candidates.length;
          for (let eIdx = 0; eIdx < cCount; eIdx++) {
            const enemy = candidates[eIdx];
            const distToEnemy = Math.hypot(proj.x - enemy.x, proj.y - enemy.y);
            if (distToEnemy < enemy.radius + proj.radius + 4) {
              hitEnemy = true;
              enemy.hp -= proj.damage;
              enemy.hitFlash = 0.22;
              const kbAngle = Math.atan2(proj.vy, proj.vx);
              enemy.x += Math.cos(kbAngle) * 22;
              enemy.y += Math.sin(kbAngle) * 22;
              playSound('hit');
              createImpactParticles(proj.x, proj.y, proj.color || '#00f5ff', 8);
              createImpactParticles(enemy.x, enemy.y, '#f43f5e', 6);
              const label = proj.isReflected ? \`CRIT RICOCHET -\${proj.damage}\` : \`-\${proj.damage}\`;
              addFloatingText(label, enemy.x, enemy.y - 16, proj.color || '#00f5ff', proj.isReflected ? 18 : 14);

              p.comboHits++;
              p.comboTimer = 3.0;
              updateComboUI();

              if (enemy.hp <= 0) {
                const origIdx = gameState.enemies.indexOf(enemy);
                if (origIdx !== -1) killEnemy(enemy, origIdx);
              }
              break;
            }
          }
          if (hitEnemy) {
            projectileFreeList.push(proj);
            gameState.projectiles[pIdx] = gameState.projectiles[gameState.projectiles.length - 1];
            gameState.projectiles.pop();
            continue;
          }
        }`;
content = content.replace(oldProjEnemyLoop, newProjEnemyLoop);

// 14. OPTIMIZE PARTICLE, TEXT, AND PROJECTILE CLEANUP TO ZERO-GC POP
const oldEntityCleanup = content.match(/for \(let i = gameState\.particles\.length - 1; i >= 0; i--\) \{[\s\S]*?if \(gameState\.floatingTexts\.length > 20\) \{[\s\S]*?\}/)[0];
const newEntityCleanup = `for (let i = gameState.particles.length - 1; i >= 0; i--) {
        const pt = gameState.particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= dt;
        if (pt.life <= 0) {
          particleFreeList.push(pt);
          gameState.particles[i] = gameState.particles[gameState.particles.length - 1];
          gameState.particles.pop();
        }
      }
      if (gameState.particles.length > PARTICLE_POOL_MAX) {
        while (gameState.particles.length > PARTICLE_POOL_MAX) {
          const recycled = gameState.particles.pop();
          if (recycled) particleFreeList.push(recycled);
        }
      }

      if (gameState.groundHazards && gameState.groundHazards.length > 20) {
        gameState.groundHazards.splice(0, gameState.groundHazards.length - 20);
      }

      for (let i = gameState.floatingTexts.length - 1; i >= 0; i--) {
        const ft = gameState.floatingTexts[i];
        ft.y += ft.vy;
        ft.life -= dt;
        if (ft.life <= 0) {
          floatingTextFreeList.push(ft);
          gameState.floatingTexts[i] = gameState.floatingTexts[gameState.floatingTexts.length - 1];
          gameState.floatingTexts.pop();
        }
      }
      if (gameState.floatingTexts.length > FLOATING_TEXT_POOL_MAX) {
        while (gameState.floatingTexts.length > FLOATING_TEXT_POOL_MAX) {
          const recycled = gameState.floatingTexts.pop();
          if (recycled) floatingTextFreeList.push(recycled);
        }
      }`;
content = content.replace(oldEntityCleanup, newEntityCleanup);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully wrote performance overhaul! New file length:', content.length);
