import React, { useState } from 'react';
import usePlayerStore from '../../store/playerStore.js';
import { CLASS_NAMES } from '@shared/constants.js';
import chiptune from '../../audio/chiptune.js';

export default function HUD({ onOpenInventory, onOpenAnimations, activeTab }) {
  const character = usePlayerStore((s) => s.character) || { classId: 0, characterName: 'CYBERPUNK', level: 1, xp: 0 };
  const hp = usePlayerStore((s) => s.hp);
  const maxHp = usePlayerStore((s) => s.maxHp);
  const mp = usePlayerStore((s) => s.mp);
  const maxMp = usePlayerStore((s) => s.maxMp);
  const xp = usePlayerStore((s) => s.xp);
  const level = usePlayerStore((s) => s.level);
  const punkBalance = usePlayerStore((s) => s.punkBalance) || 0;
  const temporaryWallet = usePlayerStore((s) => s.temporaryWallet);

  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [saveStatus, setSaveStatus] = useState('SAVED');
  const [showWalletModal, setShowWalletModal] = useState(false);

  const classKey = ['samurai', 'netrunner', 'infiltrator', 'shaman'][character.classId] || 'samurai';
  const className = CLASS_NAMES[classKey] || 'Samurai';

  const toggleSound = () => {
    const muted = chiptune.toggleMute();
    setIsAudioMuted(muted);
    if (!muted) chiptune.playSelect();
  };

  const handleManualSave = () => {
    chiptune.playLevelUp();
    usePlayerStore.getState().saveToStorage();
    setSaveStatus('SAVED!');
    setTimeout(() => setSaveStatus('SAVED'), 1500);
  };

  return (
    <>
      <header className="pixel-box w-full max-w-[900px] p-3 mb-2 flex flex-wrap justify-between items-center bg-[#0d0d16] text-[9px] gap-2">
        {/* Character Profile & Level */}
        <div className="flex items-center gap-3">
          <div className="w-[36px] h-[36px] bg-[#1a1a2e] border-2 border-[#00f5ff] flex items-center justify-center text-[18px]">
            {character.classId === 0 ? '⚔️' : character.classId === 1 ? '💻' : character.classId === 2 ? '🗡️' : '🌊'}
          </div>
          <div>
            <div className="text-white font-bold flex items-center gap-2">
              <span>{character.characterName.toUpperCase()}</span>
              <span className="text-[#00f5ff] text-[8px]">[{className.toUpperCase()}]</span>
            </div>
            <div className="text-[#30d158] text-[8px] flex items-center gap-2 mt-0.5">
              <span>LVL {level}</span>
              <span className="text-[#757599]">XP: {xp}/{level * 100}</span>
            </div>
          </div>
        </div>

        {/* HP and MP Retro Bars */}
        <div className="flex flex-col gap-1 w-[160px]">
          <div className="flex justify-between text-[7px] text-white">
            <span>HP</span>
            <span>{hp}/{maxHp}</span>
          </div>
          <div className="bar-track-8bit w-full">
            <div
              className="bar-fill-8bit bg-[#ff3b30]"
              style={{ width: `${Math.max(0, (hp / maxHp) * 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-[7px] text-white">
            <span>MP</span>
            <span>{mp}/{maxMp}</span>
          </div>
          <div className="bar-track-8bit w-full">
            <div
              className="bar-fill-8bit bg-[#0a84ff]"
              style={{ width: `${Math.max(0, (mp / maxMp) * 100)}%` }}
            />
          </div>
        </div>

        {/* Currency & Control Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="pixel-box p-1.5 bg-[#141420] flex items-center gap-1.5 border-[#ffd60a]">
            <span className="text-[14px]">🪙</span>
            <div>
              <div className="text-[#ffd60a] font-bold">{punkBalance} $PUNK</div>
              <div className="text-[7px] text-[#757599]">CREDITS</div>
            </div>
          </div>

          {/* Temporary Account Badge */}
          {temporaryWallet && (
            <button
              onClick={() => setShowWalletModal(true)}
              className="pixel-btn text-[7px] px-2 py-1.5 border-[#bf5af2] text-[#bf5af2]"
              title="Click to view temporary runner account"
            >
              RUNNER: {temporaryWallet.slice(0, 6)}...{temporaryWallet.slice(-4)}
            </button>
          )}

          {/* 8-Bit Animation Lab Button */}
          <button
            onClick={onOpenAnimations}
            className={`pixel-btn text-[8px] px-2.5 py-2 ${activeTab === 'animations' ? 'border-[#30d158] text-[#30d158]' : 'text-[#30d158]'}`}
            title="Open 8-Bit Animation Showcase"
          >
            ANIMATIONS
          </button>

          {/* Inventory Toggle Button */}
          <button
            onClick={onOpenInventory}
            className={`pixel-btn text-[8px] px-2.5 py-2 ${activeTab === 'inventory' ? 'border-[#00f5ff] text-[#00f5ff]' : ''}`}
          >
            GEAR [I]
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={toggleSound}
            className="pixel-btn text-[8px] px-2 py-2"
            title="Toggle 8-bit Sound"
          >
            {isAudioMuted ? '🔇' : '🔊'}
          </button>

          {/* Save Game Button */}
          <button
            onClick={handleManualSave}
            className="pixel-btn text-[8px] px-2.5 py-2 text-[#ffd60a] border-[#ffd60a]"
            title="Save Progress to Browser"
          >
            💾 {saveStatus}
          </button>
        </div>
      </header>

      {/* Temporary Runner Wallet Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black/80 z-[3500] flex items-center justify-center p-4 crt-overlay">
          <div className="pixel-box-pink max-w-[500px] w-full p-6 bg-[#0c0c16] flex flex-col gap-4">
            <div className="flex justify-between items-center border-b-2 border-[#202035] pb-3">
              <div className="text-[11px] text-[#ff2d55] font-bold">
                TEMPORARY RUNNER ACCOUNT
              </div>
              <button
                onClick={() => setShowWalletModal(false)}
                className="pixel-btn text-[9px] px-2 py-1 text-[#ff2d55]"
              >
                [X]
              </button>
            </div>

            <div className="pixel-box p-3 bg-[#111322] text-[9px] flex flex-col gap-2">
              <div className="text-[#757599]">AUTO-GENERATED RUNNER ID:</div>
              <div className="text-[#00f5ff] font-mono text-[8px] break-all bg-black/50 p-2 border border-[#00f5ff]/30">
                {temporaryWallet}
              </div>
              <div className="text-[#e0e0ff] text-[8px] leading-relaxed mt-1">
                You are playing on an automatic **Temporary Runner Wallet**.
                Zero MetaMask required for beta testing. All your gear, $PUNK, and levels are saved directly to this runner ID.
              </div>
            </div>

            <div className="pixel-box p-3 bg-[#161220] border-[#bf5af2] text-[8px] text-[#c0c0ff] leading-relaxed">
              <div className="text-[#bf5af2] font-bold mb-1">CONNECT LATER (WEB3 READY):</div>
              When you're ready to migrate your loot on-chain, you'll be able to link a permanent MetaMask or hardware wallet with one click!
            </div>

            <button
              onClick={() => setShowWalletModal(false)}
              className="pixel-btn text-[10px] w-full p-2.5 bg-[#00f5ff] text-black border-black font-bold"
            >
              CONTINUE PLAYING
            </button>
          </div>
        </div>
      )}
    </>
  );
}
