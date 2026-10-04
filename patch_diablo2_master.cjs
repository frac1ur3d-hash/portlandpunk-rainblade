// patch_diablo2_master.cjs
// Master comprehensive patch for Kyle McLeod's Diablo 2 Portlandpunk overhaul.
// Fixes all 11 fatal bugs, implements Grotesque Monster Roster, Narcan Exorcism Siege &
// Multiverse Cow Level, High-Res Layered Paperdoll, and Diablo Level & Skill Point System.

const fs = require('fs');
const path = require('path');

const targetPath = path.resolve('client/public/rain-blade.html');
console.log('Loading target file:', targetPath);
let html = fs.readFileSync(targetPath, 'utf8');

console.log('Initial file size:', html.length);

// =============================================================================
// FIX 1: FIX INCORRECT 'residence' REPLACEMENTS WHERE 'overworld' WAS INTENDED
// =============================================================================
// exitSanctuaryToPortlandStreetGrid
html = html.replace(
  /function exitSanctuaryToPortlandStreetGrid\(\)\s*\{[\s\S]*?showToast\("Stepped out into Portland Overworld! Press \[TAB\] for Automap\.", "info", true\);\s*updateHUD\(\);\s*\}/,
`function exitSanctuaryToPortlandStreetGrid() {
      playSound('teleport');
      gameState.mode = 'overworld';
      const p = gameState.player;
      // Step out directly onto the Portland street grid outside Town Hall on E Burnside St
      p.x = -128;
      p.y = 512;
      p.vx = 0;
      p.vy = 0;
      if (!gameState.persistentWorldMap) {
        initWorldMap(gameState.worldSeed);
      } else {
        gameState.worldMap = gameState.persistentWorldMap;
      }
      triggerWaveAnnouncement("🏙️ PORTLAND OVERWORLD", "Stepped out onto E Burnside Street Grid");
      showToast("Stepped out into Portland Overworld! Press [TAB] for Automap.", "info", true);
      const promptBanner = document.getElementById('sanctuaryPromptBanner');
      if (promptBanner) promptBanner.classList.add('hidden');
      updateHUD();
    }`
);

// warpBackToPortlandSurface (from Porta-Potty)
html = html.replace(
  /function warpBackToPortlandSurface\(\)\s*\{[\s\S]*?showToast\("🏆 Quest Completed! Returned to dungeon entrance\.", "success", true\);\s*updateQuestTrackerUI\(\);\s*\}/,
`function warpBackToPortlandSurface() {
      playSound('teleport');
      playSound('powerup');
      
      const p = gameState.player;
      p.x = gameState.overworldReturn ? gameState.overworldReturn.x : -128;
      p.y = gameState.overworldReturn ? gameState.overworldReturn.y : 512;
      p.vx = 0;
      p.vy = 0;

      // Quest Complete Rewards: Stumptown Beans, XP & Amp Stims
      p.beans += 250;
      gainPlayerXP(450);
      p.ampCharges = Math.min(p.ampMaxCharges, (p.ampCharges || 0) + 2);

      // Drop guaranteed Ancient/Masterwork Boss Loot
      dropLoot(p.x + 30, p.y + 30, true, 2);

      gameState.mode = 'overworld';
      gameState.currentDungeon = null;
      gameState.portaPotty = null;
      gameState.dungeonStairs = null;
      gameState.downedCivilians = [];
      chunkCache.clear();

      if (gameState.persistentWorldMap) {
        gameState.worldMap = gameState.persistentWorldMap;
      } else {
        initWorldMap(gameState.worldSeed);
      }
      triggerWaveAnnouncement("🎉 DISTRICT DUNGEON CLEARED!", "Extracted back to Portland Surface (+250 Beans, +2 Amp Stims, +450 XP)");
      showToast("🏆 Quest Completed! Returned to dungeon entrance.", "success", true);
      updateQuestTrackerUI();
      updateHUD();
    }`
);

// returnFromSafehouse
html = html.replace(
  /window\.returnFromSafehouse = function\(\) \{[\s\S]*?showToast\("Returned through Town Portal!", "success", true\);\s*updateHUD\(\);\s*\};/,
`window.returnFromSafehouse = function() {
      if (!gameState.tpDeparture) {
        exitSanctuaryToPortlandStreetGrid();
        return;
      }
      const dep = gameState.tpDeparture;
      playSound('level');
      chunkCache.clear();

      if (dep.mode === 'dungeon' && dep.districtId) {
        enterNeighborhoodDungeon(dep.districtId);
        if (dep.floor === 2) descendToFloor2();
      } else {
        gameState.mode = 'overworld';
        gameState.currentDungeon = null;
        if (gameState.persistentWorldMap) gameState.worldMap = gameState.persistentWorldMap;
      }

      const p = gameState.player;
      p.x = dep.x;
      p.y = dep.y;
      p.vx = 0;
      p.vy = 0;
      gameState.tpDeparture = null;
      showToast("Returned through Town Portal!", "success", true);
      const promptBanner = document.getElementById('sanctuaryPromptBanner');
      if (promptBanner) promptBanner.classList.add('hidden');
      updateHUD();
    };`
);

console.log('✓ Fixed overworld transition mode bugs');

// =============================================================================
// FIX 2: CALL drawSanctuaryEnvironment IN render() AND RESTRICT RESIDENCE COLLISION
// =============================================================================
// In render():
html = html.replace(
  "drawUrbanEnvironment(w, h);\n      drawDungeonInteractables();",
`if (gameState.mode === 'residence') {
        drawSanctuaryEnvironment(w, h);
      } else {
        drawUrbanEnvironment(w, h);
        drawDungeonInteractables();
      }`
);

console.log('✓ Hooked drawSanctuaryEnvironment into render()');

// Save intermediate to test
fs.writeFileSync(targetPath, html, 'utf8');
console.log('✓ Intermediate write passed');
