import React, { useState, useEffect } from 'react';

export default function LandingPage({ onPlayBrowserMap }) {
  const [activeTab, setActiveTab] = useState('features');

  return (
    <div className="min-h-screen w-full bg-[#05050a] text-slate-100 flex flex-col items-center crt-overlay crt-vignette font-mono selection:bg-[#00f5ff] selection:text-black">
      {/* Top Cyber Nav */}
      <header className="w-full max-w-6xl p-4 flex items-center justify-between border-b border-[#14182b] bg-[#070914]/90 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#00f5ff]/10 border border-[#00f5ff] flex items-center justify-center text-lg text-[#00f5ff]">
            🗡️
          </div>
          <div>
            <div className="font-black text-sm tracking-wider text-white flex items-center gap-2">
              PORTLAND PROTOCOL <span className="text-[#00f5ff] text-[9px] px-1.5 py-0.5 rounded bg-[#00f5ff]/20 border border-[#00f5ff]/40">v0.2.0</span>
            </div>
            <div className="text-[9px] text-[#ff2d55]">RAIN BLADE // 8-BIT CYBER HACK & SLASH</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/frac1ur3d-hash/portlandpunk-rainblade"
            target="_blank"
            rel="noreferrer"
            className="text-[10px] text-slate-400 hover:text-white border border-slate-700 px-3 py-1.5 rounded-lg transition-colors hidden sm:flex items-center gap-1.5"
          >
            <span>GITHUB</span>
            <span className="text-[8px] bg-slate-800 px-1 py-0.2 rounded">OPEN-SOURCE</span>
          </a>
          <a
            href="/rain-blade.html"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00f5ff] to-[#38bdf8] text-slate-950 font-black text-xs hover:shadow-[0_0_20px_rgba(0,245,255,0.6)] transition-all flex items-center gap-1.5"
          >
            <span>PLAY LIVE</span>
            <span className="text-[14px]">⚡</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-5xl px-4 pt-12 pb-8 flex flex-col items-center text-center relative overflow-hidden">
        {/* Neon Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-950/40 text-emerald-400 text-[10px] mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>PACIFIC NORTHWEST ANOMALY DETECTED // 60 FPS BROWSER ENGINE</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-4">
          PORTLAND’S STREETS JUST <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5ff] via-[#ff2d55] to-[#fbbf24]">WENT ROGUE.</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed mb-8">
          A fast-paced Diablo-style 8-Bit Cyber ARPG set across rain-soaked Portland neighborhoods. 
          Deflect bullets back at bosses with tactical blade ricochet, master Diablo 3-style skill runes, 
          and collect 120+ unique Portland weapons, armors, and relics.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <a
            href="/rain-blade.html"
            className="px-6 py-3.5 rounded-2xl bg-[#00f5ff] hover:bg-[#38bdf8] text-slate-950 font-black text-sm shadow-[0_0_25px_rgba(0,245,255,0.5)] transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <span>LAUNCH RAIN BLADE (DESKTOP / MOBILE)</span>
            <span className="text-base">⚔️</span>
          </a>

          <button
            onClick={onPlayBrowserMap}
            className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm transition-all flex items-center gap-2"
          >
            <span>EXPLORE GPS MAP RPG</span>
            <span className="text-base">🗺️</span>
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-cyan-500/30 backdrop-blur-md">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-sm font-bold text-cyan-400 mb-1">Blade Ricochet Physics</div>
            <div className="text-xs text-slate-400 leading-relaxed">
              Slash through incoming ranged bullets. Projectiles ricochet off the blade curve and target enemies with critical speed.
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-emerald-500/30 backdrop-blur-md">
            <div className="text-2xl mb-2">🔮</div>
            <div className="text-sm font-bold text-emerald-400 mb-1">Diablo 3 Skill Runes</div>
            <div className="text-xs text-slate-400 leading-relaxed">
              Customize Deluge, Cold Brew Haste, and Briar Cyclone with 3 specialized Runes that morph visual effects and elemental damage.
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-amber-500/30 backdrop-blur-md">
            <div className="text-2xl mb-2">☕</div>
            <div className="text-sm font-bold text-amber-400 mb-1">Gear Mastery & Reforging</div>
            <div className="text-xs text-slate-400 leading-relaxed">
              Equipped gear gains Weapon XP with every kill. Reforge gear up to Level 10 and 5 Stars using Stumptown Beans for stat multipliers.
            </div>
          </div>
        </div>
      </section>

      {/* 120+ Gear & District Showcase */}
      <section className="w-full max-w-5xl px-4 py-10 border-t border-slate-900">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-2">
          <div>
            <h2 className="text-xl font-bold text-white">PORTLAND ARSENAL & ANOMALIES</h2>
            <p className="text-xs text-slate-400">120+ authentic district-themed weapons, trenchcoats, and relics</p>
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300">COMMON</span>
            <span className="text-[10px] px-2.5 py-1 rounded-lg bg-blue-950 text-blue-300 border border-blue-800">RARE</span>
            <span className="text-[10px] px-2.5 py-1 rounded-lg bg-purple-950 text-purple-300 border border-purple-800">EPIC</span>
            <span className="text-[10px] px-2.5 py-1 rounded-lg bg-amber-950 text-amber-300 border border-amber-800">LEGENDARY</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="text-lg">📖</div>
            <div className="font-bold text-amber-400">Powell’s Tome Blade</div>
            <div className="text-[10px] text-slate-400">+68 Attack, Bibliophile Arcana</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="text-lg">🪚</div>
            <div className="font-bold text-amber-400">Steel Bridge Chainsaw</div>
            <div className="text-[10px] text-slate-400">+75 Attack, Twin-Deck Shredder</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="text-lg">🦺</div>
            <div className="font-bold text-amber-400">Pearl Nanoweave Suit</div>
            <div className="text-[10px] text-slate-400">+165 HP, +36 Deflection Matrix</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="text-lg">🍩</div>
            <div className="font-bold text-blue-400">Voodoo Bacon Maple Ring</div>
            <div className="text-[10px] text-slate-400">+15% Speed, +10% Crit Rate</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 max-w-6xl">
        <div>PORTLAND PROTOCOL // 100% OPEN SOURCE ON GITHUB</div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <a href="/rain-blade.html" className="text-cyan-400 hover:underline">Play Rain Blade</a>
          <a href="https://github.com/frac1ur3d-hash/portlandpunk-rainblade" target="_blank" rel="noreferrer" className="text-slate-300 hover:underline">GitHub Repo</a>
        </div>
      </footer>
    </div>
  );
}
