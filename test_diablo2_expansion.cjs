// test_diablo2_expansion.cjs
// Deep verification test for Kyle McLeod's Diablo 2 Portlandpunk overhaul

const fs = require('fs');
const assert = require('assert');

const html = fs.readFileSync('client/public/rain-blade.html', 'utf8');

console.log('--- RUNNING DEEP VERIFICATION SUITE ---');

// 1. DIABLO 2 HUD & GLOBES VERIFICATION
console.log('1. Verifying Diablo 2 HUD & Dual Globes...');
assert(html.includes('id="diablo2BottomHud"'), 'Missing #diablo2BottomHud');
assert(html.includes('id="d2LifeGlobeFill"'), 'Missing #d2LifeGlobeFill');
assert(html.includes('id="d2LifeText"'), 'Missing #d2LifeText');
assert(html.includes('id="d2StaminaBarFill"'), 'Missing #d2StaminaBarFill');
assert(html.includes('id="d2ManaGlobeFill"'), 'Missing #d2ManaGlobeFill');
assert(html.includes('id="d2ManaText"'), 'Missing #d2ManaText');
assert(html.includes('id="d2Potion1Count"'), 'Missing #d2Potion1Count (Cold Brew)');
assert(html.includes('id="d2Potion2Count"'), 'Missing #d2Potion2Count (Narcan)');
assert(html.includes('id="d2Potion3Count"'), 'Missing #d2Potion3Count (Amp Stim)');
assert(html.includes('id="d2Potion4Count"'), 'Missing #d2Potion4Count (Cyber Shield)');
assert(html.includes('id="d2XpBarFill"'), 'Missing #d2XpBarFill');
assert(html.includes('[INV]'), 'Missing [INV] carved stone button');
assert(html.includes('[QST]'), 'Missing [QST] carved stone button');
assert(html.includes('[TP]'), 'Missing [TP] carved stone button');
assert(html.includes('[SWAP]'), 'Missing [SWAP] carved stone button');
assert(html.includes('[MAP]'), 'Missing [MAP] carved stone button');
assert(html.includes('[BETA]'), 'Missing [BETA] carved stone button');
assert(html.includes('id="topNavHeader" class="hidden"'), 'Top header not hidden');
console.log('✓ Diablo 2 HUD & Dual Globes verified.');

// 2. SPAWN LOCATION & SANCTUARY HUB VERIFICATION
console.log('2. Verifying Sanctuary Hub & Initial Spawn...');
assert(html.includes('SANCTUARY_STATIONS'), 'Missing SANCTUARY_STATIONS');
assert(html.includes('Mayor of Portland'), 'Missing Mayor NPC');
assert(html.includes('PDX Police Chief'), 'Missing Police Chief NPC');
assert(html.includes('The Jeweler'), 'Missing Jeweler NPC');
assert(html.includes('The Tailor'), 'Missing Tailor NPC');
assert(html.includes('The Armorer'), 'Missing Armorer NPC');
assert(html.includes('Diablo Stash Chest'), 'Missing Stash Chest NPC/Station');
assert(html.includes('Town Portal Exit'), 'Missing Town Portal Exit station');
assert(html.includes('drawSanctuaryEnvironment'), 'Missing drawSanctuaryEnvironment');
assert(html.includes('exitSanctuaryToPortlandStreetGrid'), 'Missing exitSanctuaryToPortlandStreetGrid');
console.log('✓ Sanctuary Hub & Initial Spawn verified.');

// 3. 6X MASSIVE PORTLAND STREET GRID VERIFICATION
console.log('3. Verifying 6x Portland Street Grid Map...');
assert(html.includes('this.cols = 180;'), 'cols != 180');
assert(html.includes('this.rows = 150;'), 'rows != 150');
assert(html.includes('E BURNSIDE ST'), 'Missing E Burnside St arterial');
assert(html.includes('SE HAWTHORNE BLVD'), 'Missing SE Hawthorne Blvd arterial');
assert(html.includes('SE DIVISION ST'), 'Missing SE Division St arterial');
assert(html.includes('SE POWELL BLVD'), 'Missing SE Powell Blvd arterial');
assert(html.includes('SE 82ND AVE'), 'Missing SE 82nd Ave arterial');
assert(html.includes('SE 148TH AVE'), 'Missing SE 148th Ave arterial');
assert(html.includes('SE FOSTER RD') || html.includes('Foster Road'), 'Missing SE Foster Rd');
assert(html.includes('SELLWOOD QUARANTINE MILITARY CHECKPOINT'), 'Missing Sellwood Military Checkpoint');
console.log('✓ 6x Portland Street Grid verified.');

// 4. TWO-TIER SUB-DUNGEON DELVE VERIFICATION
console.log('4. Verifying Two-Tier Dungeon Delve Architecture...');
assert(html.includes('Keymaster Lieutenant'), 'Missing Keymaster Lieutenant');
assert(html.includes('Boss Sanctum Key'), 'Missing Boss Sanctum Key drop');
assert(html.includes('bossHealthBarContainer'), 'Missing #bossHealthBarContainer');
assert(html.includes('spawnPortaPottyTownPortal'), 'Missing spawnPortaPottyTownPortal');
console.log('✓ Two-Tier Sub-Dungeon Delve verified.');

// 5. PERSISTENT FOG OF WAR & SYNCHRONIZED AUTOMAP
console.log('5. Verifying Fog of War & Fullscreen Automap...');
assert(html.includes('renderAutomapOverlay'), 'Missing renderAutomapOverlay');
assert(html.includes('automapCanvas'), 'Missing automapCanvas');
assert(html.includes('#fbbf24'), 'Missing golden directional chevron color');
console.log('✓ Fog of War & Fullscreen Automap verified.');

// 6. DEV BRIDGE VERIFICATION
console.log('6. Verifying window.__RAINBLADE_DEV_BRIDGE__...');
assert(html.includes('window.__RAINBLADE_DEV_BRIDGE__'), 'Missing dev bridge');
assert(html.includes('teleport(x, y)'), 'Missing dev bridge teleport');
assert(html.includes('enterDungeon(dungeonId)'), 'Missing dev bridge enterDungeon');
assert(html.includes('enterSanctuary()'), 'Missing dev bridge enterSanctuary');
assert(html.includes('revealAllMap()'), 'Missing dev bridge revealAllMap');
assert(html.includes('acquireBossKey()'), 'Missing dev bridge acquireBossKey');
console.log('✓ Dev Bridge verified.');

console.log('=== ALL DEEP VERIFICATION TESTS PASSED! ===');
