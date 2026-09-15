import React from 'react';
import usePlayerStore from '../../store/playerStore.js';
import { LOOT_RARITY_COLORS, LOOT_RARITY_NAMES } from '@shared/constants.js';
import chiptune from '../../audio/chiptune.js';

export default function Inventory({ onClose }) {
  const inventory = usePlayerStore((s) => s.inventory);
  const equippedItems = usePlayerStore((s) => s.equippedItems);
  const equipItem = usePlayerStore((s) => s.equipItem);
  const stats = usePlayerStore((s) => s.stats);

  const handleEquip = (item) => {
    chiptune.playSelect();
    equipItem(item.type, item);
  };

  // Calculate total stats
  const totalStats = { ...stats };
  Object.values(equippedItems).forEach((item) => {
    if (item?.stats) {
      Object.keys(item.stats).forEach((k) => {
        totalStats[k] = (totalStats[k] || 0) + item.stats[k];
      });
    }
  });

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 crt-overlay">
      <div className="pixel-box-cyan max-w-[700px] w-full p-5 bg-[#0b0c16] flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b-2 border-[#1e1e32] pb-3">
          <div className="text-[12px] text-[#00f5ff] font-bold">
            CYBER-GEAR & LOOT INVENTORY
          </div>
          <button
            onClick={onClose}
            className="pixel-btn text-[9px] px-2 py-1 text-[#ff2d55] border-[#ff2d55]"
          >
            CLOSE [X]
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Equipped Slots & Stats */}
          <div className="flex flex-col gap-3">
            <div className="text-[10px] text-white font-bold">EQUIPPED SLOTS</div>
            <div className="grid grid-cols-2 gap-2 text-[8px]">
              {['weapon', 'armor', 'accessory', 'relic'].map((slot) => {
                const item = equippedItems[slot];
                return (
                  <div
                    key={slot}
                    className="pixel-box p-2 bg-[#121422] min-h-[60px] flex flex-col justify-between"
                  >
                    <div className="text-[#757599] uppercase text-[7px]">{slot}</div>
                    {item ? (
                      <div>
                        <div style={{ color: LOOT_RARITY_COLORS[item.rarity] || '#fff' }}>
                          {item.name}
                        </div>
                        <div className="text-[#00f5ff] text-[7px] mt-0.5">
                          {item.stats?.attack ? `+${item.stats.attack} ATK ` : ''}
                          {item.stats?.defense ? `+${item.stats.defense} DEF ` : ''}
                        </div>
                      </div>
                    ) : (
                      <div className="text-[#404060]">EMPTY</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Total Combat Stats */}
            <div className="pixel-box p-3 bg-[#121422] text-[9px] flex flex-col gap-1 mt-1">
              <div className="text-[#ffd60a] font-bold mb-1">TOTAL COMBAT STATS</div>
              <div className="flex justify-between text-[#ff2d55]">
                <span>ATTACK:</span> <span>{totalStats.attack || 10}</span>
              </div>
              <div className="flex justify-between text-[#0a84ff]">
                <span>DEFENSE:</span> <span>{totalStats.defense || 5}</span>
              </div>
              <div className="flex justify-between text-[#30d158]">
                <span>SPEED:</span> <span>{totalStats.speed || 5}</span>
              </div>
              <div className="flex justify-between text-[#00f5ff]">
                <span>INTEL:</span> <span>{totalStats.intel || 5}</span>
              </div>
              <div className="flex justify-between text-[#ffd60a]">
                <span>LUCK:</span> <span>{totalStats.luck || 5}</span>
              </div>
            </div>
          </div>

          {/* Bag Inventory Grid */}
          <div className="flex flex-col gap-2">
            <div className="text-[10px] text-white font-bold">
              INVENTORY ITEMS ({inventory.length})
            </div>
            <div className="pixel-box p-2 bg-[#121422] h-[240px] overflow-y-auto flex flex-col gap-2">
              {inventory.length === 0 ? (
                <div className="text-[#757599] text-[8px] text-center mt-10">
                  NO ITEMS COLLECTED YET.<br />
                  FIGHT ENEMIES IN PORTLAND TO EARN LOOT!
                </div>
              ) : (
                inventory.map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className="pixel-box p-2 bg-[#17192b] flex items-center justify-between text-[8px]"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span style={{ color: LOOT_RARITY_COLORS[item.rarity] || '#fff' }} className="font-bold">
                        {item.name}
                      </span>
                      <span className="text-[#757599] text-[7px]">
                        {LOOT_RARITY_NAMES[item.rarity]} // {item.type?.toUpperCase()}
                      </span>
                    </div>

                    <button
                      onClick={() => handleEquip(item)}
                      className="pixel-btn text-[8px] px-2 py-1"
                    >
                      EQUIP
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
