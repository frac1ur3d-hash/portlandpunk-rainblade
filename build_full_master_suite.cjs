// build_full_master_suite.cjs
// Carefully builds and integrates Phases 9, 10, 11, 12, 13, and 14 into rain-blade.html
// Without breaking existing DOM listeners or element IDs.

const fs = require('fs');
const path = require('path');

const targetPath = path.resolve('E:/portlandpunk/client/public/rain-blade.html');
console.log('Target file:', targetPath);
let html = fs.readFileSync(targetPath, 'utf8');

// 1. ADD CSS STYLES
const masterStyles = `
  /* === MASTER EXPANSION STYLES: RADIAL CLUSTER, AUTOMAP, FORGE, STASH & SAFEHOUSE === */
  #diabloRadialCluster {
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
  }
  .radial-btn {
    touch-action: none;
    transition: transform 0.08s ease, filter 0.12s ease;
  }
  .radial-btn:active {
    transform: scale(0.92);
    filter: brightness(1.3);
  }
  #dynamicMoveStick, #dynamicAimStick {
    pointer-events: none;
    transition: opacity 0.2s ease-out;
  }
  #automapOverlayContainer {
    pointer-events: none;
  }
  .stash-slot, .forge-slot {
    transition: all 0.15s ease;
  }
  .stash-slot:hover, .forge-slot:hover {
    border-color: #38bdf8;
    transform: translateY(-1px);
  }
  .diablo-glow-cyan {
    box-shadow: 0 0 20px rgba(56, 189, 248, 0.45), inset 0 0 15px rgba(56, 189, 248, 0.2);
  }
  .diablo-glow-amber {
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.45), inset 0 0 15px rgba(245, 158, 11, 0.2);
  }
  .diablo-glow-emerald {
    box-shadow: 0 0 25px rgba(16, 185, 129, 0.5), inset 0 0 15px rgba(16, 185, 129, 0.25);
  }
  .diablo-glow-rose {
    box-shadow: 0 0 20px rgba(244, 63, 94, 0.45), inset 0 0 15px rgba(244, 63, 94, 0.2);
  }
  .diablo-glow-purple {
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.45), inset 0 0 15px rgba(168, 85, 247, 0.2);
  }
`;

if (!html.includes('MASTER EXPANSION STYLES: RADIAL CLUSTER')) {
  html = html.replace('</style>', masterStyles + '\n</style>');
  console.log('✓ Added master CSS styles');
}

// 2. PRESERVE #joystickZone & #joystickKnob WHILE ENHANCING #touchControls WITH DIABLO RADIAL & TWIN-STICK
// We inject the new controls inside #touchControls alongside existing elements so nothing returns null!
const touchControlsMarker = '<div id="touchControls"';
const touchControlsIdx = html.indexOf(touchControlsMarker);

if (touchControlsIdx !== -1 && !html.includes('id="diabloRadialCluster"')) {
  const innerMarker = 'style="touch-action: none;">';
  const insertPoint = html.indexOf(innerMarker, touchControlsIdx) + innerMarker.length;

  const extraTouchUI = `
      <!-- Dynamic Floating Move Stick (Spawns on left screen half) -->
      <div id="dynamicMoveStick" class="absolute hidden" style="width: 110px; height: 110px; margin-left: -55px; margin-top: -55px;">
        <div class="w-full h-full rounded-full border-2 border-cyan-400/40 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center diablo-glow-cyan">
          <div id="dynamicMoveKnob" class="w-12 h-12 rounded-full bg-cyan-400/70 border border-white/60 shadow-lg shadow-cyan-500/50"></div>
        </div>
      </div>

      <!-- Dynamic Floating Aim Stick (Active in Neon Arena Twin-Stick Mode) -->
      <div id="dynamicAimStick" class="absolute hidden" style="width: 110px; height: 110px; margin-left: -55px; margin-top: -55px;">
        <div class="w-full h-full rounded-full border-2 border-rose-500/40 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center diablo-glow-rose">
          <div id="dynamicAimKnob" class="w-12 h-12 rounded-full bg-rose-500/70 border border-white/60 shadow-lg shadow-rose-500/50"></div>
        </div>
      </div>

      <!-- Mobile Top-Left Tactical Action Bar -->
      <div class="absolute top-14 left-3 flex flex-wrap gap-1.5 pointer-events-auto z-30">
        <button id="btnMobileControlMode" onclick="toggleMobileControlMode()" class="px-2.5 py-1 rounded-xl bg-slate-950/70 border border-cyan-500/50 text-[10px] font-mono font-bold text-cyan-300 backdrop-blur-xs flex items-center gap-1 active:scale-95 shadow-md">
          <span id="txtControlModeBadge">🎮 DIABLO</span>
        </button>
        <button id="btnMobileTownPortal" onclick="castTownPortal()" class="px-2.5 py-1 rounded-xl bg-slate-950/70 border border-sky-500/50 text-[10px] font-mono font-bold text-sky-300 backdrop-blur-xs flex items-center gap-1 active:scale-95 shadow-md">
          <span>🌀 TP (T)</span>
        </button>
        <button id="btnMobileGearSwap" onclick="swapGearLoadout()" class="px-2.5 py-1 rounded-xl bg-slate-950/70 border border-amber-500/50 text-[10px] font-mono font-bold text-amber-300 backdrop-blur-xs flex items-center gap-1 active:scale-95 shadow-md">
          <span>⚔️ SWAP (X)</span>
        </button>
        <button id="btnMobileAutomap" onclick="toggleAutomap()" class="px-2 py-1 rounded-xl bg-slate-950/70 border border-emerald-500/50 text-[10px] font-mono font-bold text-emerald-300 backdrop-blur-xs flex items-center gap-1 active:scale-95 shadow-md">
          <span>🗺️ MAP</span>
        </button>
        <button id="btnMobileQuestLog" onclick="openQuestLogModal()" class="px-2 py-1 rounded-xl bg-slate-950/70 border border-purple-500/50 text-[10px] font-mono font-bold text-purple-300 backdrop-blur-xs flex items-center gap-1 active:scale-95 shadow-md">
          <span>📜 LOG (Q)</span>
        </button>
        <button id="btnMobileImmersiveHud" onclick="toggleImmersiveHud()" class="px-2 py-1 rounded-xl bg-slate-950/70 border border-slate-600/50 text-[10px] font-mono text-slate-300 backdrop-blur-xs flex items-center gap-1 active:scale-95 shadow-md">
          <span>👁️ HUD</span>
        </button>
      </div>

      <!-- Top-Center Skill Cancel Zone (Drag thumb here to abort skill cast) -->
      <div id="skillCancelZone" class="hidden absolute top-8 left-1/2 -translate-x-1/2 px-6 py-2 rounded-2xl bg-rose-950/80 border-2 border-rose-500 text-rose-300 font-mono font-bold text-xs flex items-center gap-2 backdrop-blur-md shadow-2xl transition-all pointer-events-none">
        <span class="text-sm">✕</span>
        <span>DRAG HERE TO CANCEL SKILL</span>
      </div>

      <!-- MODE A: DIABLO IMMORTAL RADIAL ACTION CLUSTER (Bottom Right) -->
      <div id="diabloRadialCluster" class="absolute bottom-6 right-6 w-64 h-64 pointer-events-none select-none z-30">
        <!-- Center/Anchor: Primary Attack Button (Oversized 76px, Hold-to-Attack) -->
        <button id="btnRadialAttack" class="radial-btn absolute bottom-2 right-2 w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600/80 via-teal-500/80 to-cyan-400/80 border-2 border-white/50 text-slate-950 font-black font-mono flex flex-col items-center justify-center diablo-glow-emerald pointer-events-auto select-none shadow-2xl">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.828 2.828a2 2 0 01-2.828 0L3 11.828a2 2 0 010-2.828L5.828 6.172a2 2 0 012.828 0L12 9.414"/>
          </svg>
          <span class="text-[9px] tracking-wider mt-0.5">SLASH</span>
        </button>

        <!-- Dodge / Roll Dash (situated directly to left of Attack for instant thumb sweep) -->
        <button id="btnRadialDodge" class="radial-btn absolute bottom-3 right-24 w-12 h-12 rounded-full bg-indigo-950/70 border border-indigo-400/60 text-indigo-300 font-mono font-bold text-xs flex flex-col items-center justify-center pointer-events-auto select-none backdrop-blur-xs shadow-lg">
          <span>ROLL</span>
          <span class="text-[7px] text-slate-400">SPC</span>
        </button>

        <!-- Skill 1: Rain Deluge (Radial Orbit ~115 deg) -->
        <button id="btnRadialSkill1" class="radial-btn absolute top-20 right-28 w-12 h-12 rounded-full bg-slate-950/75 border border-cyan-400/60 text-cyan-300 font-mono font-bold text-xs flex flex-col items-center justify-center pointer-events-auto select-none backdrop-blur-xs shadow-lg diablo-glow-cyan">
          <span class="text-[10px]">DELUGE</span>
          <span class="text-[7px] text-slate-400">RMB</span>
        </button>

        <!-- Skill 2: Cold Brew Rush / Haste (Radial Orbit ~90 deg) -->
        <button id="btnRadialSkill2" class="radial-btn absolute top-6 right-20 w-12 h-12 rounded-full bg-slate-950/75 border border-amber-400/60 text-amber-300 font-mono font-bold text-xs flex flex-col items-center justify-center pointer-events-auto select-none backdrop-blur-xs shadow-lg diablo-glow-amber">
          <span class="text-[10px]">BREW</span>
          <span class="text-[7px] text-slate-400">E</span>
        </button>

        <!-- Skill 3: Briar Cyclone (Radial Orbit ~60 deg) -->
        <button id="btnRadialSkill3" class="radial-btn absolute top-3 right-4 w-12 h-12 rounded-full bg-slate-950/75 border border-rose-400/60 text-rose-300 font-mono font-bold text-xs flex flex-col items-center justify-center pointer-events-auto select-none backdrop-blur-xs shadow-lg diablo-glow-rose">
          <span class="text-[10px]">BRIAR</span>
          <span class="text-[7px] text-slate-400">R</span>
        </button>

        <!-- Trinket / Special (Radial Orbit ~145 deg) -->
        <button id="btnRadialTrinket" onclick="triggerTrinket()" class="radial-btn absolute bottom-16 right-36 w-10 h-10 rounded-full bg-slate-950/75 border border-purple-400/60 text-purple-300 font-mono font-bold text-[9px] flex flex-col items-center justify-center pointer-events-auto select-none backdrop-blur-xs shadow-lg diablo-glow-purple">
          <span>GADGET</span>
          <span class="text-[7px] text-slate-400">F</span>
        </button>
      </div>

      <!-- Quick Potions & Stims Touch Bar (Bottom Center-Right) -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-auto z-30">
        <button id="btnTouchPotion1" onclick="usePotion(1)" class="w-10 h-10 rounded-xl bg-slate-950/75 border border-emerald-500/50 text-emerald-300 font-mono font-bold flex flex-col items-center justify-center backdrop-blur-xs active:scale-95 shadow-md">
          <span class="text-xs">☕</span>
          <span id="badgeTouchPotion1" class="text-[8px] text-emerald-400 font-bold">x5</span>
        </button>
        <button id="btnTouchPotion2" onclick="usePotion(2)" class="w-10 h-10 rounded-xl bg-slate-950/75 border border-rose-500/50 text-rose-300 font-mono font-bold flex flex-col items-center justify-center backdrop-blur-xs active:scale-95 shadow-md">
          <span class="text-xs">💉</span>
          <span id="badgeTouchPotion2" class="text-[8px] text-rose-400 font-bold">x6</span>
        </button>
        <button id="btnTouchPotion3" onclick="usePotion(3)" class="w-10 h-10 rounded-xl bg-slate-950/75 border border-amber-500/50 text-amber-300 font-mono font-bold flex flex-col items-center justify-center backdrop-blur-xs active:scale-95 shadow-md">
          <span class="text-xs">⚡</span>
          <span id="badgeTouchPotion3" class="text-[8px] text-amber-400 font-bold">x4</span>
        </button>
        <button id="btnTouchPotion4" onclick="usePotion(4)" class="w-10 h-10 rounded-xl bg-slate-950/75 border border-sky-500/50 text-sky-300 font-mono font-bold flex flex-col items-center justify-center backdrop-blur-xs active:scale-95 shadow-md">
          <span class="text-xs">🛡️</span>
          <span id="badgeTouchPotion4" class="text-[8px] text-sky-400 font-bold">x2</span>
        </button>
      </div>
`;
  html = html.substring(0, insertPoint) + extraTouchUI + html.substring(insertPoint);
  console.log('✓ Injected Diablo Radial Cluster & Mobile Action Bar into #touchControls');
}

// 3. INJECT MASTER MODALS RIGHT BEFORE </body>
const masterModals = `
  <!-- ========================================================================= -->
  <!-- 📦 DIABLO 2 PERSISTENT STASH CHEST MODAL (100 SLOTS) -->
  <!-- ========================================================================= -->
  <div id="stashModal" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
    <div class="max-w-4xl w-full rounded-3xl bg-slate-900 border border-cyan-500/50 shadow-[0_0_60px_rgba(56,189,248,0.3)] flex flex-col max-h-[92vh] overflow-hidden font-mono">
      <div class="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/80">
        <div class="flex items-center gap-3">
          <span class="text-3xl">📦</span>
          <div>
            <h2 class="font-display font-black text-lg text-white tracking-wider uppercase">PORTLAND SAFEHOUSE STASH</h2>
            <p class="text-[11px] text-cyan-400">Secure Vault Storage · Diablo 2 Multi-Tab Architecture</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="depositAllGemsToStash()" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 font-bold border border-amber-500/40 transition-colors">
            ⚡ QUICK DEPOSIT
          </button>
          <button onclick="toggleModal('stashModal')" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>
      </div>

      <!-- Stash Tabs -->
      <div class="flex border-b border-slate-800 bg-slate-950/50 px-4 pt-2 gap-2 text-xs">
        <button id="tabStashGeneral" onclick="switchStashTab('general')" class="px-4 py-2 font-bold rounded-t-xl bg-slate-900 border-t border-x border-cyan-500/40 text-cyan-300">
          GENERAL (I)
        </button>
        <button id="tabStashWeapons" onclick="switchStashTab('weapons')" class="px-4 py-2 font-bold rounded-t-xl bg-slate-950/40 border-t border-x border-transparent text-slate-400 hover:text-slate-200">
          WEAPONS & SHIELDS (II)
        </button>
        <button id="tabStashArmor" onclick="switchStashTab('armor')" class="px-4 py-2 font-bold rounded-t-xl bg-slate-950/40 border-t border-x border-transparent text-slate-400 hover:text-slate-200">
          ARMOR & SETS (III)
        </button>
        <button id="tabStashGems" onclick="switchStashTab('gems')" class="px-4 py-2 font-bold rounded-t-xl bg-slate-950/40 border-t border-x border-transparent text-slate-400 hover:text-slate-200">
          GEMS & NARCAN (IV)
        </button>
      </div>

      <!-- Stash Grid Content -->
      <div class="p-4 overflow-y-auto flex-1 bg-slate-950/30">
        <div class="flex justify-between items-center text-xs text-slate-400 mb-3 px-1">
          <span id="stashCapacityText">Stored Items: 0 / 100</span>
          <span class="text-[10px] text-cyan-400">💡 Click an item to withdraw to bag · Click bag item to deposit</span>
        </div>
        <div id="stashGrid" class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5">
          <!-- Populated dynamically -->
        </div>
      </div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- ⚒️ THE JEWELER'S QUANTUM FORGE MODAL (DIABLO 3 FUSION) -->
  <!-- ========================================================================= -->
  <div id="forgeModal" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 font-mono">
    <div class="max-w-2xl w-full rounded-3xl bg-slate-900 border-2 border-amber-500/60 shadow-[0_0_70px_rgba(245,158,11,0.35)] flex flex-col max-h-[92vh] overflow-hidden">
      <div class="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/80">
        <div class="flex items-center gap-3">
          <span class="text-3xl">⚒️</span>
          <div>
            <h2 id="forgeTitleText" class="font-display font-black text-lg text-amber-300 tracking-wider uppercase">THE JEWELER'S QUANTUM FORGE</h2>
            <p id="forgeSubheadText" class="text-[11px] text-slate-400">Item Synthesis & Dual-Stat Fusion Engine · Neo-Portland Crucible</p>
          </div>
        </div>
        <button onclick="toggleModal('forgeModal')" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
          ✕
        </button>
      </div>

      <div class="p-6 overflow-y-auto space-y-6">
        <!-- Fusion Mode Picker -->
        <div class="grid grid-cols-3 gap-2 text-center text-xs">
          <button id="btnForgeModeAdditive" onclick="setForgeMode('additive')" class="p-3 rounded-2xl border-2 border-cyan-500 bg-cyan-950/40 text-cyan-300 font-bold flex flex-col items-center gap-1 shadow-md">
            <span>➕ STAT FUSION</span>
            <span class="text-[9px] text-slate-300 font-normal">Combines Affixes</span>
          </button>
          <button id="btnForgeModeInfusion" onclick="setForgeMode('infusion')" class="p-3 rounded-2xl border-2 border-slate-700 bg-slate-950/40 text-slate-400 font-bold flex flex-col items-center gap-1 hover:border-slate-500">
            <span>✨ LEGENDARY INFUSION</span>
            <span class="text-[9px] text-slate-400 font-normal">Absorbs Set Perk</span>
          </button>
          <button id="btnForgeModeDual" onclick="setForgeMode('dual')" class="p-3 rounded-2xl border-2 border-slate-700 bg-slate-950/40 text-slate-400 font-bold flex flex-col items-center gap-1 hover:border-slate-500">
            <span>👑 DUAL-FUSION (BOTH)</span>
            <span class="text-[9px] text-slate-400 font-normal">Stats + Perk + Socket</span>
          </button>
        </div>

        <!-- 2 Item Input Sockets -->
        <div class="flex items-center justify-center gap-8 py-2">
          <!-- Item A Socket (Base) -->
          <div class="flex flex-col items-center gap-2">
            <span class="text-xs text-cyan-300 font-bold">ITEM A (CHASSIS)</span>
            <div id="forgeSocketA" onclick="openForgeSelector('A')" class="forge-slot w-24 h-24 rounded-2xl border-2 border-dashed border-cyan-500/60 bg-slate-950/60 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400 p-2 text-center text-[10px]">
              <span class="text-2xl opacity-60">🗡️</span>
              <span id="forgeNameA" class="text-slate-400 mt-1">Select Base Item</span>
            </div>
          </div>

          <div class="text-2xl font-black text-amber-400">➕</div>

          <!-- Item B Socket (Catalyst) -->
          <div class="flex flex-col items-center gap-2">
            <span class="text-xs text-amber-300 font-bold">ITEM B (CATALYST)</span>
            <div id="forgeSocketB" onclick="openForgeSelector('B')" class="forge-slot w-24 h-24 rounded-2xl border-2 border-dashed border-amber-500/60 bg-slate-950/60 flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 p-2 text-center text-[10px]">
              <span class="text-2xl opacity-60">💎</span>
              <span id="forgeNameB" class="text-slate-400 mt-1">Select Catalyst</span>
            </div>
          </div>
        </div>

        <!-- Preview Result Card -->
        <div id="forgePreviewCard" class="p-4 rounded-2xl bg-slate-950/80 border border-slate-700 text-xs text-slate-300 space-y-1.5">
          <div class="font-bold text-amber-300 uppercase flex items-center gap-1.5">
            <span>🔮 FUSION PREVIEW:</span>
            <span id="forgePreviewTitle" class="text-white">Awaiting Two Compatible Gear Items...</span>
          </div>
          <p id="forgePreviewStats" class="text-[11px] text-slate-400">Place two weapons, armors, or relics into the crucible to calculate resulting augmented stats and legendary power absorption.</p>
        </div>

        <!-- Action Button -->
        <button id="btnExecuteForge" onclick="executeItemForge()" class="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-98 transition-all disabled:opacity-50">
          <span>🔥 IGNITE QUANTUM FORGE (150 BEANS)</span>
        </button>
      </div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- 🏛️ MAYOR OF PORTLAND: SAFEHOUSE NEIGHBORHOOD PICKER MODAL -->
  <!-- ========================================================================= -->
  <div id="safehouseSelectModal" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 font-mono">
    <div class="max-w-3xl w-full rounded-3xl bg-slate-900 border-2 border-cyan-500/60 shadow-[0_0_80px_rgba(56,189,248,0.3)] flex flex-col max-h-[92vh] overflow-hidden">
      <div class="p-5 border-b border-slate-800 bg-slate-950/90 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🏛️</span>
          <div>
            <h2 class="font-display font-black text-lg text-white tracking-wider uppercase">OFFICE OF THE MAYOR · CITY OF PORTLAND</h2>
            <p class="text-[11px] text-cyan-400">Emergency Directive 0x7729 · Safehouse Deed Allocation</p>
          </div>
        </div>
        <button onclick="toggleModal('safehouseSelectModal')" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
          ✕
        </button>
      </div>

      <div class="p-6 overflow-y-auto space-y-4">
        <div class="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-slate-300 leading-relaxed">
          <p class="font-bold text-cyan-300 text-sm mb-1">"Operative, our city is on the brink."</p>
          <p>The synthetic fentanyl epidemic has overwhelmed the streets. Normal supply chains are broken, and predatory warlords have weaponized the contagion. By executive order, I grant you the title deed to establish your permanent Safehouse operations center. Choose your district headquarters wisely:</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          <!-- Pearl District -->
          <div onclick="selectSafehouseDistrict('pearl')" class="p-4 rounded-2xl border-2 border-cyan-500/50 bg-slate-950/60 hover:border-cyan-400 hover:bg-cyan-950/30 cursor-pointer transition-all space-y-2">
            <div class="flex justify-between items-center font-bold text-white text-sm">
              <span>PEARL DISTRICT ARCOLOGY</span>
              <span class="text-[10px] text-cyan-400">HIGH-TECH</span>
            </div>
            <p class="text-[11px] text-slate-400">Penthouse loft overlooking downtown. Equipped with the Quantum Neon Crucible laser forge and cleanroom bio-lab.</p>
            <div class="text-[10px] text-cyan-300 font-bold">✨ Perk: +15% Gem & Crystal Drop Rate</div>
          </div>

          <!-- Hawthorne -->
          <div onclick="selectSafehouseDistrict('hawthorne')" class="p-4 rounded-2xl border-2 border-amber-500/50 bg-slate-950/60 hover:border-amber-400 hover:bg-amber-950/30 cursor-pointer transition-all space-y-2">
            <div class="flex justify-between items-center font-bold text-white text-sm">
              <span>HAWTHORNE ROASTER LOFT</span>
              <span class="text-[10px] text-amber-400">BOHEMIAN</span>
            </div>
            <p class="text-[11px] text-slate-400">Exposed red brick, copper distillation coils, and rain skylights. Houses the Underground Alchemist distillation forge.</p>
            <div class="text-[10px] text-amber-300 font-bold">✨ Perk: +20% Cold Brew Health Potion Potency</div>
          </div>

          <!-- Lents -->
          <div onclick="selectSafehouseDistrict('lents')" class="p-4 rounded-2xl border-2 border-emerald-500/50 bg-slate-950/60 hover:border-emerald-400 hover:bg-emerald-950/30 cursor-pointer transition-all space-y-2">
            <div class="flex justify-between items-center font-bold text-white text-sm">
              <span>LENTS RAIL WAREHOUSE</span>
              <span class="text-[10px] text-emerald-400">INDUSTRIAL</span>
            </div>
            <p class="text-[11px] text-slate-400">Heavy corrugated steel bunker alongside transit tracks. Features the Neo-PDX Street Smelter and weapon scrapyard.</p>
            <div class="text-[10px] text-emerald-300 font-bold">✨ Perk: +25% Scrap Metal Salvage Yield</div>
          </div>

          <!-- Chinatown -->
          <div onclick="selectSafehouseDistrict('chinatown')" class="p-4 rounded-2xl border-2 border-rose-500/50 bg-slate-950/60 hover:border-rose-400 hover:bg-rose-950/30 cursor-pointer transition-all space-y-2">
            <div class="flex justify-between items-center font-bold text-white text-sm">
              <span>CHINATOWN DRAGON TEA HOUSE</span>
              <span class="text-[10px] text-rose-400">SMUGGLER VAULT</span>
            </div>
            <p class="text-[11px] text-slate-400">Red silk lanterns and carved timber vault with direct access to the historic Shanghai Tunnels.</p>
            <div class="text-[10px] text-rose-300 font-bold">✨ Perk: +15% Movement Speed in Dungeons</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- 📜 DIABLO 2 QUEST JOURNAL & DISTRICT BOUNTIES MODAL ('Q' KEY) -->
  <!-- ========================================================================= -->
  <div id="questLogModal" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 font-mono">
    <div class="max-w-3xl w-full rounded-3xl bg-slate-900 border border-purple-500/50 shadow-[0_0_60px_rgba(168,85,247,0.3)] flex flex-col max-h-[92vh] overflow-hidden">
      <div class="p-4 border-b border-slate-800 bg-slate-950/90 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <span class="text-3xl">📜</span>
          <div>
            <h2 class="font-display font-black text-lg text-white tracking-wider uppercase">PORTLAND DISTRICT QUEST JOURNAL</h2>
            <p class="text-[11px] text-purple-400">Active Campaign Objectives · Safehouse NPC Bounties · Hotkey [Q]</p>
          </div>
        </div>
        <button onclick="toggleModal('questLogModal')" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
          ✕
        </button>
      </div>

      <div id="questCardsContainer" class="p-5 overflow-y-auto space-y-3.5">
        <!-- Rendered dynamically -->
      </div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- 🗺️ DIABLO 2 FULLSCREEN AUTOMAP CANVAS OVERLAY ('TAB' KEY) -->
  <!-- ========================================================================= -->
  <div id="automapOverlayContainer" class="hidden fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
    <canvas id="automapCanvas" class="w-full h-full opacity-80"></canvas>
    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-xl bg-slate-950/80 border border-emerald-500/50 text-[10px] font-mono text-emerald-300 font-bold backdrop-blur-xs shadow-lg">
      AUTOMAP ACTIVE · PRESS [TAB] OR [MAP] TO CLOSE
    </div>
  </div>
`;

if (!html.includes('id="stashModal"')) {
  html = html.replace('</body>', masterModals + '\n</body>');
  console.log('✓ Added master HTML modals');
}

// 4. INJECT MASTER JAVASCRIPT EXPANSION LOGIC BEFORE </script>
const scriptCloseIdx = html.lastIndexOf('</script>');
const masterJS = `
    // =========================================================================
    // ⚔️ MASTER EXPANSION ENGINE: DIABLO ARPG RADIAL, TWIN-STICK, TP, STASH,
    //    FORGE, FOG OF WAR, SAFEHOUSES, NARCAN EXORCISM & NPC QUESTLINES
    //    Designed & Directed by Kyle McLeod (@frac1ur3d-hash)
    // =========================================================================

    gameState.controlMode = 'diablo_radial'; // 'diablo_radial' | 'neon_twinstick'
    gameState.immersiveHud = false;
    gameState.automapActive = false;
    gameState.combatZoom = 1.0;
    gameState.safehouse = {
      district: 'hawthorne',
      name: 'Hawthorne Bohemian Roaster Loft',
      unlocked: true,
      perk: '+20% Cold Brew Health Potion Potency'
    };
    gameState.tpDeparture = null;
    gameState.potions = {
      health: 5,
      narcan: 6,
      amp: 4,
      shield: 2
    };
    gameState.stashTab = 'general';
    gameState.stash = (function() {
      try {
        const saved = localStorage.getItem('rainblade_stash_v1');
        return saved ? JSON.parse(saved) : [];
      } catch (e) { return []; }
    })();

    gameState.loadouts = {
      active: 'A',
      A: null,
      B: null
    };

    gameState.forge = {
      mode: 'additive',
      itemA: null,
      itemB: null
    };

    gameState.activeQuests = {
      jeweler_geode: { id: 'jeweler_geode', title: 'The Raw Geode of the Sunken Crypt', npc: 'The Jeweler', targetDistrict: 'creston', progress: 0, target: 1, completed: false, rewardName: 'Jeweler\\'s Sovereign Signet' },
      police_narcan: { id: 'police_narcan', title: 'The Hijacked Narcan Shipment', npc: 'PDX Police Chief', targetDistrict: 'ave_82nd', progress: 0, target: 1, completed: false, rewardName: 'PDX Chief\\'s Tactical Riot Aegis' },
      tailor_silk: { id: 'tailor_silk', title: 'The Cyber-Weaver\\'s Nanoweave', npc: 'The Tailor', targetDistrict: 'chinatown', progress: 0, target: 3, completed: false, rewardName: 'Masterwork Nanoweave Duster' },
      armorer_crucible: { id: 'armorer_crucible', title: 'The Scrap Warlord\\'s Crucible', npc: 'The Armorer', targetDistrict: 'powellhurst', progress: 0, target: 1, completed: false, rewardName: 'Crucible Blade Masterwork Tempering' }
    };

    gameState.rescuedCitizens = [];

    // Potions & Stims System (Hotkeys 1 - 4)
    window.usePotion = function(slot) {
      const p = gameState.player;
      if (slot === 1) { // 1: Cold Brew Health Potion
        if (gameState.potions.health <= 0) {
          showToast("⚠️ Out of Cold Brew! Scavenge crates or visit Safehouse.", "warning");
          playSound('empty');
          return;
        }
        if (p.hp >= p.maxHp) {
          showToast("Health already full!", "info");
          return;
        }
        gameState.potions.health--;
        const boost = gameState.safehouse.district === 'hawthorne' ? 75 : 60;
        p.hp = Math.min(p.maxHp, p.hp + boost);
        playSound('heal');
        createImpactParticles(p.x, p.y, '#10b981', 20);
        addFloatingText("+" + boost + " HP", p.x, p.y - 25, '#10b981', 18);
        showToast("☕ Cold Brew consumed: +" + boost + " HP", "success", true);
      } else if (slot === 2) { // 2: Narcan Syringe (Zombie Exorcism & Cure)
        if (gameState.potions.narcan <= 0) {
          showToast("⚠️ No Narcan Stims! Speak to PDX Police Chief at Safehouse.", "warning");
          playSound('empty');
          return;
        }
        let targetZombie = null;
        let minD = 140;
        gameState.enemies.forEach(e => {
          if (!e.isExorcising && (e.archetypeId === 'fetty_zombie' || (e.name && e.name.includes('Zombie')) || (e.name && e.name.includes('Fetty')))) {
            const d = Math.hypot(e.x - p.x, e.y - p.y);
            if (d < minD) { minD = d; targetZombie = e; }
          }
        });

        if (targetZombie) {
          gameState.potions.narcan--;
          administerNarcanToZombie(targetZombie);
        } else {
          gameState.potions.narcan--;
          p.isChilled = 0;
          p.hp = Math.min(p.maxHp, p.hp + 25);
          playSound('heal');
          createImpactParticles(p.x, p.y, '#f43f5e', 20);
          showToast("💉 Narcan injected: System Purged of Contaminants!", "success", true);
        }
      } else if (slot === 3) { // 3: Amp Stim (Speed & Haste)
        if (gameState.potions.amp <= 0) {
          showToast("⚠️ Out of Amp Stims! Hunt elites or scavenge crates.", "warning");
          playSound('empty');
          return;
        }
        gameState.potions.amp--;
        p.ampCharges = Math.min(p.ampMaxCharges, (p.ampCharges || 0) + 1);
        useAmpStim();
      } else if (slot === 4) { // 4: Shield Elixir
        if (gameState.potions.shield <= 0) {
          showToast("⚠️ No Shield Elixirs available!", "warning");
          playSound('empty');
          return;
        }
        gameState.potions.shield--;
        p.energy = p.maxEnergy;
        playSound('special');
        createImpactParticles(p.x, p.y, '#38bdf8', 25);
        addFloatingText("🛡️ CYBER SHIELD CHARGED!", p.x, p.y - 25, '#38bdf8', 18);
        showToast("🛡️ Cybernetic Forcefield online!", "success", true);
      }
      updatePotionBadges();
      updateHUD();
    };

    function updatePotionBadges() {
      const tb1 = document.getElementById('badgeTouchPotion1'); if (tb1) tb1.textContent = 'x' + gameState.potions.health;
      const tb2 = document.getElementById('badgeTouchPotion2'); if (tb2) tb2.textContent = 'x' + gameState.potions.narcan;
      const tb3 = document.getElementById('badgeTouchPotion3'); if (tb3) tb3.textContent = 'x' + gameState.potions.amp;
      const tb4 = document.getElementById('badgeTouchPotion4'); if (tb4) tb4.textContent = 'x' + gameState.potions.shield;
    }

    // Narcan Zombie Exorcism & Citizen Recovery Mechanic
    function administerNarcanToZombie(zombie) {
      zombie.isExorcising = true;
      zombie.exorcismTimer = 6.0;
      zombie.origSpeed = zombie.speed;
      zombie.speed = 0.5;
      playSound('special');
      addFloatingText("⚡ PRECIPITATED WITHDRAWAL INITIATED!", zombie.x, zombie.y - 30, '#f43f5e', 16);
      showToast("💉 Narcan injected! DEFEND THE CONVULSING CITIZEN!", "warning", true);
      triggerWaveAnnouncement("⚡ EXORCISM IN PROGRESS", "Do not strike the convulsing victim!");
      triggerTelegramHaptic('notification', 'warning');
    }

    function updateExorcisms(dt) {
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
    }

    // Town Portal (TP) & Hero's Safehouse Residence
    window.castTownPortal = function() {
      const p = gameState.player;
      if (gameState.mode === 'residence') {
        showToast("Already inside your Safehouse sanctuary!", "info");
        return;
      }

      gameState.tpDeparture = {
        mode: gameState.mode,
        x: p.x,
        y: p.y,
        districtId: gameState.currentDungeon ? gameState.currentDungeon.id : null,
        floor: gameState.currentDungeon ? gameState.currentDungeon.floor : 1
      };

      playSound('level');
      createImpactParticles(p.x, p.y, '#38bdf8', 30);
      showToast("🌀 Town Portal opened! Warping to Safehouse", "success", true);

      setTimeout(() => {
        enterSafehouse();
      }, 300);
    };

    function enterSafehouse() {
      gameState.mode = 'residence';
      chunkCache.clear();
      gameState.enemies = [];
      gameState.projectiles = [];
      gameState.groundHazards = [];

      const p = gameState.player;
      p.x = 0;
      p.y = 100;
      p.vx = 0;
      p.vy = 0;
      p.hp = p.maxHp;
      p.energy = p.maxEnergy;

      triggerWaveAnnouncement("🏠 PORTLAND SAFEHOUSE", gameState.safehouse.name);
      showToast("Welcome home, operative. Health & Energy fully restored.", "success", true);
      updateHUD();
    }

    window.returnFromSafehouse = function() {
      if (!gameState.tpDeparture) {
        showToast("No active departure portal!", "warning");
        return;
      }
      const dep = gameState.tpDeparture;
      playSound('level');
      chunkCache.clear();

      if (dep.mode === 'dungeon' && dep.districtId) {
        enterNeighborhoodDungeon(dep.districtId);
        if (dep.floor === 2) descendToFloor2();
      } else {
        gameState.mode = 'overworld';
        gameState.currentDungeon = null;
      }

      const p = gameState.player;
      p.x = dep.x;
      p.y = dep.y;
      p.vx = 0;
      p.vy = 0;
      gameState.tpDeparture = null;
      showToast("Returned through Town Portal!", "success", true);
      updateHUD();
    };

    // Diablo 2 Stash Chest
    window.openStashModal = function() {
      renderStashUI();
      toggleModal('stashModal');
    };

    window.switchStashTab = function(tab) {
      gameState.stashTab = tab;
      renderStashUI();
    };

    function renderStashUI() {
      const grid = document.getElementById('stashGrid');
      const capText = document.getElementById('stashCapacityText');
      if (!grid) return;

      const items = gameState.stash || [];
      if (capText) capText.textContent = "Stored Items: " + items.length + " / 100";

      grid.innerHTML = '';
      for (let i = 0; i < 48; i++) {
        const item = items[i];
        const slotDiv = document.createElement('div');
        if (item) {
          const tierBorder = item.tier === 'legendary' ? 'border-amber-400' : (item.tier === 'epic' ? 'border-purple-400' : 'border-cyan-400');
          slotDiv.className = 'stash-slot w-full aspect-square rounded-xl bg-slate-900 border-2 ' + tierBorder + ' flex flex-col items-center justify-center p-1 relative cursor-pointer hover:scale-105';
          slotDiv.onclick = () => withdrawItemFromStash(i);
          slotDiv.innerHTML = '<span class="text-xl">' + (item.icon || '⚔️') + '</span><span class="text-[9px] font-mono text-center truncate w-full text-slate-200 mt-1">' + (item.name ? item.name.split(' ')[0] : 'Item') + '</span>';
        } else {
          slotDiv.className = 'stash-slot w-full aspect-square rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-center text-slate-700 text-xs font-mono';
          slotDiv.textContent = i + 1;
        }
        grid.appendChild(slotDiv);
      }
    }

    function renderInventoryUI() {
      if (typeof renderInventoryBag === 'function') renderInventoryBag();
      if (typeof renderArmoryUI === 'function') renderArmoryUI();
    }
    window.renderInventoryUI = renderInventoryUI;

    window.depositItemToStash = function(bagIndex) {
      if ((gameState.stash || []).length >= 100) {
        showToast("Stash is completely full (100/100 slots)!", "warning");
        return;
      }
      const item = gameState.inventory[bagIndex];
      if (!item) return;
      gameState.inventory.splice(bagIndex, 1);
      gameState.stash.push(item);
      localStorage.setItem('rainblade_stash_v1', JSON.stringify(gameState.stash));
      playSound('coin');
      showToast("Deposited " + item.name + " into Stash.", "success", true);
      renderStashUI();
      renderInventoryUI();
    };

    window.withdrawItemFromStash = function(stashIndex) {
      if (gameState.inventory.length >= getInventoryCapacity()) {
        showToast("Your inventory bag is full! Free up space first.", "warning");
        return;
      }
      const item = gameState.stash[stashIndex];
      if (!item) return;
      gameState.stash.splice(stashIndex, 1);
      gameState.inventory.push(item);
      localStorage.setItem('rainblade_stash_v1', JSON.stringify(gameState.stash));
      playSound('coin');
      showToast("Withdrew " + item.name + " to inventory bag.", "success", true);
      renderStashUI();
      renderInventoryUI();
    };

    window.depositAllGemsToStash = function() {
      let count = 0;
      for (let i = gameState.inventory.length - 1; i >= 0; i--) {
        const item = gameState.inventory[i];
        if (item && (item.type === 'gem' || item.type === 'socket' || item.type === 'material')) {
          if (gameState.stash.length < 100) {
            gameState.inventory.splice(i, 1);
            gameState.stash.push(item);
            count++;
          }
        }
      }
      if (count > 0) {
        localStorage.setItem('rainblade_stash_v1', JSON.stringify(gameState.stash));
        playSound('coin');
        showToast("Quick-deposited " + count + " items into Stash!", "success", true);
        renderStashUI();
        renderInventoryUI();
      } else {
        showToast("No gems or materials found in bag to deposit.", "info");
      }
    };

    // Quick Gear Loadout Swap (Profile I vs Profile II)
    window.swapGearLoadout = function() {
      if (!gameState.loadouts.A) {
        gameState.loadouts.A = JSON.parse(JSON.stringify(gameState.equipped));
      }

      if (gameState.loadouts.active === 'A') {
        gameState.loadouts.A = JSON.parse(JSON.stringify(gameState.equipped));
        if (!gameState.loadouts.B) {
          gameState.loadouts.B = JSON.parse(JSON.stringify(gameState.equipped));
        }
        gameState.equipped = JSON.parse(JSON.stringify(gameState.loadouts.B));
        gameState.loadouts.active = 'B';
        playSound('equip');
        addFloatingText("⚔️ LOADOUT II ACTIVE", gameState.player.x, gameState.player.y - 25, '#fbbf24', 18);
        showToast("⚔️ Swapped to Profile II Loadout!", "success", true);
      } else {
        gameState.loadouts.B = JSON.parse(JSON.stringify(gameState.equipped));
        gameState.equipped = JSON.parse(JSON.stringify(gameState.loadouts.A));
        gameState.loadouts.active = 'A';
        playSound('equip');
        addFloatingText("⚔️ LOADOUT I ACTIVE", gameState.player.x, gameState.player.y - 25, '#38bdf8', 18);
        showToast("⚔️ Swapped to Profile I Loadout!", "success", true);
      }

      recalcPlayerStats();
      updateHUD();
      renderInventoryUI();
      triggerTelegramHaptic('impact', 'medium');
    };

    // The Jeweler's Quantum Forge (Item Fusion)
    window.openForgeModal = function() {
      toggleModal('forgeModal');
    };

    window.setForgeMode = function(mode) {
      gameState.forge.mode = mode;
      const bAdd = document.getElementById('btnForgeModeAdditive');
      const bInf = document.getElementById('btnForgeModeInfusion');
      const bDual = document.getElementById('btnForgeModeDual');

      [bAdd, bInf, bDual].forEach(b => {
        if (b) b.className = 'p-3 rounded-2xl border-2 border-slate-700 bg-slate-950/40 text-slate-400 font-bold flex flex-col items-center gap-1 hover:border-slate-500';
      });

      if (mode === 'additive' && bAdd) bAdd.className = 'p-3 rounded-2xl border-2 border-cyan-500 bg-cyan-950/40 text-cyan-300 font-bold flex flex-col items-center gap-1 shadow-md';
      if (mode === 'infusion' && bInf) bInf.className = 'p-3 rounded-2xl border-2 border-amber-500 bg-amber-950/40 text-amber-300 font-bold flex flex-col items-center gap-1 shadow-md';
      if (mode === 'dual' && bDual) bDual.className = 'p-3 rounded-2xl border-2 border-purple-500 bg-purple-950/40 text-purple-300 font-bold flex flex-col items-center gap-1 shadow-md';
    };

    window.openForgeSelector = function(socket) {
      const item = gameState.inventory.find(it => it.type === 'weapon' || it.type === 'chest' || it.type === 'head' || it.type === 'boots');
      if (!item) {
        showToast("No forgeable equipment found in bag!", "warning");
        return;
      }
      if (socket === 'A') {
        gameState.forge.itemA = item;
        const nameEl = document.getElementById('forgeNameA');
        if (nameEl) nameEl.textContent = item.name;
      } else {
        gameState.forge.itemB = item;
        const nameEl = document.getElementById('forgeNameB');
        if (nameEl) nameEl.textContent = item.name;
      }
    };

    window.executeItemForge = function() {
      const iA = gameState.forge.itemA;
      const iB = gameState.forge.itemB;
      if (!iA || !iB) {
        showToast("Please place two items into the forge sockets first!", "warning");
        return;
      }
      if (gameState.player.beans < 150) {
        showToast("Requires 150 Stumptown Beans for Forge ignition!", "warning");
        return;
      }

      gameState.player.beans -= 150;
      playSound('special');
      playSound('level');

      const fused = JSON.parse(JSON.stringify(iA));
      fused.id = 'forged_' + Date.now();
      fused.grade = 'ancient';
      fused.name = iA.name + " ★ Masterwork";

      if (gameState.forge.mode === 'additive') {
        fused.damage = Math.round((iA.damage || 15) + (iB.damage || 10) * 0.45);
      } else if (gameState.forge.mode === 'infusion') {
        fused.setId = iB.setId || iA.setId;
      } else {
        fused.damage = Math.round((iA.damage || 15) * 1.3);
        fused.setId = iB.setId || iA.setId;
        fused.sockets = Math.max(1, (iA.sockets || 0) + 1);
      }

      const idxA = gameState.inventory.indexOf(iA);
      if (idxA >= 0) gameState.inventory.splice(idxA, 1);
      const idxB = gameState.inventory.indexOf(iB);
      if (idxB >= 0) gameState.inventory.splice(idxB, 1);

      gameState.inventory.push(fused);
      gameState.forge.itemA = null;
      gameState.forge.itemB = null;

      addFloatingText("🔥 MASTERWORK ITEM SYNTHESIZED!", gameState.player.x, gameState.player.y - 30, '#f59e0b', 20);
      showToast("🔥 Forge successful: " + fused.name + " created!", "success", true);
      renderInventoryUI();
      updateHUD();
      toggleModal('forgeModal');
    };

    // Mayor Safehouse Neighborhood Selection
    window.openSafehouseSelectModal = function() {
      toggleModal('safehouseSelectModal');
    };

    window.selectSafehouseDistrict = function(districtId) {
      const districts = {
        pearl: { name: 'Pearl District Penthouse Arcology', perk: '+15% Gem & Crystal Drop Rate' },
        hawthorne: { name: 'Hawthorne Bohemian Roaster Loft', perk: '+20% Cold Brew Health Potion Potency' },
        lents: { name: 'Lents Industrial Rail Warehouse', perk: '+25% Scrap Metal Salvage Yield' },
        chinatown: { name: 'Chinatown Dragon Tea House', perk: '+15% Movement Speed in Dungeons' }
      };

      const sel = districts[districtId] || districts.hawthorne;
      gameState.safehouse.district = districtId;
      gameState.safehouse.name = sel.name;
      gameState.safehouse.perk = sel.perk;

      playSound('level');
      showToast("Safehouse established at " + sel.name + "!", "success", true);
      toggleModal('safehouseSelectModal');
    };

    // Diablo 2 Quest Journal ('Q' Key)
    window.openQuestLogModal = function() {
      const container = document.getElementById('questCardsContainer');
      if (!container) return;

      container.innerHTML = '';
      Object.values(gameState.activeQuests).forEach(q => {
        const card = document.createElement('div');
        const isDone = q.progress >= q.target;
        const borderCol = isDone ? 'border-emerald-500 bg-emerald-950/20' : 'border-purple-500/40 bg-slate-950/60';
        card.className = 'p-4 rounded-2xl border-2 ' + borderCol + ' space-y-2';
        card.innerHTML = \`
          <div class="flex justify-between items-center font-bold text-white text-sm">
            <span>\${q.title}</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full \${isDone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-purple-500/20 text-purple-300'}">\${isDone ? 'COMPLETED' : 'ACTIVE'}</span>
          </div>
          <div class="text-[11px] text-slate-400">Questgiver: <b class="text-cyan-300">\${q.npc}</b> · Zone: <b class="text-amber-300 uppercase">\${q.targetDistrict}</b></div>
          <div class="flex justify-between items-center text-xs text-slate-300 pt-1">
            <span>Objective: \${q.progress} / \${q.target}</span>
            <span class="text-amber-400 font-bold">🎁 \${q.rewardName}</span>
          </div>
        \`;
        container.appendChild(card);
      });

      toggleModal('questLogModal');
    };

    // Automap ('TAB' Key)
    window.toggleAutomap = function() {
      gameState.automapActive = !gameState.automapActive;
      const overlay = document.getElementById('automapOverlayContainer');
      if (overlay) {
        overlay.classList.toggle('hidden', !gameState.automapActive);
      }
    };

    window.toggleMobileControlMode = function() {
      gameState.controlMode = gameState.controlMode === 'diablo_radial' ? 'neon_twinstick' : 'diablo_radial';
      const badge = document.getElementById('txtControlModeBadge');
      if (badge) {
        badge.textContent = gameState.controlMode === 'diablo_radial' ? '🎮 DIABLO' : '🕹️ TWIN-STICK';
      }
      const cluster = document.getElementById('diabloRadialCluster');
      if (cluster) {
        cluster.classList.toggle('hidden', gameState.controlMode === 'neon_twinstick');
      }
      showToast("Control Mode: " + (gameState.controlMode === 'diablo_radial' ? 'Diablo Radial Arc' : 'Neon Arena Twin-Stick'), "info", true);
    };

    window.toggleImmersiveHud = function() {
      gameState.immersiveHud = !gameState.immersiveHud;
      const topHud = document.getElementById('topNavHeader');
      const bottomDock = document.getElementById('desktopHotbarDock');
      if (topHud) topHud.classList.toggle('opacity-0', gameState.immersiveHud);
      if (bottomDock) bottomDock.classList.toggle('opacity-0', gameState.immersiveHud);
      showToast(gameState.immersiveHud ? "Immersive HUD: UI Hidden" : "Immersive HUD: UI Restored", "info", true);
    };

    // Mobile Dynamic Touch Controller Setup
    const touchSticks = {
      move: { active: false, id: -1, startX: 0, startY: 0 },
      aim:  { active: false, id: -1, startX: 0, startY: 0 }
    };
    let attackHoldInterval = null;

    function initDynamicTouchEngine() {
      const tc = document.getElementById('touchControls');
      if (!tc) return;

      const moveEl = document.getElementById('dynamicMoveStick');
      const moveKnob = document.getElementById('dynamicMoveKnob');
      const aimEl = document.getElementById('dynamicAimStick');
      const aimKnob = document.getElementById('dynamicAimKnob');

      window.addEventListener('touchstart', (e) => {
        if (!audioInitialized) initAudio();
        const W = window.innerWidth;

        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          if (t.clientX < W * 0.50 && !touchSticks.move.active) {
            touchSticks.move.active = true;
            touchSticks.move.id = t.identifier;
            touchSticks.move.startX = t.clientX;
            touchSticks.move.startY = t.clientY;
            if (moveEl) {
              moveEl.style.left = t.clientX + 'px';
              moveEl.style.top = t.clientY + 'px';
              moveEl.classList.remove('hidden');
            }
            if (moveKnob) moveKnob.style.transform = 'translate(0px, 0px)';
            gameState.touchJoystick.active = true;
          } else if (t.clientX >= W * 0.50 && gameState.controlMode === 'neon_twinstick' && !touchSticks.aim.active) {
            touchSticks.aim.active = true;
            touchSticks.aim.id = t.identifier;
            touchSticks.aim.startX = t.clientX;
            touchSticks.aim.startY = t.clientY;
            if (aimEl) {
              aimEl.style.left = t.clientX + 'px';
              aimEl.style.top = t.clientY + 'px';
              aimEl.classList.remove('hidden');
            }
            if (aimKnob) aimKnob.style.transform = 'translate(0px, 0px)';
          }
        }
      }, { passive: false });

      window.addEventListener('touchmove', (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          if (touchSticks.move.active && t.identifier === touchSticks.move.id) {
            let dx = t.clientX - touchSticks.move.startX;
            let dy = t.clientY - touchSticks.move.startY;
            const dist = Math.hypot(dx, dy);
            const R = 50;

            if (dist > R) {
              touchSticks.move.startX += dx - (dx / dist) * R;
              touchSticks.move.startY += dy - (dy / dist) * R;
              if (moveEl) {
                moveEl.style.left = touchSticks.move.startX + 'px';
                moveEl.style.top = touchSticks.move.startY + 'px';
              }
              dx = (dx / dist) * R;
              dy = (dy / dist) * R;
            }

            if (moveKnob) moveKnob.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
            gameState.touchJoystick.dirX = dx / R;
            gameState.touchJoystick.dirY = dy / R;
          }

          if (touchSticks.aim.active && t.identifier === touchSticks.aim.id) {
            let dx = t.clientX - touchSticks.aim.startX;
            let dy = t.clientY - touchSticks.aim.startY;
            const dist = Math.hypot(dx, dy);
            const R = 50;
            if (dist > R) {
              touchSticks.aim.startX += dx - (dx / dist) * R;
              touchSticks.aim.startY += dy - (dy / dist) * R;
              if (aimEl) {
                aimEl.style.left = touchSticks.aim.startX + 'px';
                aimEl.style.top = touchSticks.aim.startY + 'px';
              }
              dx = (dx / dist) * R;
              dy = (dy / dist) * R;
            }
            if (aimKnob) aimKnob.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
            if (dist > 10) {
              gameState.player.angle = Math.atan2(dy, dx);
              triggerAttack();
            }
          }
        }
      }, { passive: false });

      const endTouch = (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          if (touchSticks.move.active && t.identifier === touchSticks.move.id) {
            touchSticks.move.active = false;
            touchSticks.move.id = -1;
            gameState.touchJoystick.active = false;
            gameState.touchJoystick.dirX = 0;
            gameState.touchJoystick.dirY = 0;
            if (moveEl) moveEl.classList.add('hidden');
          }
          if (touchSticks.aim.active && t.identifier === touchSticks.aim.id) {
            touchSticks.aim.active = false;
            touchSticks.aim.id = -1;
            if (aimEl) aimEl.classList.add('hidden');
          }
        }
      };

      window.addEventListener('touchend', endTouch, { passive: false });
      window.addEventListener('touchcancel', endTouch, { passive: false });

      // Primary Attack Button: Hold-to-Attack Auto-Combo Binding
      const btnAtk = document.getElementById('btnRadialAttack');
      if (btnAtk) {
        btnAtk.addEventListener('touchstart', (e) => {
          e.preventDefault();
          if (!audioInitialized) initAudio();
          triggerAutoTargetAttack();
          if (!attackHoldInterval) {
            attackHoldInterval = setInterval(() => {
              triggerAutoTargetAttack();
            }, 180);
          }
        }, { passive: false });

        const stopHoldAttack = () => {
          if (attackHoldInterval) {
            clearInterval(attackHoldInterval);
            attackHoldInterval = null;
          }
        };
        btnAtk.addEventListener('touchend', stopHoldAttack);
        btnAtk.addEventListener('touchcancel', stopHoldAttack);
      }

      const bindBtn = (id, fn) => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (!audioInitialized) initAudio();
            fn();
          }, { passive: false });
        }
      };

      bindBtn('btnRadialDodge', triggerDodge);
      bindBtn('btnRadialSkill1', () => triggerSkill(1));
      bindBtn('btnRadialSkill2', () => triggerSkill(2));
      bindBtn('btnRadialSkill3', () => triggerSkill(3));
    }
    initDynamicTouchEngine();

    function triggerAutoTargetAttack() {
      const p = gameState.player;
      let bestTarget = null;
      let minScore = Infinity;

      if (gameState.enemies && gameState.enemies.length > 0) {
        gameState.enemies.forEach(e => {
          const d = Math.hypot(e.x - p.x, e.y - p.y);
          if (d <= 260) {
            let score = d;
            if (e.isBoss) score -= 100;
            if (e.isElite) score -= 50;
            if (score < minScore) {
              minScore = score;
              bestTarget = e;
            }
          }
        });
      }

      if (bestTarget) {
        p.angle = Math.atan2(bestTarget.y - p.y, bestTarget.x - p.x);
      }
      triggerAttack();
    }

    // Desktop Hotkeys (Q, LMB, RMB, 1-4, TAB, T, X, I, B, E, R, F)
    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      if (e.repeat) return;

      if (key === 'q') {
        e.preventDefault();
        openQuestLogModal();
      } else if (key === 'tab') {
        e.preventDefault();
        toggleAutomap();
      } else if (key === 't') {
        e.preventDefault();
        castTownPortal();
      } else if (key === 'x') {
        e.preventDefault();
        swapGearLoadout();
      } else if (key === '1') {
        usePotion(1);
      } else if (key === '2') {
        usePotion(2);
      } else if (key === '3') {
        usePotion(3);
      } else if (key === '4') {
        usePotion(4);
      } else if (key === 'i' || key === 'b') {
        toggleModal('inventoryModal');
      } else if (key === 'e') {
        triggerSkill(2);
      } else if (key === 'r') {
        triggerSkill(3);
      } else if (key === 'f') {
        triggerTrinket();
      }
    });

    if (typeof canvas !== 'undefined' && canvas) {
      canvas.addEventListener('mousedown', (e) => {
        if (e.button === 2) {
          e.preventDefault();
          triggerSkill(1);
        }
      });
    }
`;

if (!html.includes('MASTER EXPANSION ENGINE: DIABLO ARPG RADIAL')) {
  html = html.substring(0, scriptCloseIdx) + masterJS + '\n  ' + html.substring(scriptCloseIdx);
  console.log('✓ Injected master JS engine before closing </script>');
}

// 5. HOOK updateExorcisms INTO update(dt)
if (!html.includes('updateExorcisms(dt)')) {
  const updateHookTarget = 'function update(dt) {';
  const hookIdx = html.indexOf(updateHookTarget);
  if (hookIdx !== -1) {
    const hookInsert = updateHookTarget + '\n      if (typeof updateExorcisms === "function") updateExorcisms(dt);';
    html = html.replace(updateHookTarget, hookInsert);
    console.log('✓ Hooked updateExorcisms into update(dt)');
  }
}

fs.writeFileSync(targetPath, html, 'utf8');
console.log('Successfully completed full master suite injection!');
