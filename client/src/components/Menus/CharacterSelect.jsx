import React, { useState, useEffect, useRef } from 'react';
import usePlayerStore from '../../store/playerStore.js';
import { CLASSES, CLASS_NAMES, CLASS_DESCRIPTIONS } from '@shared/constants.js';
import { SPRITES, drawPixelSprite } from '../../graphics/pixelSprites.js';
import chiptune from '../../audio/chiptune.js';

export default function CharacterSelect({ onComplete }) {
  const [selectedClassIdx, setSelectedClassIdx] = useState(0);
  const [charName, setCharName] = useState('CYBER_NINJA');
  const setCharacter = usePlayerStore((s) => s.setCharacter);
  const canvasRef = useRef(null);

  const currentClassKey = CLASSES[selectedClassIdx];
  const currentClassName = CLASS_NAMES[currentClassKey];
  const currentLore = CLASS_DESCRIPTIONS[currentClassKey];

  // Render 8-Bit Animated Sprite Preview on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    let animId;
    let tick = 0;

    const render = () => {
      tick++;
      ctx.fillStyle = '#06070e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 8-bit floor platform shadow
      ctx.fillStyle = '#141624';
      ctx.fillRect(20, 110, 88, 12);

      // Bobbing idle animation
      const bob = Math.sin(tick * 0.08) * 3;
      const sprite = SPRITES[currentClassKey] || SPRITES.samurai;

      drawPixelSprite(ctx, sprite, 32, 24 + bob, 4);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [selectedClassIdx, currentClassKey]);

  const handleSelect = (idx) => {
    chiptune.playSelect();
    setSelectedClassIdx(idx);
  };

  const handleStartGame = () => {
    chiptune.playLevelUp();
    chiptune.startAmbientCyberBGM();
    setCharacter({
      classId: selectedClassIdx,
      characterName: charName.trim() || 'RUNNER',
      level: 1,
      xp: 0,
    });
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-[#050508] z-50 flex flex-col items-center justify-center p-4 crt-overlay crt-vignette">
      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-[20px] text-[#00f5ff] font-bold tracking-wider glitch mb-2" data-text="PORTLAND PUNK">
          PORTLAND PUNK
        </h1>
        <div className="text-[9px] text-[#ff2d55]">
          [ 8-BIT CYBER HACK & SLASH // OPEN-SOURCE ]
        </div>
      </div>

      <div className="pixel-box-cyan max-w-[760px] w-full p-6 bg-[#0a0c16] flex flex-col gap-6">
        <div className="text-[11px] text-center text-white font-bold border-b-2 border-[#1a1c2e] pb-2">
          SELECT YOUR CLASS
        </div>

        {/* 4 Class Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CLASSES.map((cls, idx) => (
            <button
              key={cls}
              onClick={() => handleSelect(idx)}
              className={`pixel-btn text-[9px] p-2 flex flex-col items-center gap-1 ${
                selectedClassIdx === idx ? 'pixel-box-pink text-[#ff2d55] border-[#ff2d55]' : ''
              }`}
            >
              <span className="text-[16px]">
                {idx === 0 ? '⚔️' : idx === 1 ? '💻' : idx === 2 ? '🗡️' : '🌊'}
              </span>
              <span>{CLASS_NAMES[cls].toUpperCase()}</span>
            </button>
          ))}
        </div>

        {/* Class Preview Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-[#111322] p-4 pixel-box">
          {/* 8-Bit Canvas Sprite */}
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              width={128}
              height={128}
              className="pixel-box bg-[#06070e] block"
            />
          </div>

          {/* Details & Lore */}
          <div className="sm:col-span-2 flex flex-col gap-2 text-[9px]">
            <div className="text-[#00f5ff] text-[12px] font-bold">
              {currentClassName.toUpperCase()}
            </div>
            <div className="text-[#c0c0e0] leading-relaxed">
              {currentLore}
            </div>
            <div className="text-[#ffd60a] text-[8px] mt-2">
              BASE ATTRIBUTES:
              <div className="flex gap-4 mt-1 text-white">
                <span>ATK: {selectedClassIdx === 0 ? '16' : '10'}</span>
                <span>DEF: {selectedClassIdx === 0 ? '8' : '6'}</span>
                <span>SPD: {selectedClassIdx === 2 ? '14' : '8'}</span>
                <span>INT: {selectedClassIdx === 1 ? '18' : '6'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Character Name Input & Play Button */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-t-2 border-[#1a1c2e] pt-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-[9px] text-[#757599]">CALLSIGN:</span>
            <input
              type="text"
              value={charName}
              onChange={(e) => setCharName(e.target.value.toUpperCase())}
              maxLength={12}
              className="pixel-box px-3 py-1.5 bg-black text-[#00f5ff] text-[10px] uppercase outline-none w-[180px]"
            />
          </div>

          <button
            onClick={handleStartGame}
            className="pixel-btn text-[11px] px-6 py-3 bg-[#00f5ff] text-black border-black font-bold w-full sm:w-auto hover:bg-[#ff2d55] hover:text-white"
          >
            JACK IN // START GAME [ENTER]
          </button>
        </div>
      </div>
    </div>
  );
}
