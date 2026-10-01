const fs = require('fs');
const path = require('path');

const rainBladePath = path.join(__dirname, 'client/public/rain-blade.html');
let content = fs.readFileSync(rainBladePath, 'utf8');

console.log('Original rain-blade.html length:', content.length);

// 1. ADD META TAGS IN <head>
const metaTags = `  <meta name="author" content="Kyle McLeod">
  <meta name="creator" content="Kyle McLeod">
  <meta name="director" content="Kyle McLeod">
  <meta name="designer" content="Kyle McLeod">
  <meta name="description" content="Portland Protocol: Rain Blade - Modern Cyberpunk Urban ARPG created, directed and designed by Kyle McLeod">`;

content = content.replace('<title>Portland Protocol: Rain Blade | Modern Urban ARPG</title>', `<title>Portland Protocol: Rain Blade | Modern Urban ARPG</title>\n${metaTags}`);

// 2. ADD CREDITS BUTTON IN TOP HEADER (NEXT TO STUDIO)
const headerStudioBtn = `      <button onclick="toggleModal('hotTuningModal')" class="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-amber-400 hover:text-white transition-all flex items-center gap-1 font-mono text-xs cursor-pointer" title="Live Hot-Tuning Studio (~ or F1)">
        <span class="text-sm">🛠️</span>
        <span class="hidden xl:inline text-[10px] font-bold">STUDIO</span>
      </button>`;

const headerCreditsBtn = `      <button onclick="toggleModal('hotTuningModal')" class="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-amber-400 hover:text-white transition-all flex items-center gap-1 font-mono text-xs cursor-pointer" title="Live Hot-Tuning Studio (~ or F1)">
        <span class="text-sm">🛠️</span>
        <span class="hidden xl:inline text-[10px] font-bold">STUDIO</span>
      </button>

      <!-- Credits Button -->
      <button onclick="toggleModal('creditsModal')" class="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-amber-500/50 text-amber-300 hover:text-white transition-all flex items-center gap-1 font-mono text-xs cursor-pointer" title="Game Credits & Creator Attribution">
        <span class="text-sm">📜</span>
        <span class="hidden xl:inline text-[10px] font-bold">CREDITS</span>
      </button>`;

content = content.replace(headerStudioBtn, headerCreditsBtn);

// 3. ADD CREDITS BUTTON IN pauseModal
const pauseShortcutsRow = `          <!-- Advanced Graphics, Telemetry ETL & Hot-Tuning Studio Shortcuts -->
          <div class="grid grid-cols-3 gap-2">
            <button onclick="toggleModal('graphicsModal')" class="py-2 rounded-xl bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer" title="Graphics & Dynamic Lighting">
              <span>🎨</span>
              <span>GFX (F3)</span>
            </button>
            <button onclick="toggleModal('analyticsModal')" class="py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer" title="Telemetry ETL Analytics">
              <span>📊</span>
              <span>ETL (F2)</span>
            </button>
            <button onclick="toggleModal('hotTuningModal')" class="py-2 rounded-xl bg-amber-950/60 hover:bg-amber-900 border border-amber-500/40 text-amber-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer" title="Live Hot-Tuning Studio (~ / F1)">
              <span>🛠️</span>
              <span>STUDIO</span>
            </button>
          </div>`;

const pauseCreditsBtn = `${pauseShortcutsRow}

          <!-- Official Credits & Creator Attribution -->
          <button onclick="toggleModal('creditsModal')" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-950/60 to-slate-900 hover:from-amber-900/60 hover:to-slate-800 border border-amber-500/60 hover:border-amber-400 text-amber-300 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)]" title="Game Credits & Creator Attribution">
            <span>📜</span>
            <span>CREDITS: KYLE MCLEOD (CREATOR & LEAD DESIGNER)</span>
          </button>`;

content = content.replace(pauseShortcutsRow, pauseCreditsBtn);

// 4. ADD creditsModal TO THE MODAL REGISTRY IN toggleModal
content = content.replace(
  `['inventoryModal', 'skillsModal', 'locationModal', 'charModal', 'pauseModal', 'multiplayerModal', 'graphicsModal', 'analyticsModal', 'hotTuningModal'].forEach(id => {`,
  `['inventoryModal', 'skillsModal', 'locationModal', 'charModal', 'pauseModal', 'multiplayerModal', 'graphicsModal', 'analyticsModal', 'hotTuningModal', 'creditsModal'].forEach(id => {`
);

// 5. INSERT creditsModal HTML BEFORE hotTuningModal
const creditsModalHTML = `  <!-- ==================== OFFICIAL CREDITS MODAL ==================== -->
  <div id="creditsModal" class="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md hidden flex items-center justify-center p-3 sm:p-4 select-none">
    <div class="relative w-full max-w-lg bg-slate-900/95 border border-amber-500/60 rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.3)] flex flex-col max-h-[92vh] overflow-hidden text-slate-100 font-sans">
      <!-- Header -->
      <div class="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/80">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 text-lg">
            📜
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-black font-display tracking-wider text-white">PROJECT CREDITS</h2>
            <p class="text-[11px] font-mono text-amber-400">Portland Protocol: Rain Blade</p>
          </div>
        </div>
        <button onclick="toggleModal('creditsModal')" class="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer">
          ✕
        </button>
      </div>

      <!-- Content -->
      <div class="p-5 overflow-y-auto space-y-4 text-xs font-mono">
        <!-- Lead Creator Card -->
        <div class="p-4 rounded-2xl bg-gradient-to-b from-amber-950/50 via-slate-900/90 to-slate-950 border border-amber-500/70 shadow-[0_0_30px_rgba(245,158,11,0.25)] text-center space-y-2">
          <div class="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-[10px] font-bold text-amber-300 uppercase tracking-widest">
            CREATOR, DIRECTOR & LEAD GAME DESIGNER
          </div>
          <div class="text-2xl sm:text-3xl font-black font-display text-white tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-300">
            Kyle McLeod
          </div>
          <div class="text-xs text-amber-400 font-mono font-bold">
            @frac1ur3d-hash
          </div>
          <div class="text-[11px] text-slate-300 font-sans leading-relaxed pt-2 border-t border-slate-800/80 text-left sm:text-center">
            • Original Concept, World Lore, District Landscaping Vision & Gameplay Direction<br/>
            • Design of Diablo 3 Shrine mechanics, Item Grading tiers, and Cyberpunk Themes<br/>
            • Continuous Quality Assurance, Mobile/Desktop Playtesting, and Performance Guidance
          </div>
        </div>

        <!-- Technical & Systems Architecture -->
        <div class="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
          <div class="text-[10px] uppercase tracking-wider text-cyan-400 font-bold">Autonomous AI Systems Architecture</div>
          <div class="text-white font-bold text-sm">Antigravity (Google DeepMind)</div>
          <div class="text-[11px] text-slate-400 leading-normal font-sans">
            Ultra-Fast 60–120 FPS Engine ($0.38ms render loop), SpatialHashGrid, Virtual Texture Megachunking, Zero-GC Object Pools, Downsampled 2D Atmospheric Lighting, Live Hot-Tuning Studio & Telemetry ETL Pipeline.
          </div>
        </div>

        <!-- Audio & Synthesis -->
        <div class="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
          <div class="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Interactive Audio & Dubstep Engine</div>
          <div class="text-white font-bold text-sm">Tone.js (v14.8.49)</div>
          <div class="text-[11px] text-slate-400 leading-normal font-sans">
            Dynamic synthesized bass drops, blade ricochet chimes, impact transients, and district ambient rain resonance.
          </div>
        </div>

        <!-- Visuals & Pixel Art -->
        <div class="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
          <div class="text-[10px] uppercase tracking-wider text-rose-400 font-bold">Retro 8-Bit Pixel Matrices & Visual Shaders</div>
          <div class="text-white font-bold text-sm">Rain-Walker Dynamic Attire & District Apex Bosses</div>
          <div class="text-[11px] text-slate-400 leading-normal font-sans">
            Hero paperdoll visual gear swaps, multi-layered district landscape canopies, and elemental elite affix auras.
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-5 py-3 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
        <div class="text-[10px] text-slate-500 font-mono">Portland Protocol v0.3.0 • 100% Open Source</div>
        <button onclick="toggleModal('creditsModal')" class="px-4 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-bold text-xs transition-all cursor-pointer">
          CLOSE
        </button>
      </div>
    </div>
  </div>\n\n`;

content = content.replace('<!-- ==================== LIVE HOT-TUNING STUDIO MODAL ==================== -->', `${creditsModalHTML}  <!-- ==================== LIVE HOT-TUNING STUDIO MODAL ==================== -->`);

fs.writeFileSync(rainBladePath, content, 'utf8');
console.log('Successfully updated rain-blade.html with Credits! New size:', content.length);
