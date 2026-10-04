const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'client', 'public', 'rain-blade.html');
let code = fs.readFileSync(targetPath, 'utf8');
console.log('Original rain-blade.html size:', code.length);

// 1. Standalone Zero-Dependency Web Audio Synthesizer Engine
const audioEngineCode = `
    // =========================================================================
    // PORTLAND CYBERPUNK NATIVE WEB AUDIO SYNTHESIZER ENGINE (Zero Dependencies)
    // =========================================================================
    let audioCtx = null;
    let synthMusicMasterGain = null;
    let synthSfxMasterGain = null;
    let isMusicPlaying = false;
    let musicInterval = null;
    let musicStep = 0;

    function getAudioContext() {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          audioCtx = new AudioContextClass();
          synthMusicMasterGain = audioCtx.createGain();
          synthMusicMasterGain.gain.setValueAtTime(0.35, audioCtx.currentTime);
          synthMusicMasterGain.connect(audioCtx.destination);

          synthSfxMasterGain = audioCtx.createGain();
          synthSfxMasterGain.gain.setValueAtTime(0.60, audioCtx.currentTime);
          synthSfxMasterGain.connect(audioCtx.destination);
        }
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
      return audioCtx;
    }

    function initAudio() {
      if (audioInitialized) return;
      audioInitialized = true;
      getAudioContext();
      if (gameState.audioEnabled) {
        startSynthwaveMusic();
      }
    }

    // Dynamic Procedural Dark Synthwave Music Loop
    function startSynthwaveMusic() {
      if (isMusicPlaying || !audioCtx) return;
      isMusicPlaying = true;

      // Dark Synthwave Bass & Arp Scale (D Minor: D, F, G, A, C)
      const bassNotes = [73.42, 73.42, 87.31, 73.42, 65.41, 73.42, 98.00, 87.31]; // D2, D2, F2, D2, C2, D2, G2, F2
      const arpNotes = [293.66, 349.23, 440.00, 523.25, 440.00, 349.23, 392.00, 440.00, 587.33, 523.25, 440.00, 349.23, 392.00, 349.23, 293.66, 261.63];

      musicInterval = setInterval(() => {
        if (!gameState.audioEnabled || !audioCtx || audioCtx.state !== 'running') return;
        const now = audioCtx.currentTime;
        const inCombat = (gameState.enemies && gameState.enemies.length > 0 && gameState.mode === 'dungeon') || (gameState.player && gameState.player.inCombat);
        
        // 1. Kick & Snare Beat
        if (musicStep % 4 === 0) {
          // Cyber Kick
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(140, now);
          osc.frequency.exponentialRampToValueAtTime(32, now + 0.12);
          gain.gain.setValueAtTime(0.45, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.connect(gain);
          gain.connect(synthMusicMasterGain);
          osc.start(now);
          osc.stop(now + 0.16);
        } else if (musicStep % 4 === 2) {
          // Cyber Snare / Clap Noise
          const bufferSize = audioCtx.sampleRate * 0.08;
          const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
          const noise = audioCtx.createBufferSource();
          noise.buffer = buffer;
          const filter = audioCtx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.value = 1800;
          const gain = audioCtx.createGain();
          gain.gain.setValueAtTime(inCombat ? 0.28 : 0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          noise.connect(filter);
          filter.connect(gain);
          gain.connect(synthMusicMasterGain);
          noise.start(now);
        }

        // 2. Pulsating 16th-note Synth Bassline
        const bassFreq = bassNotes[Math.floor(musicStep / 2) % bassNotes.length];
        const bassOsc = audioCtx.createOscillator();
        const bassFilter = audioCtx.createBiquadFilter();
        const bassGain = audioCtx.createGain();
        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(bassFreq, now);
        bassFilter.type = 'lowpass';
        bassFilter.frequency.setValueAtTime(inCombat ? 900 : 480, now);
        bassFilter.frequency.exponentialRampToValueAtTime(160, now + 0.11);
        bassGain.gain.setValueAtTime(inCombat ? 0.22 : 0.14, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        bassOsc.connect(bassFilter);
        bassFilter.connect(bassGain);
        bassGain.connect(synthMusicMasterGain);
        bassOsc.start(now);
        bassOsc.stop(now + 0.13);

        // 3. Arp Lead in Combat
        if (inCombat && musicStep % 2 === 0) {
          const arpFreq = arpNotes[musicStep % arpNotes.length];
          const arpOsc = audioCtx.createOscillator();
          const arpGain = audioCtx.createGain();
          arpOsc.type = 'triangle';
          arpOsc.frequency.setValueAtTime(arpFreq, now);
          arpGain.gain.setValueAtTime(0.10, now);
          arpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          arpOsc.connect(arpGain);
          arpGain.connect(synthMusicMasterGain);
          arpOsc.start(now);
          arpOsc.stop(now + 0.19);
        }

        musicStep = (musicStep + 1) % 32;
      }, 130); // ~115 BPM 16th notes
    }

    // High-Impact Procedural Sound FX
    const lastSoundTimes = {};
    function playSound(type, extra = {}) {
      if (!gameState.audioEnabled) return;
      const ctx = getAudioContext();
      if (!ctx || ctx.state !== 'running') return;

      const nowMs = performance.now();
      if (lastSoundTimes[type] && (nowMs - lastSoundTimes[type] < 35)) return;
      lastSoundTimes[type] = nowMs;

      const now = ctx.currentTime;
      try {
        if (type === 'slash') {
          // Swept-frequency blade whoosh
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(650, now);
          osc.frequency.exponentialRampToValueAtTime(140, now + 0.10);
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1200, now);
          filter.frequency.exponentialRampToValueAtTime(300, now + 0.10);
          gain.gain.setValueAtTime(0.40, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(synthSfxMasterGain);
          osc.start(now);
          osc.stop(now + 0.12);
        } else if (type === 'crit' || type === 'crunch') {
          // Heavy Sub-bass Drop + Saturated Crunch
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(160, now);
          osc.frequency.exponentialRampToValueAtTime(35, now + 0.22);
          gain.gain.setValueAtTime(0.65, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
          osc.connect(gain);
          gain.connect(synthSfxMasterGain);
          osc.start(now);
          osc.stop(now + 0.25);
        } else if (type === 'parry') {
          // Metallic Bell FM Resonance
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          osc1.type = 'triangle';
          osc1.frequency.setValueAtTime(1046.50, now); // C6
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(1479.98, now); // F#6
          gain.gain.setValueAtTime(0.50, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(synthSfxMasterGain);
          osc1.start(now); osc2.start(now);
          osc1.stop(now + 0.36); osc2.stop(now + 0.36);
        } else if (type === 'dodge' || type === 'roll') {
          // Filtered Cyber-Dash Air Whoosh
          const bufferSize = ctx.sampleRate * 0.14;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(2400, now);
          filter.frequency.exponentialRampToValueAtTime(200, now + 0.14);
          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
          noise.connect(filter);
          filter.connect(gain);
          gain.connect(synthSfxMasterGain);
          noise.start(now);
        } else if (type === 'hit') {
          // Punchy Flesh / Armor Impact
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.exponentialRampToValueAtTime(45, now + 0.09);
          gain.gain.setValueAtTime(0.40, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.10);
          osc.connect(gain);
          gain.connect(synthSfxMasterGain);
          osc.start(now);
          osc.stop(now + 0.11);
        } else if (type === 'loot' || type === 'coin') {
          // Tiered Sparkling Ascending Arpeggio
          const tier = extra.rarity || 'common';
          const freqs = tier === 'legendary' ? [523.25, 659.25, 783.99, 1046.50, 1318.51] : [440, 554.37, 659.25];
          freqs.forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + idx * 0.04);
            gain.gain.setValueAtTime(0.22, now + idx * 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.16);
            osc.connect(gain);
            gain.connect(synthSfxMasterGain);
            osc.start(now + idx * 0.04);
            osc.stop(now + idx * 0.04 + 0.17);
          });
        } else if (type === 'level') {
          // Triumphal Cyberpunk Fanfare
          const chords = [293.66, 369.99, 440.00, 587.33]; // D Major
          chords.forEach(f => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, now);
            gain.gain.setValueAtTime(0.28, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
            osc.connect(gain);
            gain.connect(synthSfxMasterGain);
            osc.start(now);
            osc.stop(now + 0.66);
          });
        } else if (type === 'boss_roar') {
          // Deep Distorted Mutant Roar
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(90, now);
          osc.frequency.linearRampToValueAtTime(140, now + 0.15);
          osc.frequency.exponentialRampToValueAtTime(30, now + 0.45);
          gain.gain.setValueAtTime(0.70, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.50);
          osc.connect(gain);
          gain.connect(synthSfxMasterGain);
          osc.start(now);
          osc.stop(now + 0.52);
        } else if (type === 'omnislash_slash') {
          // Supersonic Neon Laser-Blade Strike
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(1400, now);
          osc.frequency.exponentialRampToValueAtTime(220, now + 0.07);
          gain.gain.setValueAtTime(0.48, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.connect(gain);
          gain.connect(synthSfxMasterGain);
          osc.start(now);
          osc.stop(now + 0.09);
        } else if (type === 'omnislash_boom') {
          // Massive Thunderous Sub-Bass Explosion
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.exponentialRampToValueAtTime(24, now + 0.60);
          gain.gain.setValueAtTime(0.85, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
          osc.connect(gain);
          gain.connect(synthSfxMasterGain);
          osc.start(now);
          osc.stop(now + 0.66);
        } else if (type === 'revive') {
          // Healing Chime
          [523.25, 659.25, 783.99, 1046.50].forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + idx * 0.06);
            gain.gain.setValueAtTime(0.30, now + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);
            osc.connect(gain);
            gain.connect(synthSfxMasterGain);
            osc.start(now + idx * 0.06);
            osc.stop(now + idx * 0.06 + 0.26);
          });
        }
      } catch (e) {}
    }
`;

// 2. Hitstop & Camera Trauma Juice Systems
const gameFeelSystemsCode = `
    // =========================================================================
    // GAME FEEL: HIT-STOP (FREEZE FRAME) & DECAYING TRAUMA CAMERA SHAKE
    // =========================================================================
    gameState.hitstopTimer = 0;
    gameState.timeScale = 1.0;
    gameState.cameraTrauma = 0;
    gameState.ultimateCharge = 0; // 0 to 100
    gameState.maxUltimateCharge = 100;
    gameState.isOmnislashing = false;
    gameState.omnislashTargets = [];
    gameState.omnislashStep = 0;
    gameState.omnislashTimer = 0;
    gameState.groundDecals = []; // Blood & hydraulic fluid splatter decals

    function triggerHitStop(durationMs, timeScale = 0.0) {
      gameState.hitstopTimer = Math.max(gameState.hitstopTimer, durationMs / 1000);
    }

    function addCameraTrauma(amount) {
      gameState.cameraTrauma = Math.min(1.0, (gameState.cameraTrauma || 0) + amount);
      gameState.screenShake = Math.max(gameState.screenShake, amount * 18);
    }

    function addGroundSplatter(x, y, color = '#22c55e', count = 5) {
      if (!gameState.groundDecals) gameState.groundDecals = [];
      for (let i = 0; i < count; i++) {
        gameState.groundDecals.push({
          x: x + (Math.random() - 0.5) * 32,
          y: y + (Math.random() - 0.5) * 32,
          radius: Math.random() * 5 + 2,
          color: color,
          alpha: 0.75,
          life: 25.0 // lasts 25s, slowly washes under rain
        });
      }
      if (gameState.groundDecals.length > 250) {
        gameState.groundDecals.splice(0, gameState.groundDecals.length - 250);
      }
    }

    function drawGroundDecals() {
      if (!gameState.groundDecals || gameState.groundDecals.length === 0) return;
      ctx.save();
      for (let i = gameState.groundDecals.length - 1; i >= 0; i--) {
        const d = gameState.groundDecals[i];
        ctx.fillStyle = d.color;
        ctx.globalAlpha = Math.max(0, d.alpha * (d.life / 25.0));
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // =========================================================================
    // [F] RAINSTORM OMNISLASH ULTIMATE AWAKENING ABILITY
    // =========================================================================
    function triggerOmnislash() {
      const p = gameState.player;
      if (gameState.ultimateCharge < 100 || gameState.isOmnislashing || p.hp <= 0) {
        if (gameState.ultimateCharge < 100) showToast('⚡ Ultimate Charging: ' + Math.floor(gameState.ultimateCharge) + '%', 'amber');
        return;
      }

      // Find all nearby hostile enemies within 380px range
      const nearby = (gameState.enemies || []).filter(e => e.hp > 0 && Math.hypot(e.x - p.x, e.y - p.y) < 420);
      if (nearby.length === 0) {
        showToast('⚠️ No hostile targets in Omnislash range!', 'rose');
        return;
      }

      gameState.ultimateCharge = 0;
      updateUltimateHUD();
      gameState.isOmnislashing = true;
      gameState.omnislashTargets = nearby.sort(() => Math.random() - 0.5).slice(0, 8);
      gameState.omnislashStep = 0;
      gameState.omnislashTimer = 0.06;
      gameState.timeScale = 0.20; // Matrix time dilation

      p.isInvulnerable = true;
      p.invulnTimer = 1.8;

      triggerHitStop(60);
      addCameraTrauma(0.5);
      playSound('omnislash_slash');
      showToast('⚡ RAINSTORM OMNISLASH UNLEASHED! ⚡', 'cyan');
    }

    function updateOmnislash(dt) {
      if (!gameState.isOmnislashing) return;
      gameState.omnislashTimer -= dt;

      if (gameState.omnislashTimer <= 0) {
        const p = gameState.player;
        if (gameState.omnislashStep < gameState.omnislashTargets.length) {
          const target = gameState.omnislashTargets[gameState.omnislashStep];
          if (target && target.hp > 0) {
            // Blink hero to target
            const oldX = p.x;
            const oldY = p.y;
            p.x = target.x + (Math.random() - 0.5) * 20;
            p.y = target.y + (Math.random() - 0.5) * 20;

            // Deal massive critical slash damage
            const dmg = (p.baseAttack + (gameState.equipped.weapon ? gameState.equipped.weapon.damage : 30)) * 3.5;
            target.hp -= dmg;
            target.hitFlash = 0.35;
            target.squashX = 1.4;
            target.squashY = 0.6;

            // Spawn neon slash trace
            if (!gameState.slashes) gameState.slashes = [];
            gameState.slashes.push({
              startX: oldX, startY: oldY,
              endX: p.x, endY: p.y,
              color: gameState.omnislashStep % 2 === 0 ? '#38bdf8' : '#f43f5e',
              life: 0.35, maxLife: 0.35,
              width: 5
            });

            // Splatter & FX
            addGroundSplatter(target.x, target.y, target.isBoss ? '#f43f5e' : '#22c55e', 8);
            spawnParticleBurst(target.x, target.y, '#38bdf8', 16, 8, 220);
            showFloatingText('-' + Math.round(dmg) + ' CRIT!', target.x, target.y - 30, '#38bdf8', 22);

            triggerHitStop(40);
            addCameraTrauma(0.25);
            playSound('omnislash_slash');
          }
          gameState.omnislashStep++;
          gameState.omnislashTimer = 0.08;
        } else {
          // Final Thunder Detonation Shockwave
          gameState.isOmnislashing = false;
          gameState.timeScale = 1.0;

          // Detonate AoE on all remaining nearby enemies
          (gameState.enemies || []).forEach(e => {
            if (e.hp > 0 && Math.hypot(e.x - p.x, e.y - p.y) < 220) {
              const aoeDmg = (p.baseAttack + 50) * 2.0;
              e.hp -= aoeDmg;
              e.hitFlash = 0.4;
              const angle = Math.atan2(e.y - p.y, e.x - p.x);
              e.x += Math.cos(angle) * 60;
              e.y += Math.sin(angle) * 60;
            }
          });

          spawnParticleBurst(p.x, p.y, '#06b6d4', 40, 10, 320);
          spawnParticleBurst(p.x, p.y, '#f59e0b', 30, 8, 280);
          addCameraTrauma(0.85);
          triggerHitStop(120);
          playSound('omnislash_boom');
        }
      }
    }

    function addUltimateCharge(amount) {
      gameState.ultimateCharge = Math.min(gameState.maxUltimateCharge, (gameState.ultimateCharge || 0) + amount);
      updateUltimateHUD();
    }

    function updateUltimateHUD() {
      const fillEl = document.getElementById('ultimateFill');
      const textEl = document.getElementById('ultimateText');
      const orbEl = document.getElementById('ultimateOrb');
      if (fillEl) fillEl.style.width = gameState.ultimateCharge + '%';
      if (textEl) textEl.textContent = Math.floor(gameState.ultimateCharge) + '%';
      if (orbEl) {
        if (gameState.ultimateCharge >= 100) {
          orbEl.classList.add('animate-pulse', 'border-amber-400', 'shadow-[0_0_20px_rgba(245,158,11,0.8)]');
          orbEl.classList.remove('opacity-50');
        } else {
          orbEl.classList.remove('animate-pulse', 'border-amber-400', 'shadow-[0_0_20px_rgba(245,158,11,0.8)]');
          orbEl.classList.add('opacity-50');
        }
      }
    }
`;

// Inject audio and game feel systems
code = code.replace(/function initAudio\(\) \{[\s\S]*?function toggleAudioMute\(\)/, audioEngineCode + '\n    ' + gameFeelSystemsCode + '\n    function toggleAudioMute()');

console.log('Injected Web Audio Synth Engine & Omnislash Systems!');

// 3. Upgrade renderStaticTileToChunk with Lifelike Wet Pavement & Puddles
const lifelikeChunkTileRenderer = `
    function renderStaticTileToChunk(cctx, tile, tx, ty, ts, c, r) {
      switch (tile) {
        case 0: // Lifelike Cyberpunk Wet Asphalt Plaza
          // Base Asphalt with grain texture
          cctx.fillStyle = '#0a0e17';
          cctx.fillRect(tx, ty, ts, ts);
          
          // Asphalt micro-grain & aggregate noise
          cctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
          for (let gi = 0; gi < 6; gi++) {
            cctx.fillRect(tx + ((c * 17 + gi * 23) % (ts - 4)), ty + ((r * 13 + gi * 29) % (ts - 4)), 2, 2);
          }

          // Subtle Asphalt Expansion Joints & Fissures
          cctx.strokeStyle = 'rgba(30, 41, 59, 0.35)';
          cctx.lineWidth = 1;
          cctx.strokeRect(tx, ty, ts, ts);

          // Lifelike Wet Rain Puddles with Specular Light Rim & Iridescent Oil Slicks
          if ((c * 3 + r * 7) % 7 === 0) {
            cctx.save();
            // Puddle Dark Water Depression
            cctx.fillStyle = '#040711';
            cctx.beginPath();
            cctx.ellipse(tx + ts * 0.5, ty + ts * 0.5, ts * 0.42, ts * 0.26, 0.15, 0, Math.PI * 2);
            cctx.fill();

            // Specular Cyan Wet Sheen
            const puddleGrad = cctx.createRadialGradient(tx + ts * 0.45, ty + ts * 0.45, 2, tx + ts * 0.5, ty + ts * 0.5, ts * 0.42);
            puddleGrad.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
            puddleGrad.addColorStop(0.6, 'rgba(168, 85, 247, 0.12)');
            puddleGrad.addColorStop(1, 'rgba(6, 182, 212, 0.0)');
            cctx.fillStyle = puddleGrad;
            cctx.beginPath();
            cctx.ellipse(tx + ts * 0.5, ty + ts * 0.5, ts * 0.42, ts * 0.26, 0.15, 0, Math.PI * 2);
            cctx.fill();

            // Puddle Water Ring Ripple Edge
            cctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
            cctx.lineWidth = 1.2;
            cctx.stroke();
            cctx.restore();
          }
          break;

        case 1: // Roadway Arterial with Weathered Stenciled Markings
          cctx.fillStyle = '#070a12';
          cctx.fillRect(tx, ty, ts, ts);
          
          // Road Tarmac Grain
          cctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
          cctx.fillRect(tx + 2, ty + 2, ts - 4, ts - 4);

          // Double Yellow Centerline or Weathered White Dash
          if (r % 4 === 0) {
            // Weathered White Lane Dash
            cctx.fillStyle = 'rgba(241, 245, 249, 0.65)';
            cctx.fillRect(tx + ts * 0.46, ty + ts * 0.15, ts * 0.08, ts * 0.70);
          } else if (c % 4 === 0) {
            // Double Yellow Arterial Stripes
            cctx.fillStyle = 'rgba(234, 179, 8, 0.70)';
            cctx.fillRect(tx + ts * 0.15, ty + ts * 0.42, ts * 0.70, 2);
            cctx.fillRect(tx + ts * 0.15, ty + ts * 0.54, ts * 0.70, 2);
          }

          // Road Puddle with Neon Reflection
          if ((c + r) % 5 === 0) {
            cctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
            cctx.beginPath();
            cctx.ellipse(tx + ts * 0.6, ty + ts * 0.4, ts * 0.35, ts * 0.20, -0.2, 0, Math.PI * 2);
            cctx.fill();
          }
          break;
`;

code = code.replace(/function renderStaticTileToChunk\(cctx, tile, tx, ty, ts, c, r\) \{[\s\S]*?case 0:[\s\S]*?break;[\s\S]*?case 1:[\s\S]*?break;/, lifelikeChunkTileRenderer);
console.log('Injected Lifelike Cyberpunk Wet Asphalt & Puddle Shaders!');

// 4. Update Game Loop to process HitStop, Camera Trauma, and Omnislash
const gameLoopUpgrade = `
        const now = timestamp || performance.now();
        let dt = Math.min((now - (gameState.lastTimestamp || now)) / 1000, 0.1);
        gameState.lastTimestamp = now;

        // Hit-Stop Freeze Frame processing
        if (gameState.hitstopTimer > 0) {
          gameState.hitstopTimer -= dt;
          if (gameState.hitstopTimer > 0) {
            render();
            requestAnimationFrame(gameLoop);
            return;
          }
        }

        // Time Dilation
        if (gameState.timeScale && gameState.timeScale !== 1.0) {
          dt *= gameState.timeScale;
        }

        // Camera Trauma Decay
        if (gameState.cameraTrauma > 0) {
          gameState.cameraTrauma = Math.max(0, gameState.cameraTrauma - dt * 1.6);
        }

        // Omnislash Ability Loop
        if (gameState.isOmnislashing) {
          updateOmnislash(dt);
        }
`;

code = code.replace(/const now = timestamp \|\| performance\.now\(\);[\s\S]*?const dt = Math\.min\(\(now - \(gameState\.lastTimestamp \|\| now\)\) \/ 1000, 0\.1\);[\s\S]*?gameState\.lastTimestamp = now;/, gameLoopUpgrade);

// 5. Update Camera Shake in render() to use smooth quadratic trauma model
const smoothTraumaShake = `
      let shakeX = 0;
      let shakeY = 0;
      let shakeRoll = 0;
      const trauma = gameState.cameraTrauma || 0;
      if (trauma > 0 || gameState.screenShake > 0) {
        const totalTrauma = Math.max(trauma, (gameState.screenShake || 0) / 18);
        const shake = totalTrauma * totalTrauma; // Quadratic punch
        const shakeTime = performance.now() * 0.035;
        shakeX = 18 * shake * Math.sin(shakeTime * 1.7);
        shakeY = 18 * shake * Math.sin(shakeTime * 2.3);
        shakeRoll = 0.035 * shake * Math.sin(shakeTime * 1.1);
        if (gameState.screenShake > 0) gameState.screenShake = Math.max(0, gameState.screenShake - 0.5);
      }

      ctx.translate(-gameState.camera.x + shakeX, -gameState.camera.y + shakeY);
      if (shakeRoll !== 0) {
        ctx.translate(gameState.camera.x + w / 2, gameState.camera.y + h / 2);
        ctx.rotate(shakeRoll);
        ctx.translate(-(gameState.camera.x + w / 2), -(gameState.camera.y + h / 2));
      }
`;

code = code.replace(/let shakeX = 0;[\s\S]*?ctx\.translate\(-gameState\.camera\.x \+ shakeX, -gameState\.camera\.y \+ shakeY\);/, smoothTraumaShake);

// 6. Add Ground Decals and Forward Visor Torchlight to render()
code = code.replace(/drawGroundHazards\(\);/, 'drawGroundDecals();\n      drawGroundHazards();');

// 7. Add [F] Hotkey listener for Omnislash and Audio Auto-Unlock
const hotkeyInjection = `
      if (e.key === 'f' || e.key === 'F') {
        triggerOmnislash();
      }
`;
code = code.replace(/if \(e\.key === 'e' \|\| e\.key === 'E'\) \{/, hotkeyInjection + '\n      if (e.key === \'e\' || e.key === \'E\') {');

// 8. Auto-unlock Web Audio on first user interaction anywhere
const audioUnlockCode = `
    ['click', 'keydown', 'touchstart', 'pointerdown'].forEach(evtType => {
      window.addEventListener(evtType, () => {
        if (!audioInitialized) initAudio();
        getAudioContext();
      }, { once: false });
    });
`;
code = code.replace(/window\.addEventListener\('DOMContentLoaded', \(\) => \{/, audioUnlockCode + '\n    window.addEventListener(\'DOMContentLoaded\', () => {');

// 9. Add Ultimate Orb & Mobile [ULT ⚡] Touch Button to HUD
const ultimateHUDElement = `
      <!-- Diablo 2 / Cyber Ultimate Awakening Orb [F] -->
      <div id="ultimateOrb" onclick="triggerOmnislash()" class="relative group cursor-pointer w-14 h-14 rounded-full bg-slate-950/90 border-2 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.4)] flex flex-col items-center justify-center transition-all active:scale-95" title="Press [F] or Tap to Unleash Rainstorm Omnislash">
        <div id="ultimateFillRing" class="absolute inset-0 rounded-full border-2 border-amber-400 opacity-80" style="clip-path: circle(50%);"></div>
        <span class="text-xl select-none">⚡</span>
        <span id="ultimateText" class="text-[9px] font-black text-cyan-300 font-mono">0%</span>
        <span class="absolute -bottom-2 px-1.5 py-0.2 bg-black/80 border border-cyan-500/40 rounded text-[8px] font-mono text-cyan-400 font-bold">[F]</span>
      </div>
`;

// Insert next to potion belt in Diablo HUD
if (code.includes('id="potionBelt"')) {
  code = code.replace(/<div id="potionBelt"[\s\S]*?<\/div>/, match => match + '\n' + ultimateHUDElement);
}

// Add Mobile Touch Button [ULT] in mobile action cluster
const mobileUltTouchButton = `
          <button id="btnUltTouch" onclick="triggerOmnislash()" class="w-12 h-12 rounded-2xl bg-gradient-to-t from-cyan-950/60 to-cyan-800/40 backdrop-blur-xs border border-cyan-400/40 text-cyan-300 font-bold flex flex-col items-center justify-center active:scale-90 shadow-md">
            <span class="text-base">⚡</span>
            <span class="text-[8px]">ULT</span>
          </button>
`;
code = code.replace(/<button id="btnDodgeTouch"/, mobileUltTouchButton + '\n          <button id="btnDodgeTouch"');

// 10. Update triggerAttack and enemy combat hits to add Ultimate Charge, HitStop, and Crunch
const hitJuiceUpgrade = `
      p.isAttacking = true;
      p.attackTimer = 0.20;
      p.attackComboStep = (p.attackComboStep + 1) % 3;
      p.totalSlashes++;
      document.getElementById('statTotalSlashes').textContent = p.totalSlashes;
      addUltimateCharge(3); // Charge ultimate on swing

      playSound('slash');
`;
code = code.replace(/p\.isAttacking = true;[\s\S]*?playSound\('slash'\);/, hitJuiceUpgrade);

fs.writeFileSync(targetPath, code, 'utf8');
console.log('Successfully upgraded rain-blade.html! New size:', code.length);
