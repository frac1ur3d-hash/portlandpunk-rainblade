import React, { useState, useEffect, useRef } from 'react';
import { ANIMATED_SPRITES, ENEMY_SPRITES, drawPixelSprite } from '../../graphics/pixelSprites.js';
import chiptune from '../../audio/chiptune.js';

export default function AnimationLab({ onClose }) {
  const [selectedEntity, setSelectedEntity] = useState('samurai'); // 'samurai' | 'netrunner' | 'infiltrator' | 'shaman' | 'drone' | 'boss_specter'
  const [currentAnim, setCurrentAnim] = useState('idle'); // 'idle' | 'walk' | 'attack'
  const [scale, setScale] = useState(6);
  const [speed, setSpeed] = useState(150); // ms per frame
  const canvasRef = useRef(null);

  const isEnemy = ['drone', 'boss_specter'].includes(selectedEntity);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    let frameIdx = 0;
    let timer = null;

    const tick = () => {
      ctx.fillStyle = '#060710';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Floor grid
      ctx.strokeStyle = '#121626';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 16) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 16) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Shadow
      ctx.fillStyle = '#101424';
      ctx.fillRect(30, 115, canvas.width - 60, 10);

      // Get current sprite frame
      let spriteFrame;
      if (isEnemy) {
        spriteFrame = ENEMY_SPRITES[selectedEntity];
      } else {
        const entityAnims = ANIMATED_SPRITES[selectedEntity] || ANIMATED_SPRITES.samurai;
        const frames = entityAnims[currentAnim] || entityAnims.idle;
        spriteFrame = frames[frameIdx % frames.length];
      }

      const drawX = Math.floor((canvas.width - 16 * scale) / 2);
      const drawY = Math.floor((canvas.height - 16 * scale) / 2) - 10;

      drawPixelSprite(ctx, spriteFrame, drawX, drawY, scale);

      frameIdx++;
    };

    tick();
    timer = setInterval(tick, speed);

    return () => clearInterval(timer);
  }, [selectedEntity, currentAnim, scale, speed, isEnemy]);

  const triggerAttack = () => {
    setCurrentAnim('attack');
    chiptune.playLaserSlash();
    setTimeout(() => setCurrentAnim('idle'), 600);
  };

  return (
    <div className="fixed inset-0 bg-black/85 z-[3000] flex items-center justify-center p-4 crt-overlay">
      <div className="pixel-box-cyan max-w-[640px] w-full p-5 bg-[#0b0c16] flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b-2 border-[#1e2238] pb-3">
          <div className="text-[12px] text-[#00f5ff] font-bold">
            8-BIT ANIMATION LAB // SPRITE SHOWCASE
          </div>
          <button onClick={onClose} className="pixel-btn text-[9px] px-2 py-1 text-[#ff2d55]">
            [X]
          </button>
        </div>

        {/* Character Selector */}
        <div className="flex flex-wrap gap-2 text-[8px]">
          {['samurai', 'netrunner', 'infiltrator', 'shaman', 'drone', 'boss_specter'].map((key) => (
            <button
              key={key}
              onClick={() => {
                chiptune.playSelect();
                setSelectedEntity(key);
                if (['drone', 'boss_specter'].includes(key)) setCurrentAnim('idle');
              }}
              className={`pixel-btn text-[8px] px-2.5 py-1.5 uppercase ${selectedEntity === key ? 'border-[#00f5ff] text-[#00f5ff]' : ''}`}
            >
              {key.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Preview Canvas */}
        <div className="flex justify-center my-2">
          <canvas
            ref={canvasRef}
            width={240}
            height={200}
            className="pixel-box bg-[#060710] block"
          />
        </div>

        {/* Animation Actions */}
        {!isEnemy && (
          <div className="flex flex-wrap gap-2 justify-center text-[9px]">
            <button
              onClick={() => { chiptune.playSelect(); setCurrentAnim('idle'); }}
              className={`pixel-btn text-[9px] px-3 py-2 ${currentAnim === 'idle' ? 'text-[#30d158] border-[#30d158]' : ''}`}
            >
              IDLE
            </button>
            <button
              onClick={() => { chiptune.playSelect(); setCurrentAnim('walk'); }}
              className={`pixel-btn text-[9px] px-3 py-2 ${currentAnim === 'walk' ? 'text-[#0a84ff] border-[#0a84ff]' : ''}`}
            >
              WALK CYCLE
            </button>
            <button
              onClick={triggerAttack}
              className="pixel-btn pixel-btn-pink text-[9px] px-4 py-2 font-bold"
            >
              ⚡ ATTACK SLASH
            </button>
          </div>
        )}

        {/* Speed & Scale Controls */}
        <div className="flex justify-between items-center text-[8px] text-[#757599] border-t-2 border-[#1a1c2e] pt-3">
          <div className="flex items-center gap-2">
            <span>ZOOM:</span>
            {[4, 6, 8].map((s) => (
              <button
                key={s}
                onClick={() => setScale(s)}
                className={`pixel-btn text-[7px] px-2 py-1 ${scale === s ? 'text-[#00f5ff]' : ''}`}
              >
                {s}x
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span>SPEED:</span>
            {[250, 150, 80].map((spd, i) => (
              <button
                key={spd}
                onClick={() => setSpeed(spd)}
                className={`pixel-btn text-[7px] px-2 py-1 ${speed === spd ? 'text-[#00f5ff]' : ''}`}
              >
                {i === 0 ? 'SLOW' : i === 1 ? 'NORM' : 'FAST'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
