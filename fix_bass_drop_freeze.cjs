const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'client', 'public', 'rain-blade.html');
let code = fs.readFileSync(targetPath, 'utf8');

// 1. Define playDubstepBassDrop with rich Web Audio sub-bass drop synthesis
const bassDropImplementation = `
    // =========================================================================
    // DUBSTEP BASS DROP & PROCEDURAL IMPACT SYNTHESIS
    // =========================================================================
    function playDubstepBassDrop(intensity = 10, isParry = false) {
      try {
        if (!gameState.audioEnabled) return;
        const ctx = getAudioContext();
        if (!ctx || ctx.state !== 'running') return;

        const now = ctx.currentTime;
        const startFreq = isParry ? 220 : Math.min(240, 65 + (intensity * 4));
        const endFreq = isParry ? 32 : 28;
        const duration = isParry ? 0.35 : Math.min(0.55, 0.22 + (intensity * 0.015));

        // Sub-bass Oscillator (Sine / Overdriven Triangle)
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        const subFilter = ctx.createBiquadFilter();

        subOsc.type = isParry ? 'square' : 'triangle';
        subOsc.frequency.setValueAtTime(startFreq, now);
        subOsc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

        subFilter.type = 'lowpass';
        subFilter.frequency.setValueAtTime(isParry ? 1800 : 800, now);
        subFilter.frequency.exponentialRampToValueAtTime(120, now + duration);

        const gainVal = Math.min(0.85, 0.35 + (intensity * 0.025));
        subGain.gain.setValueAtTime(gainVal, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        subOsc.connect(subFilter);
        subFilter.connect(subGain);
        if (synthSfxMasterGain) subGain.connect(synthSfxMasterGain);
        else subGain.connect(ctx.destination);

        subOsc.start(now);
        subOsc.stop(now + duration + 0.05);

        // Screen Bass Shockwave Pulse & Trauma
        gameState.bassPulse = Math.min(1.0, (gameState.bassPulse || 0) + (isParry ? 0.45 : 0.28));
        addCameraTrauma(isParry ? 0.35 : Math.min(0.6, intensity * 0.02));
      } catch (err) {
        console.warn('playDubstepBassDrop handled gracefully:', err);
      }
    }
`;

// Inject playDubstepBassDrop right after playSound
code = code.replace(/function playSound\(type, extra = \{\}\) \{[\s\S]*?\n    \}/, match => match + '\n\n' + bassDropImplementation);

// 2. Wrap triggerSkill in try...catch
code = code.replace(/function triggerSkill\(slot\) \{([\s\S]*?)\n    \}/, (match, body) => {
  return `function triggerSkill(slot) {
      try {${body}
      } catch (err) {
        console.error('Error in triggerSkill:', err);
        try { showToast('Skill activation error recovered', 'warning'); } catch(e) {}
      }
    }`;
});

// 3. Clear or safely guard telemetry error recording
code = code.replace(/window\.addEventListener\('error', \(e\) => \{[\s\S]*?\}\);/, `window.addEventListener('error', (e) => {
      try {
        console.error('[RainBlade Runtime Guard]', e.message, e.filename, e.lineno);
        localStorage.setItem('rainblade_live_telemetry_error', JSON.stringify({
          msg: e.message,
          file: e.filename,
          line: e.lineno,
          time: new Date().toISOString()
        }));
      } catch(ignore) {}
    });`);

fs.writeFileSync(targetPath, code, 'utf8');
console.log('Successfully fixed playDubstepBassDrop and hardened triggerSkill! New size:', code.length);
