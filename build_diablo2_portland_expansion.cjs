// build_diablo2_portland_expansion.cjs
// Completely implements all 7 architectural decisions for Kyle McLeod's Diablo 2 Portlandpunk overhaul:

const fs = require('fs');
const path = require('path');

const targetPath = path.resolve('E:/portlandpunk/client/public/rain-blade.html');
console.log('Target file:', targetPath);
let html = fs.readFileSync(targetPath, 'utf8');

// =============================================================================
// STEP 1: CSS STYLES (Diablo 2 HUD, Globes, Notched XP Bar, Automap, Sanctuary)
// =============================================================================
const d2Styles = `
  /* === DIABLO 2 DUAL GLOBES, AUTOMAP & GOTHIC INTERFACE STYLES === */
  .text-shadow-d2 {
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 2px 5px rgba(0,0,0,0.9);
  }
  .d2-stone-btn {
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 4px rgba(0,0,0,0.8);
    transition: all 0.1s ease;
  }
  .d2-stone-btn:hover {
    filter: brightness(1.25);
    transform: translateY(-1px);
  }
  .d2-stone-btn:active {
    filter: brightness(0.9);
    transform: translateY(1px);
  }
  @keyframes bloodSwirl {
    0% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(1.04); }
    100% { transform: rotate(360deg) scale(1); }
  }
  @keyframes manaSwirl {
    0% { transform: rotate(360deg) scale(1); }
    50% { transform: rotate(180deg) scale(1.05); }
    100% { transform: rotate(0deg) scale(1); }
  }
  .blood-swirl-particles {
    position: absolute;
    inset: -10px;
    background: radial-gradient(circle at 30% 30%, rgba(254, 202, 202, 0.25), transparent 50%),
                radial-gradient(circle at 70% 60%, rgba(185, 28, 28, 0.4), transparent 60%);
    animation: bloodSwirl 8s linear infinite;
    pointer-events: none;
  }
  .mana-swirl-particles {
    position: absolute;
    inset: -10px;
    background: radial-gradient(circle at 30% 30%, rgba(191, 219, 254, 0.3), transparent 50%),
                radial-gradient(circle at 70% 60%, rgba(37, 99, 235, 0.45), transparent 60%);
    animation: manaSwirl 7s linear infinite;
    pointer-events: none;
  }
  #automapOverlayContainer {
    pointer-events: none;
  }
  #automapOverlayContainer canvas {
    pointer-events: none;
  }
  /* Hide the top heavy dashboard header so 95% screen is open gameplay */
  #topNavHeader {
    display: none !important;
  }
`;

if (!html.includes('DIABLO 2 DUAL GLOBES, AUTOMAP & GOTHIC INTERFACE STYLES')) {
  html = html.replace('</style>', d2Styles + '\n</style>');
  console.log('✓ Added Diablo 2 CSS styles');
}

// =============================================================================
// STEP 2: CLEAN UP TOP-HEAVY DASHBOARD CARDS & TACTICAL ACTION BAR
// =============================================================================
// Ensure header has id="topNavHeader" and class="hidden"
html = html.replace(/<header\s+class="w-full\s+z-20\s+glass-panel[^>]*>/, '<header id="topNavHeader" class="hidden">');

// Hide #tacticalActionBar
html = html.replace(/<div\s+id="tacticalActionBar"\s+class="[^"]*"/, '<div id="tacticalActionBar" class="hidden"');

// Hide old experience gauge at bottom
html = html.replace(/<!-- Experience Gauge \(Translucent\) -->\s*<div\s+class="absolute bottom-2[^>]*>/, '<!-- Experience Gauge (Replaced by Diablo 2 Notched Bar) -->\n    <div class="hidden">');

// =============================================================================
// STEP 3: INITIAL PLAYER SPAWN & RESIDENCE MODE IN SANCTUARY HUB
// =============================================================================
// Set initial player spawn to (0, 80) inside Sanctuary Hub
html = html.replace(/player:\s*\{\s*x:\s*\d+,\s*\/\/[^\n]*\s*y:\s*\d+,/, 'player: {\n        x: 0, // Spawn inside Portland Safehouse Sanctuary Hub\n        y: 80,');

// Set gameState.mode = 'residence'
html = html.replace(/gameState\.mode\s*=\s*'overworld';/g, "gameState.mode = 'residence';");

// =============================================================================
// STEP 4: INJECT AUTHENTIC DIABLO 2 BOTTOM HUD INTO HTML
// =============================================================================
const diablo2HUD_HTML = `
  <!-- ========================================================================= -->
  <!-- ⚔️ AUTHENTIC DIABLO 2 BOTTOM INTERFACE HUD & DUAL GLOBES -->
  <!-- ========================================================================= -->
  <div id="diablo2BottomHud" class="fixed bottom-0 left-0 right-0 z-40 pointer-events-none select-none flex flex-col items-center font-mono">
    
    <!-- Main Diablo 2 Dock Bar -->
    <div class="relative w-full max-w-4xl px-2 pb-1 flex items-end justify-between pointer-events-none">
      
      <!-- LEFT: DEMONIC LIFE GLOBE & STAMINA BAR -->
      <div class="flex items-end gap-2 pointer-events-auto">
        <!-- Diablo 2 Red Life Globe (104px) -->
        <div class="relative w-26 h-26 rounded-full p-1 bg-gradient-to-b from-stone-800 via-stone-900 to-black border-2 border-stone-700 shadow-[0_0_25px_rgba(220,38,38,0.55)] flex items-center justify-center overflow-hidden group cursor-pointer" onclick="usePotion(1)" title="Life Globe (Click to drink Cold Brew) [1]">
          <!-- Gothic Stone Bezel Ring -->
          <div class="absolute inset-0 rounded-full border-4 border-stone-900/90 pointer-events-none z-20"></div>
          <div class="absolute -top-0.5 left-1/2 -translate-x-1/2 text-[9px] font-black text-rose-500/90 z-20 tracking-widest uppercase">LIFE</div>
          
          <!-- Blood Sphere Interior -->
          <div class="relative w-full h-full rounded-full bg-stone-950 overflow-hidden flex items-end justify-center">
            <!-- Animated Liquid Blood -->
            <div id="d2LifeGlobeFill" class="w-full bg-gradient-to-t from-red-950 via-rose-700 to-red-500 transition-all duration-200 relative overflow-hidden" style="height: 100%;">
              <div class="absolute top-0 left-0 right-0 h-2 bg-rose-400/60 animate-pulse"></div>
              <div class="blood-swirl-particles"></div>
            </div>
            <!-- Glass highlight reflection overlay -->
            <div class="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 via-transparent to-black/50 pointer-events-none z-10"></div>
          </div>

          <!-- Centered HP Text Overlay -->
          <div class="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
            <span id="d2LifeText" class="text-xs sm:text-sm font-black text-white font-mono tracking-tight text-shadow-d2">120 / 120</span>
          </div>
        </div>

        <!-- Green Stamina / Dash Meter -->
        <div class="flex flex-col items-center gap-0.5 mb-1.5" title="Stamina / Sprint Dash Gauge [SPACE]">
          <div class="w-3.5 h-20 bg-stone-950 rounded-full border border-stone-700 p-0.5 overflow-hidden flex items-end">
            <div id="d2StaminaBarFill" class="w-full bg-gradient-to-t from-emerald-800 to-emerald-400 rounded-full transition-all duration-150" style="height: 100%;"></div>
          </div>
          <span class="text-[8px] font-bold text-emerald-400">STAM</span>
        </div>
      </div>

      <!-- CENTER: BELT, SKILLS & CARVED STONE BUTTONS -->
      <div class="flex flex-col items-center gap-1.5 mb-1 pointer-events-auto">
        
        <!-- Top Row: Carved Stone Utility Buttons -->
        <div class="flex items-center gap-1.5 bg-stone-950/85 px-3 py-1 rounded-xl border border-stone-700/80 shadow-2xl backdrop-blur-xs">
          <button onclick="toggleModal('inventoryModal')" class="d2-stone-btn px-2.5 py-1 rounded bg-stone-900 border border-stone-600 hover:border-amber-400/80 text-[10px] font-bold text-amber-200 hover:text-white transition-all shadow active:scale-95 flex items-center gap-1" title="Hero Inventory & Stash [I]">
            <span>🎒 [INV]</span>
          </button>
          <button onclick="openQuestLogModal()" class="d2-stone-btn px-2.5 py-1 rounded bg-stone-900 border border-stone-600 hover:border-amber-400/80 text-[10px] font-bold text-amber-200 hover:text-white transition-all shadow active:scale-95 flex items-center gap-1" title="District Quests & Bounties [Q]">
            <span>📜 [QST]</span>
          </button>
          <button onclick="castTownPortal()" class="d2-stone-btn px-2.5 py-1 rounded bg-stone-900 border border-stone-600 hover:border-amber-400/80 text-[10px] font-bold text-sky-300 hover:text-white transition-all shadow active:scale-95 flex items-center gap-1" title="Town Portal to Safehouse Sanctuary [T]">
            <span>🌀 [TP]</span>
          </button>
          <button onclick="swapGearLoadout()" class="d2-stone-btn px-2.5 py-1 rounded bg-stone-900 border border-stone-600 hover:border-amber-400/80 text-[10px] font-bold text-amber-300 hover:text-white transition-all shadow active:scale-95 flex items-center gap-1" title="Swap Weapon Loadout [X]">
            <span>⚔️ [SWAP]</span>
          </button>
          <button onclick="toggleAutomap()" class="d2-stone-btn px-2.5 py-1 rounded bg-stone-900 border border-stone-600 hover:border-amber-400/80 text-[10px] font-bold text-emerald-300 hover:text-white transition-all shadow active:scale-95 flex items-center gap-1" title="Toggle Fullscreen Automap [TAB]">
            <span>🗺️ [MAP]</span>
          </button>
          <button onclick="toggleBetaTelemetryModal()" class="d2-stone-btn px-2.5 py-1 rounded bg-stone-900 border border-stone-600 hover:border-amber-400/80 text-[10px] font-bold text-teal-300 hover:text-white transition-all shadow active:scale-95 flex items-center gap-1" title="Beta Telemetry & Hot-Patch Studio [F1]">
            <span>🛰️ [BETA]</span>
          </button>
        </div>

        <!-- Bottom Row: Primary Skills + 4-Slot Potion Belt -->
        <div class="flex items-center gap-3">
          <!-- LMB Skill Pentagram: Primary Slash -->
          <div class="relative w-12 h-12 rounded-xl bg-stone-900 border-2 border-amber-500/70 shadow-lg flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 active:scale-95" title="Primary Slash [LMB]">
            <span class="text-xl">🗡️</span>
            <span class="absolute -bottom-1 -left-1 px-1 rounded bg-black/80 border border-stone-700 text-[8px] font-bold text-amber-400">LMB</span>
          </div>

          <!-- 4-Slot Leather Potion Belt -->
          <div class="flex items-center gap-1.5 p-1 bg-stone-950/90 rounded-2xl border-2 border-stone-700/80 shadow-inner">
            <!-- Slot 1: Cold Brew (Health) -->
            <div onclick="usePotion(1)" class="relative w-11 h-12 rounded-xl bg-stone-900 border border-rose-500/60 flex flex-col items-center justify-center cursor-pointer hover:border-rose-400 active:scale-95 shadow" title="Cold Brew Potion [1] (+60 HP)">
              <span class="text-lg">☕</span>
              <span id="d2Potion1Count" class="text-[9px] font-black text-rose-300">x5</span>
              <span class="absolute -top-1 -right-1 px-1 rounded bg-stone-950 border border-rose-600/70 text-[8px] font-bold text-rose-400">1</span>
            </div>

            <!-- Slot 2: Narcan (Cure / Exorcism) -->
            <div onclick="usePotion(2)" class="relative w-11 h-12 rounded-xl bg-stone-900 border border-cyan-500/60 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400 active:scale-95 shadow" title="Narcan Stim [2] (Purge Debuffs & Heal)">
              <span class="text-lg">💉</span>
              <span id="d2Potion2Count" class="text-[9px] font-black text-cyan-300">x6</span>
              <span class="absolute -top-1 -right-1 px-1 rounded bg-stone-950 border border-cyan-600/70 text-[8px] font-bold text-cyan-400">2</span>
            </div>

            <!-- Slot 3: Amp Stim (Haste Overdrive) -->
            <div onclick="usePotion(3)" class="relative w-11 h-12 rounded-xl bg-stone-900 border border-amber-500/60 flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 active:scale-95 shadow" title="Amp Stim [3] (+85% Speed Overdrive)">
              <span class="text-lg">⚡</span>
              <span id="d2Potion3Count" class="text-[9px] font-black text-amber-300">x4</span>
              <span class="absolute -top-1 -right-1 px-1 rounded bg-stone-950 border border-amber-600/70 text-[8px] font-bold text-amber-400">3</span>
            </div>

            <!-- Slot 4: Cyber Shield -->
            <div onclick="usePotion(4)" class="relative w-11 h-12 rounded-xl bg-stone-900 border border-sky-500/60 flex flex-col items-center justify-center cursor-pointer hover:border-sky-400 active:scale-95 shadow" title="Cyber Shield [4] (Aegis Absorber)">
              <span class="text-lg">🛡️</span>
              <span id="d2Potion4Count" class="text-[9px] font-black text-sky-300">x2</span>
              <span class="absolute -top-1 -right-1 px-1 rounded bg-stone-950 border border-sky-600/70 text-[8px] font-bold text-sky-400">4</span>
            </div>
          </div>

          <!-- RMB Skill Pentagram: Rain Deluge -->
          <div class="relative w-12 h-12 rounded-xl bg-stone-900 border-2 border-cyan-500/70 shadow-lg flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400 active:scale-95" title="Rain Deluge [RMB]">
            <span class="text-xl">🌧️</span>
            <span class="absolute -bottom-1 -right-1 px-1 rounded bg-black/80 border border-stone-700 text-[8px] font-bold text-cyan-400">RMB</span>
          </div>
        </div>
      </div>

      <!-- RIGHT: ARCHANGEL MANA GLOBE -->
      <div class="flex items-end gap-2 pointer-events-auto">
        <!-- Diablo 2 Blue Mana Globe (104px) -->
        <div class="relative w-26 h-26 rounded-full p-1 bg-gradient-to-b from-stone-800 via-stone-900 to-black border-2 border-stone-700 shadow-[0_0_25px_rgba(37,99,235,0.55)] flex items-center justify-center overflow-hidden group cursor-pointer" onclick="usePotion(2)" title="Mana Globe (Click to drink Energy) [2]">
          <!-- Gothic Stone Bezel Ring -->
          <div class="absolute inset-0 rounded-full border-4 border-stone-900/90 pointer-events-none z-20"></div>
          <div class="absolute -top-0.5 left-1/2 -translate-x-1/2 text-[9px] font-black text-sky-400/90 z-20 tracking-widest uppercase">MANA</div>

          <!-- Arcane Sphere Interior -->
          <div class="relative w-full h-full rounded-full bg-stone-950 overflow-hidden flex items-end justify-center">
            <!-- Animated Electric Mana Liquid -->
            <div id="d2ManaGlobeFill" class="w-full bg-gradient-to-t from-blue-950 via-blue-600 to-cyan-400 transition-all duration-200 relative overflow-hidden" style="height: 100%;">
              <div class="absolute top-0 left-0 right-0 h-2 bg-cyan-300/60 animate-pulse"></div>
              <div class="mana-swirl-particles"></div>
            </div>
            <!-- Glass highlight reflection overlay -->
            <div class="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 via-transparent to-black/50 pointer-events-none z-10"></div>
          </div>

          <!-- Centered Mana Text Overlay -->
          <div class="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
            <span id="d2ManaText" class="text-xs sm:text-sm font-black text-white font-mono tracking-tight text-shadow-d2">80 / 80</span>
          </div>
        </div>
      </div>
    </div>

    <!-- BOTTOM FULL-WIDTH 10-SEGMENT NOTCHED GOLDEN XP BAR -->
    <div class="w-full relative h-2.5 bg-stone-950 border-t border-stone-700 pointer-events-auto flex items-center overflow-hidden group cursor-pointer" title="Pacific Leyline Experience Gauge">
      <!-- Golden XP Fill -->
      <div id="d2XpBarFill" class="h-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.85)] transition-all duration-200" style="width: 0%;"></div>
      
      <!-- 10 Segmental Golden Notches -->
      <div class="absolute inset-0 flex justify-between pointer-events-none px-0.5">
        <div class="w-[1.5px] h-full bg-stone-600"></div>
        <div class="w-[1.5px] h-full bg-stone-600"></div>
        <div class="w-[1.5px] h-full bg-stone-600"></div>
        <div class="w-[1.5px] h-full bg-stone-600"></div>
        <div class="w-[1.5px] h-full bg-stone-600"></div>
        <div class="w-[1.5px] h-full bg-stone-600"></div>
        <div class="w-[1.5px] h-full bg-stone-600"></div>
        <div class="w-[1.5px] h-full bg-stone-600"></div>
        <div class="w-[1.5px] h-full bg-stone-600"></div>
        <div class="w-[1.5px] h-full bg-stone-600"></div>
      </div>

      <!-- Hover XP Indicator -->
      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <span id="d2XpTooltipText" class="text-[9px] font-black text-amber-200 font-mono drop-shadow">0 / 180 XP (0%)</span>
      </div>
    </div>
  </div>

  <!-- BOSS HEALTH BAR OVERLAY (FLOOR 2 APEX BATTLES) -->
  <div id="bossHealthBarContainer" class="hidden fixed top-4 left-1/2 -translate-x-1/2 w-11/12 max-w-lg z-40 pointer-events-none flex flex-col items-center gap-1 font-mono">
    <div class="flex items-center justify-between w-full text-xs font-black uppercase text-shadow-d2 px-1">
      <span id="bossHealthName" class="text-rose-400">APEX CRIME BOSS</span>
      <span id="bossHealthPercent" class="text-white">100%</span>
    </div>
    <div class="w-full h-3 rounded-full bg-stone-950 border-2 border-rose-600/80 p-0.5 shadow-[0_0_20px_rgba(244,63,94,0.6)] overflow-hidden">
      <div id="bossHealthFill" class="h-full rounded-full bg-gradient-to-r from-red-700 via-rose-500 to-amber-400 transition-all duration-150" style="width: 100%;"></div>
    </div>
    <div id="bossHealthSub" class="text-[10px] text-slate-300 text-shadow-d2">Floor 2 · District Apex Vault</div>
  </div>

  <!-- SANCTUARY PROXIMITY INTERACTION BANNER -->
  <div id="sanctuaryPromptBanner" class="hidden fixed bottom-28 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-2xl bg-stone-950/90 border-2 border-amber-500/80 text-amber-300 font-mono text-xs font-bold shadow-2xl backdrop-blur-md pointer-events-auto flex items-center gap-2 animate-bounce">
    <span id="sanctuaryPromptText">[E] Talk to NPC</span>
  </div>
`;

if (!html.includes('id="diablo2BottomHud"')) {
  const canvasMarker = '</canvas>';
  const canvasIdx = html.indexOf(canvasMarker);
  if (canvasIdx !== -1) {
    html = html.substring(0, canvasIdx + canvasMarker.length) + '\n' + diablo2HUD_HTML + html.substring(canvasIdx + canvasMarker.length);
    console.log('✓ Injected Diablo 2 Bottom Interface HUD');
  }
}

// Hook updateHUD to Diablo 2 HUD
const d2HUD_UpdateLogic = `
      // Update Diablo 2 Dual Globes & Golden XP Bar
      const d2LifeFill = document.getElementById('d2LifeGlobeFill');
      const d2LifeText = document.getElementById('d2LifeText');
      if (d2LifeFill) d2LifeFill.style.height = \`\${hpPct}%\`;
      if (d2LifeText) d2LifeText.textContent = \`\${Math.round(p.hp)} / \${p.maxHp}\`;

      const d2ManaFill = document.getElementById('d2ManaGlobeFill');
      const d2ManaText = document.getElementById('d2ManaText');
      if (d2ManaFill) d2ManaFill.style.height = \`\${energyPct}%\`;
      if (d2ManaText) d2ManaText.textContent = \`\${Math.round(p.energy)} / \${p.maxEnergy}\`;

      const d2StamFill = document.getElementById('d2StaminaBarFill');
      if (d2StamFill) {
        const stamPct = Math.max(0, Math.min(100, ((p.stamina || 100) / (p.maxStamina || 100)) * 100));
        d2StamFill.style.height = \`\${stamPct}%\`;
      }

      const d2XpFill = document.getElementById('d2XpBarFill');
      const d2XpTip = document.getElementById('d2XpTooltipText');
      if (d2XpFill) d2XpFill.style.width = \`\${xpPct}%\`;
      if (d2XpTip) d2XpTip.textContent = \`\${p.xp} / \${p.xpNext} XP (\${Math.round(xpPct)}%)\`;

      // Update Potion Belt Badges
      if (gameState.potions) {
        const p1 = document.getElementById('d2Potion1Count');
        const p2 = document.getElementById('d2Potion2Count');
        const p3 = document.getElementById('d2Potion3Count');
        const p4 = document.getElementById('d2Potion4Count');
        if (p1) p1.textContent = \`x\${gameState.potions.health || 0}\`;
        if (p2) p2.textContent = \`x\${gameState.potions.narcan || 0}\`;
        if (p3) p3.textContent = \`x\${gameState.potions.amp || 0}\`;
        if (p4) p4.textContent = \`x\${gameState.potions.shield || 0}\`;
      }
`;

if (!html.includes('Update Diablo 2 Dual Globes & Golden XP Bar')) {
  html = html.replace("document.getElementById('hudCurrency').textContent = p.beans;", "document.getElementById('hudCurrency').textContent = p.beans;\n" + d2HUD_UpdateLogic);
  console.log('✓ Hooked Diablo 2 Dual Globes & XP Bar into updateHUD()');
}

// =============================================================================
// STEP 5: ENHANCE killEnemy() FOR KEYMASTER LIEUTENANTS & APEX CRIME BOSSES
// =============================================================================
const keymasterKillLogic = `
        if (enemy.isKeymaster && gameState.currentDungeon && gameState.currentDungeon.floor === 1) {
          gameState.currentDungeon.keymasterDefeated = true;
          gameState.currentDungeon.hasBossKey = true;
          playSound('powerup');
          playSound('level');
          createImpactParticles(enemy.x, enemy.y, '#fbbf24', 40);
          addFloatingText("🗝️ BOSS SANCTUM KEY ACQUIRED!", enemy.x, enemy.y - 30, '#fbbf24', 20);
          triggerWaveAnnouncement("🗝️ SANCTUM KEY ACQUIRED!", "Keymaster Slain! Enter Floor 2: Crime Boss Vault");
          showToast("🗝️ Acquired Boss Sanctum Key! Descend to Floor 2 at northern stairs.", "success", true);
          updateQuestTrackerUI();
        }
        if (enemy.isBoss && gameState.currentDungeon && gameState.currentDungeon.floor === 2) {
          gameState.currentDungeon.bossDefeated = true;
          const bossBarEl = document.getElementById('bossHealthBarContainer');
          if (bossBarEl) bossBarEl.classList.add('hidden');
          spawnPortaPottyTownPortal();
        }
`;

if (!html.includes('🗝️ BOSS SANCTUM KEY ACQUIRED!')) {
  html = html.replace("if (enemy.isBoss && gameState.currentDungeon.floor === 2) {", keymasterKillLogic + "\n        if (false && enemy.isBoss && gameState.currentDungeon.floor === 2) {");
  console.log('✓ Added Keymaster Lieutenant Sanctum Key drop logic to killEnemy()');
}

// =============================================================================
// STEP 6: BOSS HEALTH BAR UPDATE IN GAME LOOP
// =============================================================================
const bossBarUpdateLoop = `
        // Update Floor 2 Crime Boss Health Bar
        if (gameState.mode === 'dungeon' && gameState.currentDungeon && gameState.currentDungeon.floor === 2) {
          const boss = gameState.enemies ? gameState.enemies.find(e => e.isBoss) : null;
          const bossBarEl = document.getElementById('bossHealthBarContainer');
          const bossFill = document.getElementById('bossHealthFill');
          const bossPctText = document.getElementById('bossHealthPercent');
          if (boss && bossBarEl && bossFill) {
            bossBarEl.classList.remove('hidden');
            const pct = Math.max(0, Math.min(100, (boss.hp / boss.maxHp) * 100));
            bossFill.style.width = \`\${pct}%\`;
            if (bossPctText) bossPctText.textContent = \`\${Math.round(pct)}%\`;
          }
        }
`;

if (!html.includes('Update Floor 2 Crime Boss Health Bar')) {
  html = html.replace('if (!gameState.isPaused) {', 'if (!gameState.isPaused) {\n' + bossBarUpdateLoop);
  console.log('✓ Added Crime Boss health bar updater to game loop');
}

// =============================================================================
// STEP 7: EXTEND DEV BRIDGE (window.__RAINBLADE_DEV_BRIDGE__)
// =============================================================================
const bridgeExtensions = `
      // Antigravity & Diablo 2 Testing Helpers
      teleport(x, y) {
        if (!gameState.player) return;
        gameState.player.x = x;
        gameState.player.y = y;
        gameState.player.vx = 0;
        gameState.player.vy = 0;
        this.log('teleport', \`Teleported to \${x}, \${y}\`);
        if (typeof showToast === 'function') showToast(\`Teleported to (\${x}, \${y})\`, 'info');
      },
      enterDungeon(dungeonId) {
        if (typeof enterNeighborhoodDungeon === 'function') {
          enterNeighborhoodDungeon(dungeonId);
          this.log('dungeon', \`Entered dungeon \${dungeonId}\`);
        }
      },
      enterSanctuary() {
        if (typeof enterSafehouse === 'function') {
          enterSafehouse();
          this.log('sanctuary', 'Entered Safehouse Sanctuary Hub');
        }
      },
      revealAllMap() {
        if (gameState.worldMap && gameState.worldMap.explored) {
          gameState.worldMap.explored.fill(1);
          this.log('cheat', 'Revealed all fog of war');
          if (typeof showToast === 'function') showToast('Fog of War fully revealed!', 'success');
        }
      },
      acquireBossKey() {
        if (gameState.currentDungeon) {
          gameState.currentDungeon.hasBossKey = true;
          this.log('cheat', 'Acquired Boss Sanctum Key');
          if (typeof showToast === 'function') showToast('Boss Sanctum Key acquired via dev bridge!', 'success');
        }
      },
`;

if (!html.includes('acquireBossKey')) {
  html = html.replace('applyHotPatch(patchName, patchFnOrCode) {', bridgeExtensions.trim() + '\n      applyHotPatch(patchName, patchFnOrCode) {');
  console.log('✓ Added Diablo 2 dev helpers to window.__RAINBLADE_DEV_BRIDGE__');
}

fs.writeFileSync(targetPath, html, 'utf8');
console.log('✓ Successfully written updated rain-blade.html');
