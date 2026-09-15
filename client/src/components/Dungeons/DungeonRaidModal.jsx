import React, { useState, useEffect } from 'react';
import usePlayerStore from '../../store/playerStore.js';
import useCombatStore from '../../store/combatStore.js';
import { PORTLAND_DUNGEONS } from '@shared/dungeons.js';
import { getLiveCellDensity } from '@shared/cellDensity.js';
import chiptune from '../../audio/chiptune.js';

export default function DungeonRaidModal({ dungeon, onClose, onEnterDungeon }) {
  const player = usePlayerStore((s) => s.character);
  const playerLevel = usePlayerStore((s) => s.level);
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [densityInfo, setDensityInfo] = useState(null);

  useEffect(() => {
    if (dungeon) {
      const live = getLiveCellDensity(dungeon.hotspotKey);
      setDensityInfo(live);
    }
  }, [dungeon]);

  if (!dungeon) return null;

  const currentFloorData = dungeon.floors.find((f) => f.floor === selectedFloor) || dungeon.floors[0];
  const totalDemons = (densityInfo?.demonCount || 5) + (selectedFloor * 2);

  const handleLaunchRaid = () => {
    chiptune.playLevelUp();
    onEnterDungeon(dungeon, selectedFloor, currentFloorData, densityInfo);
  };

  return (
    <div className="fixed inset-0 bg-black/85 z-[3200] flex items-center justify-center p-4 crt-overlay">
      <div className="pixel-box-cyan max-w-[720px] w-full p-5 bg-[#090b14] flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b-2 border-[#1c223a] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[22px]">{dungeon.icon}</span>
            <div>
              <div className="text-[13px] text-[#00f5ff] font-bold">
                {dungeon.name.toUpperCase()}
              </div>
              <div className="text-[8px] text-[#757599]">
                PORTLAND LANDMARK: {dungeon.landmarkName.toUpperCase()}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="pixel-btn text-[9px] px-2 py-1 text-[#ff2d55]">
            [X]
          </button>
        </div>

        {/* Real-Time Cell Phone & Demon Incursion Telemetry */}
        <div className="pixel-box p-3 bg-[#0e1222] border-[#ff2d55] flex flex-col gap-2">
          <div className="flex justify-between items-center text-[8px]">
            <span className="text-[#ff2d55] font-bold">📡 REAL-TIME CELLULAR RF TELEMETRY:</span>
            <span className="text-[#30d158] animate-pulse">● LIVE SENSOR FEED</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[8px]">
            <div className="pixel-box p-2 bg-black/60">
              <div className="text-[#757599] text-[7px]">ACTIVE PHONES:</div>
              <div className="text-[#00f5ff] text-[11px] font-bold mt-1">
                {densityInfo ? densityInfo.estimatedPhones.toLocaleString() : '---'}
              </div>
              <div className="text-[6px] text-[#757599]">{densityInfo?.signalType || '5G Network'}</div>
            </div>

            <div className="pixel-box p-2 bg-black/60">
              <div className="text-[#757599] text-[7px]">DEMON SWARM DENSITY:</div>
              <div className="text-[#ff2d55] text-[11px] font-bold mt-1">
                {totalDemons} DEMONS
              </div>
              <div className="text-[6px] text-[#ff9500]">{densityInfo?.threatLevel}</div>
            </div>

            <div className="pixel-box p-2 bg-black/60">
              <div className="text-[#757599] text-[7px]">RECOMMENDED LVL:</div>
              <div className={`text-[11px] font-bold mt-1 ${playerLevel >= dungeon.recommendedLevel ? 'text-[#30d158]' : 'text-[#ff3b30]'}`}>
                LVL {dungeon.recommendedLevel}+
              </div>
              <div className="text-[6px] text-[#757599]">YOU: LVL {playerLevel}</div>
            </div>

            <div className="pixel-box p-2 bg-black/60">
              <div className="text-[#757599] text-[7px]">DIFFICULTY TIER:</div>
              <div className="text-[9px] font-bold mt-1" style={{ color: dungeon.difficultyColor }}>
                {dungeon.difficulty}
              </div>
            </div>
          </div>

          <div className="text-[7px] text-[#757599] leading-tight">
            * Demon population dynamically calculated from real-world mobile traffic in {dungeon.landmarkName}. Peak phone hours increase demon horde spawn counts!
          </div>
        </div>

        {/* Floor & Level Selection */}
        <div className="flex flex-col gap-2">
          <div className="text-[9px] text-white font-bold flex justify-between">
            <span>SELECT DUNGEON FLOOR:</span>
            <span className="text-[#ffd60a]">FLOOR {selectedFloor} / {dungeon.maxFloors}</span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {dungeon.floors.map((f) => (
              <button
                key={f.floor}
                onClick={() => { chiptune.playSelect(); setSelectedFloor(f.floor); }}
                className={`pixel-btn text-[8px] p-2 flex flex-col items-center gap-1 ${
                  selectedFloor === f.floor ? 'border-[#ffd60a] text-[#ffd60a] pixel-box-pink' : ''
                }`}
              >
                <span className="font-bold">F{f.floor}</span>
                <span className="text-[6px] text-[#757599]">
                  {f.isBoss ? '👑 BOSS' : `x${f.enemyCount + Math.floor((densityInfo?.demonCount || 4)/3)}`}
                </span>
              </button>
            ))}
          </div>

          {/* Current Floor Intel */}
          <div className="pixel-box p-3 bg-[#111424] text-[8px] flex flex-col gap-1 mt-1">
            <div className="flex justify-between">
              <span className="text-[#00f5ff] font-bold">{currentFloorData.name.toUpperCase()}</span>
              <span className="text-[#ffd60a]">{currentFloorData.isBoss ? '⚠️ BOSS ENCOUNTER' : 'HORDE CHAMBER'}</span>
            </div>
            <div className="text-[#757599]">
              SPAWNS: {currentFloorData.enemyTypes.join(', ')}
            </div>
            <div className="text-[#30d158] mt-1">
              RELIC DROP CHANCE: <span className="text-white">{dungeon.relicDrop}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex justify-between items-center border-t-2 border-[#1c223a] pt-3">
          <button onClick={onClose} className="pixel-btn text-[9px] px-3 py-2 text-[#757599]">
            ABORT
          </button>

          <button
            onClick={handleLaunchRaid}
            className="pixel-btn text-[10px] px-6 py-2.5 bg-[#ff2d55] text-white border-black font-bold hover:bg-[#ff456e] flex items-center gap-2"
          >
            <span>⚔️ ENTER DUNGEON FLOOR {selectedFloor}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
