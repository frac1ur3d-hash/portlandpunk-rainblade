import React, { useState, useEffect } from 'react';
import usePlayerStore from './store/playerStore.js';
import useCombatStore from './store/combatStore.js';
import HUD from './components/UI/HUD.jsx';
import GameMap from './components/Map/GameMap.jsx';
import CombatArena from './components/Combat/CombatArena.jsx';
import Inventory from './components/UI/Inventory.jsx';
import CharacterSelect from './components/Menus/CharacterSelect.jsx';
import AnimationLab from './components/UI/AnimationLab.jsx';
import LandingPage from './components/Landing/LandingPage.jsx';

export default function App() {
  const character = usePlayerStore((s) => s.character);
  const combatActive = useCombatStore((s) => s.active);

  const [inMapGame, setInMapGame] = useState(false);
  const [activeTab, setActiveTab] = useState(null); // 'inventory' | 'animations' | null
  const [crtEnabled, setCrtEnabled] = useState(true);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key.toLowerCase() === 'i') {
        setActiveTab((prev) => (prev === 'inventory' ? null : 'inventory'));
      }
      if (e.key.toLowerCase() === 'a') {
        setActiveTab((prev) => (prev === 'animations' ? null : 'animations'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Default to Dope Cyberpunk Landing Page with Play Links
  if (!inMapGame) {
    return <LandingPage onPlayBrowserMap={() => setInMapGame(true)} />;
  }

  if (!character) {
    return <CharacterSelect onComplete={() => {}} />;
  }

  return (
    <div className={`w-full h-full flex flex-col items-center justify-between p-3 bg-[#05050a] ${crtEnabled ? 'crt-overlay crt-vignette' : ''}`}>
      {/* HUD Header Bar */}
      <HUD
        onOpenInventory={() => setActiveTab(activeTab === 'inventory' ? null : 'inventory')}
        onOpenAnimations={() => setActiveTab(activeTab === 'animations' ? null : 'animations')}
        activeTab={activeTab}
      />

      {/* Main Map View */}
      <main className="flex-1 w-full max-w-[900px] flex items-center justify-center my-1">
        <GameMap />
      </main>

      {/* Footer Status & CRT Toggle */}
      <footer className="w-full max-w-[900px] flex justify-between items-center text-[7px] text-[#757599] px-2 py-1">
        <div className="flex items-center gap-3">
          <span>PORTLANDPUNK v0.2.0 // 100% OPEN-SOURCE 8-BIT RPG</span>
          <button
            onClick={() => setInMapGame(false)}
            className="text-[#00f5ff] hover:underline"
          >
            ← BACK TO HUB
          </button>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/rain-blade.html"
            className="text-[#30d158] hover:underline font-bold"
          >
            LAUNCH RAIN BLADE ARPG ⚔️
          </a>
          <button
            onClick={() => setCrtEnabled(!crtEnabled)}
            className="hover:text-[#00f5ff] uppercase cursor-pointer"
          >
            CRT: {crtEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </footer>

      {/* Modals */}
      {activeTab === 'inventory' && (
        <Inventory onClose={() => setActiveTab(null)} />
      )}
      {activeTab === 'animations' && (
        <AnimationLab onClose={() => setActiveTab(null)} />
      )}

      {/* Turn-based combat overlay */}
      {combatActive && <CombatArena />}
    </div>
  );
}
