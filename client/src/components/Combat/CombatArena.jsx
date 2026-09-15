import React, { useEffect, useRef, useState, useCallback } from 'react';
import usePlayerStore from '../../store/playerStore.js';
import useCombatStore from '../../store/combatStore.js';
import { SPRITES, ANIMATED_SPRITES, drawPixelSprite } from '../../graphics/pixelSprites.js';
import chiptune from '../../audio/chiptune.js';
import { SKILLS } from '@shared/skills.js';
import { generateLootDrop, generateDungeonLoot } from '@shared/items.js';

export default function CombatArena() {
  const canvasRef = useRef(null);
  const player = usePlayerStore((s) => s.character) || { classId: 0, characterName: 'Player', level: 1 };
  const currentZone = usePlayerStore((s) => s.currentZone) || { id: 0, name: 'The Pearl', tier: 'high' };
  const playerHp = usePlayerStore((s) => s.hp);
  const maxHp = usePlayerStore((s) => s.maxHp);
  const playerMp = usePlayerStore((s) => s.mp);
  const maxMp = usePlayerStore((s) => s.maxMp);
  const playerLevel = usePlayerStore((s) => s.level);
  const takeDamage = usePlayerStore((s) => s.takeDamage);
  const spendMp = usePlayerStore((s) => s.spendMp);
  const gainXp = usePlayerStore((s) => s.gainXp);
  const addToInventory = usePlayerStore((s) => s.addToInventory);
  const addPunk = usePlayerStore((s) => s.addPunk);
  const punkBalance = usePlayerStore((s) => s.punkBalance);
  const stats = usePlayerStore((s) => s.stats);
  const equippedItems = usePlayerStore((s) => s.equippedItems);

  const enemy = useCombatStore((s) => s.enemy);
  const phase = useCombatStore((s) => s.phase);
  const enemyHp = useCombatStore((s) => s.enemyHp);
  const enemyMaxHp = useCombatStore((s) => s.enemyMaxHp);
  const damageEnemy = useCombatStore((s) => s.damageEnemy);
  const endCombat = useCombatStore((s) => s.endCombat);
  const setLoot = useCombatStore((s) => s.setLoot);
  const loot = useCombatStore((s) => s.loot);
  const punkEarned = useCombatStore((s) => s.punkEarned);

  // Combat Dashboard Tactical Telemetry
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [cooldowns, setCooldowns] = useState({});
  const [combatLog, setCombatLog] = useState([
    "TACTICAL COMBAT ENGAGED",
    `ENEMY DETECTED: ${enemy?.name?.toUpperCase() || 'DEMON'}`,
    "PRESS SPACE TO STRIKE // 1-4 FOR SKILLS"
  ]);
  const [comboCount, setComboCount] = useState(0);
  const [totalDamageDealt, setTotalDamageDealt] = useState(0);
  const [battleTimer, setBattleTimer] = useState(0);

  // Class mapping to sprite name
  const classNames = ['samurai', 'netrunner', 'infiltrator', 'shaman'];
  const playerSpriteName = classNames[player.classId] || 'samurai';

  // Enemy sprite selection
  const enemySprite = enemy?.tier === 'boss' ? SPRITES.boss_specter :
    enemy?.name?.toLowerCase().includes('drone') ? SPRITES.drone : SPRITES.street_rat;

  // Arena state in refs for game loop
  const gameState = useRef({
    playerPos: { x: 140, y: 220, vx: 0, vy: 0, facingLeft: false, isAttacking: false, attackTimer: 0 },
    enemyPos: { x: 440, y: 220, vx: 0, vy: 0, facingLeft: true, flashTimer: 0, attackTimer: 0 },
    particles: [],
    keys: {},
    screenShake: 0,
  });

  const appendCombatLog = (msg) => {
    setCombatLog((prev) => [msg, ...prev.slice(0, 5)]);
  };

  const addFloatingText = useCallback((text, x, y, color = '#ff2d55') => {
    const id = Date.now() + Math.random();
    setFloatingTexts((prev) => [...prev, { id, text, x, y, color }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 800);
  }, []);

  // Battle duration timer
  useEffect(() => {
    if (phase !== 'combat') return;
    const interval = setInterval(() => {
      setBattleTimer((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      gameState.current.keys[e.key.toLowerCase()] = true;
      if (e.code === 'Space') {
        e.preventDefault();
        performBasicAttack();
      }
      if (['1', '2', '3', '4'].includes(e.key)) {
        const skillIdx = parseInt(e.key) - 1;
        triggerSkill(skillIdx);
      }
    };

    const handleKeyUp = (e) => {
      gameState.current.keys[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Basic Attack (Slash / Blast)
  const performBasicAttack = () => {
    if (phase !== 'combat' || gameState.current.playerPos.isAttacking) return;
    gameState.current.playerPos.isAttacking = true;
    gameState.current.playerPos.attackTimer = 12;

    chiptune.playLaserSlash();

    const p = gameState.current.playerPos;
    const e = gameState.current.enemyPos;

    // Check hit distance
    const dist = Math.hypot(e.x - p.x, e.y - p.y);
    if (dist < 120) {
      const isCrit = Math.random() < 0.28;
      const baseDmg = 22 + (stats.attack || 12) + Math.floor(Math.random() * 12);
      const dmg = isCrit ? baseDmg * 2 : baseDmg;

      damageEnemy(dmg);
      e.flashTimer = 8;
      gameState.current.screenShake = 6;
      chiptune.playHit();

      setComboCount((c) => c + 1);
      setTotalDamageDealt((d) => d + dmg);
      appendCombatLog(`HIT! Dealt ${dmg} damage ${isCrit ? '[CRITICAL!]' : ''}`);

      // Particles
      for (let i = 0; i < 8; i++) {
        gameState.current.particles.push({
          x: e.x + 24, y: e.y + 24,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          life: 20, color: isCrit ? '#ffd60a' : '#ff2d55'
        });
      }

      addFloatingText(isCrit ? `CRIT! -${dmg}` : `-${dmg}`, e.x, e.y - 10, isCrit ? '#ffd60a' : '#ff2d55');
    }
  };

  // Trigger Class Skill
  const triggerSkill = (idx) => {
    const classKey = classNames[player.classId] || 'samurai';
    const classSkills = SKILLS[classKey] || [];
    const skill = classSkills[idx];
    if (!skill || cooldowns[skill.id] > 0 || playerMp < skill.mpCost) return;

    spendMp(skill.mpCost);
    setCooldowns((prev) => ({ ...prev, [skill.id]: skill.cooldown }));

    const timer = setInterval(() => {
      setCooldowns((prev) => {
        const next = (prev[skill.id] || 0) - 1;
        if (next <= 0) {
          clearInterval(timer);
          const { [skill.id]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [skill.id]: next };
      });
    }, 1000);

    const e = gameState.current.enemyPos;
    const p = gameState.current.playerPos;

    if (skill.damage > 0) {
      const dmg = Math.floor(38 * skill.damage) + (stats.intel || 6);
      damageEnemy(dmg);
      e.flashTimer = 14;
      gameState.current.screenShake = 10;
      chiptune.playExplosion();
      setComboCount((c) => c + 1);
      setTotalDamageDealt((d) => d + dmg);
      appendCombatLog(`SKILL: [${skill.name.toUpperCase()}] hit for ${dmg} DMG!`);
      addFloatingText(`${skill.name.toUpperCase()}! -${dmg}`, e.x, e.y - 20, '#00f5ff');
    } else if (skill.damage < 0) {
      chiptune.playLevelUp();
      appendCombatLog(`HEAL: [${skill.name.toUpperCase()}] restored 35 HP!`);
      addFloatingText(`HEAL +35`, p.x, p.y - 20, '#30d158');
    } else {
      chiptune.playSelect();
      appendCombatLog(`BUFF: [${skill.name.toUpperCase()}] shield activated!`);
      addFloatingText(`${skill.name.toUpperCase()}!`, p.x, p.y - 20, '#bf5af2');
    }
  };

  // Handle victory loot
  useEffect(() => {
    if (phase === 'victory' && loot.length === 0) {
      chiptune.playExplosion();
      setTimeout(() => chiptune.playCoin(), 300);

      let droppedItem;
      if (enemy?.dungeonId) {
        droppedItem = generateDungeonLoot(enemy.dungeonId, enemy.floor || 1, enemy.isBoss || false);
      } else {
        droppedItem = generateLootDrop(currentZone.id, currentZone.tier);
      }

      const generatedLoot = [droppedItem];
      const punkReward = enemy?.punkReward || 15;

      setLoot(generatedLoot, punkReward);
      generatedLoot.forEach((item) => addToInventory(item));
      addPunk(punkReward);
      gainXp(enemy?.xpReward || 60);
      appendCombatLog(`VICTORY! +${punkReward} $PUNK CREDITS EARNED!`);
      if (droppedItem) {
        appendCombatLog(`LOOT FOUND: [${droppedItem.name.toUpperCase()}]!`);
      }
    }
  }, [phase]);

  // Main 60 FPS Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    let animId;

    const render = () => {
      const p = gameState.current.playerPos;
      const k = gameState.current.keys;
      const speed = 4;

      if (k['w'] || k['arrowup']) p.y = Math.max(50, p.y - speed);
      if (k['s'] || k['arrowdown']) p.y = Math.min(320, p.y + speed);
      if (k['a'] || k['arrowleft']) { p.x = Math.max(30, p.x - speed); p.facingLeft = true; }
      if (k['d'] || k['arrowright']) { p.x = Math.min(540, p.x + speed); p.facingLeft = false; }

      if (p.attackTimer > 0) p.attackTimer--;
      else p.isAttacking = false;

      // Enemy AI
      const e = gameState.current.enemyPos;
      if (phase === 'combat') {
        const dx = p.x - e.x;
        const dy = p.y - e.y;
        const dist = Math.hypot(dx, dy);

        e.facingLeft = dx < 0;

        if (dist > 65) {
          e.x += (dx / dist) * (enemy?.speed || 1.2);
          e.y += (dy / dist) * (enemy?.speed || 1.2);
        } else {
          e.attackTimer++;
          if (e.attackTimer > 60) {
            e.attackTimer = 0;
            const enemyDmg = Math.max(4, (enemy?.damage || 14) - Math.floor((stats.defense || 6) * 0.4));
            takeDamage(enemyDmg);
            chiptune.playHit();
            gameState.current.screenShake = 8;
            appendCombatLog(`WARNING: ${enemy?.name || 'Demon'} hits you for ${enemyDmg}!`);
            addFloatingText(`-${enemyDmg}`, p.x, p.y - 10, '#ff3b30');
          }
        }
      }

      if (e.flashTimer > 0) e.flashTimer--;

      if (gameState.current.screenShake > 0) {
        gameState.current.screenShake *= 0.85;
        if (gameState.current.screenShake < 0.5) gameState.current.screenShake = 0;
      }

      // Draw Arena Background
      ctx.save();
      const shakeX = (Math.random() - 0.5) * gameState.current.screenShake;
      const shakeY = (Math.random() - 0.5) * gameState.current.screenShake;
      ctx.translate(shakeX, shakeY);

      ctx.fillStyle = '#06070d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Floor Grid
      ctx.strokeStyle = '#12162a';
      ctx.lineWidth = 2;
      for (let x = 0; x < canvas.width; x += 32) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 32) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Boundary Glow
      ctx.strokeStyle = currentZone.color || '#00f5ff';
      ctx.lineWidth = 3;
      ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);

      // Particles
      gameState.current.particles = gameState.current.particles.filter((pt) => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life--;
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, 4, 4);
        return pt.life > 0;
      });

      // Draw Animated Player Sprite
      const classAnims = ANIMATED_SPRITES[playerSpriteName] || ANIMATED_SPRITES.samurai;
      const animTick = Math.floor(Date.now() / 150);
      let activeFrame;

      if (p.isAttacking) {
        const attackFrames = classAnims.attack || classAnims.idle;
        activeFrame = attackFrames[Math.floor(animTick % attackFrames.length)];
      } else if (k['w'] || k['s'] || k['a'] || k['d'] || k['arrowup'] || k['arrowdown'] || k['arrowleft'] || k['arrowright']) {
        const walkFrames = classAnims.walk || classAnims.idle;
        activeFrame = walkFrames[Math.floor(animTick % walkFrames.length)];
      } else {
        const idleFrames = classAnims.idle;
        activeFrame = idleFrames[Math.floor(animTick % idleFrames.length)];
      }

      drawPixelSprite(
        ctx,
        activeFrame,
        p.x,
        p.y,
        3,
        p.facingLeft,
        p.isAttacking ? '#00f5ff' : null
      );

      // Slash arc
      if (p.isAttacking) {
        ctx.fillStyle = '#00f5ff';
        const slashX = p.facingLeft ? p.x - 20 : p.x + 48;
        ctx.fillRect(slashX, p.y + 12, 16, 24);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(slashX + (p.facingLeft ? 4 : -4), p.y + 16, 8, 16);
      }

      // Enemy Sprite
      if (enemyHp > 0) {
        drawPixelSprite(
          ctx,
          enemySprite,
          e.x,
          e.y,
          3,
          e.facingLeft,
          e.flashTimer > 0 ? '#ffffff' : null
        );

        // Enemy Health Bar
        const barWidth = 48;
        const barX = e.x;
        const barY = e.y - 12;
        ctx.fillStyle = '#000';
        ctx.fillRect(barX - 2, barY - 2, barWidth + 4, 8);
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, 4);
        ctx.fillStyle = '#ff2d55';
        ctx.fillRect(barX, barY, Math.max(0, (enemyHp / enemyMaxHp) * barWidth), 4);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [phase, enemy, enemyHp, currentZone, stats]);

  return (
    <div className="fixed inset-0 bg-black/92 z-[2500] flex items-center justify-center p-3 crt-overlay crt-vignette overflow-y-auto">
      {/* ── BATTLE COMMAND CONSOLE & DASHBOARD ── */}
      <div className="max-w-[940px] w-full flex flex-col gap-2">
        {/* Top Tactical Dashboard Bar */}
        <div className="pixel-box-pink p-2.5 flex flex-wrap justify-between items-center text-[9px] bg-[#0c0d18]">
          <div className="flex items-center gap-3">
            <span className="text-[#ff2d55] font-bold text-[11px]">⚔️ BATTLE DASHBOARD</span>
            <span className="text-[#00f5ff]">ZONE: {currentZone?.name?.toUpperCase() || 'PORTLAND SECTOR'}</span>
            <span className="text-[#ffd60a]">TIME: {battleTimer}s</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white">COMBO: <strong className="text-[#ffd60a]">{comboCount}x</strong></span>
            <span className="text-white">TOTAL DMG: <strong className="text-[#ff2d55]">{totalDamageDealt}</strong></span>
            <button
              onClick={endCombat}
              className="pixel-btn text-[8px] px-2 py-1 border-[#ff2d55] text-[#ff2d55]"
            >
              FLEE [ESC]
            </button>
          </div>
        </div>

        {/* Middle Area: Arena + Tactical Telemetry Sidebars */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {/* Left Tactical Panel: Hero Telemetry */}
          <div className="pixel-box p-3 bg-[#0d0f1c] flex flex-col gap-3 text-[8px]">
            <div className="text-[#00f5ff] font-bold border-b border-[#1c223a] pb-1">
              HERO TELEMETRY
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-white">
                <span>HEALTH</span>
                <span>{playerHp}/{maxHp}</span>
              </div>
              <div className="bar-track-8bit w-full">
                <div
                  className="bar-fill-8bit bg-[#ff3b30]"
                  style={{ width: `${(playerHp / maxHp) * 100}%` }}
                />
              </div>

              <div className="flex justify-between text-white mt-1">
                <span>ENERGY (MP)</span>
                <span>{playerMp}/{maxMp}</span>
              </div>
              <div className="bar-track-8bit w-full">
                <div
                  className="bar-fill-8bit bg-[#0a84ff]"
                  style={{ width: `${(playerMp / maxMp) * 100}%` }}
                />
              </div>
            </div>

            {/* Combat Attributes */}
            <div className="pixel-box p-2 bg-black/50 flex flex-col gap-1 text-[7px] text-[#c0c0e0]">
              <div className="text-[#ffd60a] font-bold mb-0.5">ACTIVE STATS:</div>
              <div className="flex justify-between">
                <span>ATTACK:</span> <span className="text-[#ff2d55]">+{stats.attack || 12}</span>
              </div>
              <div className="flex justify-between">
                <span>DEFENSE:</span> <span className="text-[#0a84ff]">+{stats.defense || 6}</span>
              </div>
              <div className="flex justify-between">
                <span>SPEED:</span> <span className="text-[#30d158]">+{stats.speed || 6}</span>
              </div>
              <div className="flex justify-between">
                <span>INTEL:</span> <span className="text-[#00f5ff]">+{stats.intel || 6}</span>
              </div>
            </div>

            {/* Equipped Weapon Badge */}
            <div className="pixel-box p-2 bg-[#121422] text-[7px]">
              <div className="text-[#757599]">WEAPON:</div>
              <div className="text-white font-bold truncate">
                {equippedItems.weapon ? equippedItems.weapon.name : 'Standard Vibro-Katana'}
              </div>
            </div>
          </div>

          {/* Center: Canvas Hack & Slash Arena */}
          <div className="md:col-span-2 relative pixel-box bg-black h-[360px] overflow-hidden">
            <canvas
              ref={canvasRef}
              width={580}
              height={360}
              onClick={performBasicAttack}
              className="w-full h-full block cursor-crosshair"
            />

            {/* Floating Damage Text */}
            {floatingTexts.map((item) => (
              <div
                key={item.id}
                className="floating-damage"
                style={{ left: item.x, top: item.y, color: item.color }}
              >
                {item.text}
              </div>
            ))}

            <div className="absolute bottom-2 left-3 text-[7px] text-[#757599] pointer-events-none">
              WASD: MOVE // SPACE: ATTACK // 1-4: CAST SKILLS
            </div>
          </div>

          {/* Right Tactical Panel: Demon Intel & Live Combat Log */}
          <div className="pixel-box p-3 bg-[#0d0f1c] flex flex-col gap-2.5 text-[8px]">
            <div className="text-[#ff2d55] font-bold border-b border-[#1c223a] pb-1">
              DEMON TARGET INTEL
            </div>

            {/* Target Status */}
            <div className="pixel-box p-2 bg-black/50 flex flex-col gap-1">
              <div className="flex justify-between font-bold text-white">
                <span className="text-[#ffd60a]">{enemy?.name?.toUpperCase()}</span>
                <span className="text-[7px] text-[#ff2d55]">[{enemy?.tier?.toUpperCase() || 'DEMON'}]</span>
              </div>
              <div className="text-[7px] text-[#757599]">HP: {enemyHp} / {enemyMaxHp}</div>
              <div className="bar-track-8bit w-full">
                <div
                  className="bar-fill-8bit bg-[#ff2d55]"
                  style={{ width: `${Math.max(0, (enemyHp / enemyMaxHp) * 100)}%` }}
                />
              </div>
            </div>

            {/* Real-time Combat Log Console */}
            <div className="text-[#ffd60a] text-[7px] font-bold">TACTICAL COMBAT LOG:</div>
            <div className="pixel-box p-2 bg-black/80 flex-1 min-h-[120px] flex flex-col gap-1 overflow-hidden font-mono text-[7px]">
              {combatLog.map((log, idx) => (
                <div key={idx} className="text-[#30d158] truncate">
                  &gt; {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Skill Hotbar */}
        <div className="pixel-box p-2 bg-[#0c0d18] flex flex-wrap gap-2 justify-center items-center">
          {(SKILLS[classNames[player.classId]] || []).map((skill, idx) => {
            const cd = cooldowns[skill.id] || 0;
            return (
              <button
                key={skill.id}
                onClick={() => triggerSkill(idx)}
                disabled={cd > 0 || playerMp < skill.mpCost}
                className="pixel-btn flex flex-col items-center justify-center w-[125px] h-[48px] p-1 text-[8px]"
              >
                <div className="flex items-center gap-1">
                  <span className="text-white">[{idx + 1}]</span>
                  <span className="text-[#00f5ff] font-bold">{skill.name}</span>
                </div>
                <div className="text-[#757599] text-[7px]">
                  {cd > 0 ? `${cd}s RECHARGE` : `${skill.mpCost} MP`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Victory / Loot Drop Modal */}
      {phase === 'victory' && (
        <div className="absolute inset-0 bg-black/85 flex items-center justify-center z-50">
          <div className="pixel-box-pink p-6 max-w-[460px] w-full text-center flex flex-col items-center gap-4">
            <div className="text-[16px] text-[#30d158] font-bold">
              VICTORY!
            </div>
            <div className="text-[10px] text-white">
              {enemy?.name} PURGED FROM PORTLAND
            </div>

            {/* Rewards */}
            <div className="pixel-box p-3 w-full flex justify-around text-[10px]">
              <div>
                <div className="text-[#ffd60a] font-bold">+{punkEarned} $PUNK</div>
                <div className="text-[8px] text-[#757599]">CREDITS</div>
              </div>
              <div>
                <div className="text-[#30d158] font-bold">+{enemy?.xpReward || 60} XP</div>
                <div className="text-[8px] text-[#757599]">EXPERIENCE</div>
              </div>
            </div>

            {/* Loot Item Card */}
            {loot.map((item) => (
              <div key={item.id} className="pixel-box p-3 w-full text-left flex flex-col gap-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-[#ff9500] font-bold">{item.name}</span>
                  <span className="text-[8px] text-[#757599] uppercase">{item.type}</span>
                </div>
                <div className="text-[8px] text-[#e0e0ff]">{item.description}</div>
                <div className="text-[8px] text-[#00f5ff] mt-1">
                  ATK: +{item.stats?.attack || 0} // DEF: +{item.stats?.defense || 0} // SPD: +{item.stats?.speed || 0}
                </div>

                <div className="text-[8px] text-[#30d158] font-bold mt-2 text-center border border-[#30d158] p-1">
                  ✓ ADDED TO GEAR INVENTORY
                </div>
              </div>
            ))}

            <button
              onClick={endCombat}
              className="pixel-btn text-[11px] px-6 py-2 bg-[#00f5ff] text-black border-black font-bold"
            >
              RETURN TO PORTLAND MAP
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
