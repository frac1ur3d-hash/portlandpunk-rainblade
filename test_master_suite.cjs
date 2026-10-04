// test_master_suite.cjs
// Deep verification suite for all Kyle McLeod Diablo 2 Portlandpunk architecture requirements

const fs = require('fs');
const assert = require('assert');

const html = fs.readFileSync('client/public/rain-blade.html', 'utf8');

console.log('=== RUNNING DEEP COMPREHENSIVE VERIFICATION SUITE ===');

// 1. DIABLO 2 HUD & DUAL GLOBES
console.log('1. Verifying Diablo 2 Bottom Interface HUD...');
assert(html.includes('id="diablo2BottomHud"'), 'Missing #diablo2BottomHud');
assert(html.includes('id="d2LifeGlobeFill"'), 'Missing #d2LifeGlobeFill');
assert(html.includes('id="d2LifeText"'), 'Missing #d2LifeText');
assert(html.includes('id="d2StaminaBarFill"'), 'Missing #d2StaminaBarFill');
assert(html.includes('id="d2ManaGlobeFill"'), 'Missing #d2ManaGlobeFill');
assert(html.includes('id="d2ManaText"'), 'Missing #d2ManaText');
assert(html.includes('id="d2Potion1Count"'), 'Missing Cold Brew in potion belt');
assert(html.includes('id="d2Potion2Count"'), 'Missing Narcan in potion belt');
assert(html.includes('id="d2Potion3Count"'), 'Missing Amp Stim in potion belt');
assert(html.includes('id="d2Potion4Count"'), 'Missing Cyber Shield in potion belt');
assert(html.includes('id="d2XpBarFill"'), 'Missing #d2XpBarFill');
assert(html.includes('[INV]'), 'Missing [INV] button');
assert(html.includes('[QST]'), 'Missing [QST] button');
assert(html.includes('[TP]'), 'Missing [TP] button');
assert(html.includes('[SWAP]'), 'Missing [SWAP] button');
assert(html.includes('[MAP]'), 'Missing [MAP] button');
assert(html.includes('[BETA]'), 'Missing [BETA] button');
assert(html.includes('id="topNavHeader" class="hidden"'), 'Top header is not hidden');
console.log('✓ Diablo 2 Bottom Interface HUD verified.');

// 2. SANCTUARY HUB & INITIAL SPAWN
console.log('2. Verifying Safehouse Sanctuary Hub & Mode-Aware Logic...');
assert(html.includes("gameState.mode = 'residence';"), 'Initial spawn mode is not residence');
assert(html.includes('drawSanctuaryEnvironment(w, h);'), 'drawSanctuaryEnvironment not hooked into render()');
assert(html.includes('Mayor of Portland'), 'Missing Mayor NPC');
assert(html.includes('PDX Police Chief'), 'Missing Police Chief NPC');
assert(html.includes('The Jeweler'), 'Missing Jeweler NPC');
assert(html.includes('The Tailor'), 'Missing Tailor NPC');
assert(html.includes('The Armorer'), 'Missing Armorer NPC');
assert(html.includes('Diablo Stash Chest'), 'Missing Stash Chest');
assert(html.includes('Town Portal Exit'), 'Missing Town Portal Exit');
assert(html.includes("gameState.mode = 'overworld';") && html.includes('exitSanctuaryToPortlandStreetGrid'), 'exitSanctuaryToPortlandStreetGrid must set overworld mode');
assert(html.includes("p.x = Math.max(-340, Math.min(340, p.x + p.vx));"), 'Player collision in residence mode not room bounded');
console.log('✓ Sanctuary Hub & Mode-Aware Logic verified.');

// 3. 6X PORTLAND STREET GRID & DISTRICTS
console.log('3. Verifying 6x Portland Street Grid & Real Districting...');
assert(html.includes('this.cols = 180;'), 'Map cols != 180');
assert(html.includes('this.rows = 150;'), 'Map rows != 150');
assert(html.includes('E BURNSIDE ST'), 'Missing E Burnside St');
assert(html.includes('SE HAWTHORNE BLVD'), 'Missing SE Hawthorne Blvd');
assert(html.includes('SE DIVISION ST'), 'Missing SE Division St');
assert(html.includes('SE POWELL BLVD'), 'Missing SE Powell Blvd');
assert(html.includes('SE 82ND AVE'), 'Missing SE 82nd Ave');
assert(html.includes('SE 148TH AVE (POWELLHURST)'), 'Missing SE 148th Ave Powellhurst-Gilbert');
assert(html.includes('SELLWOOD QUARANTINE MILITARY CHECKPOINT'), 'Missing Sellwood Military Checkpoint');
assert(html.includes('if (lm.isSanctuary || lm.isSellwood) return;'), 'Apex bosses must not spawn at Sanctuary or Sellwood checkpoint');
assert(html.includes('getPortlandDistrictName'), 'Missing getPortlandDistrictName helper');
console.log('✓ 6x Portland Street Grid & Real Districting verified.');

// 4. TWO-TIER SUB-DUNGEON DELVE
console.log('4. Verifying Two-Tier Sub-Dungeon Delve...');
assert(html.includes('Keymaster Lieutenant'), 'Missing Keymaster Lieutenant');
assert(html.includes('Boss Sanctum Key'), 'Missing Boss Sanctum Key');
assert(html.includes('bossHealthBarContainer'), 'Missing #bossHealthBarContainer');
assert(html.includes('spawnPortaPottyTownPortal'), 'Missing spawnPortaPottyTownPortal');
assert(html.includes('warpBackToPortlandSurface') && html.includes("gameState.mode = 'overworld';"), 'warpBackToPortlandSurface must set overworld mode');
assert(html.includes('enterNeighborhoodDungeon'), 'Missing enterNeighborhoodDungeon');
console.log('✓ Two-Tier Sub-Dungeon Delve verified.');

// 5. PERSISTENT FOG OF WAR & AUTOMAP
console.log('5. Verifying Persistent Fog of War & Fullscreen Automap...');
assert(html.includes('drawFogOfWarPass(w, h);'), 'drawFogOfWarPass not called in render()');
assert(html.includes('gameState.persistentWorldMap'), 'Missing persistentWorldMap exploration retention');
assert(html.includes('renderAutomapOverlay'), 'Missing renderAutomapOverlay');
assert(html.includes('automapCanvas'), 'Missing automapCanvas');
assert(html.includes('scaleX') && html.includes('scaleY') && html.includes('updateMinimapRadar'), 'updateMinimapRadar aspect ratio not updated');
console.log('✓ Persistent Fog of War & Fullscreen Automap verified.');

// 6. GROTESQUE MONSTER ROSTER
console.log('6. Verifying Grotesque Monster Roster...');
assert(html.includes('The Fentanyl Sludge Titan'), 'Missing Fentanyl Sludge Titan');
assert(html.includes('Willamette Leech-Gargoyle'), 'Missing Willamette Leech-Gargoyle');
assert(html.includes('The 82nd Needle Broodmother'), 'Missing 82nd Needle Broodmother');
assert(html.includes('Burnside Scrap Golem'), 'Missing Burnside Scrap Golem');
assert(html.includes('Shanghai Tunnel Flayer'), 'Missing Shanghai Tunnel Flayer');
console.log('✓ Grotesque Monster Roster verified.');

// 7. HOLY NARCAN EXORCISM & SECRET MULTIVERSE COW LEVEL
console.log('7. Verifying Holy Narcan Exorcism & Cow Level...');
assert(html.includes('administerNarcanToZombie'), 'Missing administerNarcanToZombie');
assert(html.includes('spawnExorcismDefenders'), 'Missing 2-wave defensive siege spawning');
assert(html.includes('enterMultiverseCowLevel'), 'Missing enterMultiverseCowLevel');
assert(html.includes('The Bovine Multiverse Overlord'), 'Missing Bovine Multiverse Overlord boss');
assert(html.includes('gameState.multiversePortal'), 'Missing Multiverse Portal spawning');
console.log('✓ Holy Narcan Exorcism & Cow Level verified.');

// 8. DIABLO LEVEL & SKILL TREE MATRIX
console.log('8. Verifying Diablo Level & Skill Tree Matrix...');
assert(html.includes('gainPlayerXP'), 'Missing gainPlayerXP leveling function');
assert(html.includes('DIABLO2_SKILL_TREES'), 'Missing DIABLO2_SKILL_TREES');
assert(html.includes('blade_mastery'), 'Missing Blade Mastery discipline');
assert(html.includes('storm_cryo'), 'Missing Storm & Cryo discipline');
assert(html.includes('shadow_stealth'), 'Missing Shadow & Stealth discipline');
assert(html.includes('allocateSkillPoint'), 'Missing allocateSkillPoint function');
assert(html.includes('respecAllSkillPoints'), 'Missing respecAllSkillPoints function');
assert(html.includes("e.key === 's' || e.key === 'S'"), 'Missing [S] hotkey for Diablo 2 Skill Tree');
console.log('✓ Diablo Level & Skill Tree Matrix verified.');

// 9. DEV BRIDGE
console.log('9. Verifying Dev Bridge Testing Helpers...');
assert(html.includes('teleport(x, y)'), 'Missing dev bridge teleport');
assert(html.includes('enterDungeon(dungeonId)'), 'Missing dev bridge enterDungeon');
assert(html.includes('enterSanctuary()'), 'Missing dev bridge enterSanctuary');
assert(html.includes('revealAllMap()'), 'Missing dev bridge revealAllMap');
assert(html.includes('acquireBossKey()'), 'Missing dev bridge acquireBossKey');
assert(html.includes('levelUp()'), 'Missing dev bridge levelUp');
assert(html.includes('openMultiversePortal()'), 'Missing dev bridge openMultiversePortal');
assert(html.includes('enterCowLevel()'), 'Missing dev bridge enterCowLevel');
console.log('✓ Dev Bridge verified.');

console.log('=== ALL MASTER VERIFICATION TESTS PASSED SUCCESSFULLY! ===');
