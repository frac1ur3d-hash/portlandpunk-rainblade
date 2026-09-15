const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying PortlandPunk contracts with:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

  // ── 1. PunkToken ──────────────────────────────────────────────────────────
  const PunkToken = await ethers.getContractFactory("PunkToken");
  const punkToken = await PunkToken.deploy();
  await punkToken.waitForDeployment();
  console.log("✅ PunkToken deployed:", await punkToken.getAddress());

  // ── 2. GearNFT ───────────────────────────────────────────────────────────
  const GearNFT = await ethers.getContractFactory("GearNFT");
  const gearNFT = await GearNFT.deploy();
  await gearNFT.waitForDeployment();
  console.log("✅ GearNFT deployed:", await gearNFT.getAddress());

  // ── 3. RelicNFT ──────────────────────────────────────────────────────────
  const RelicNFT = await ethers.getContractFactory("RelicNFT");
  const relicNFT = await RelicNFT.deploy();
  await relicNFT.waitForDeployment();
  console.log("✅ RelicNFT deployed:", await relicNFT.getAddress());

  // ── 4. CharacterNFT ──────────────────────────────────────────────────────
  const CharacterNFT = await ethers.getContractFactory("CharacterNFT");
  const characterNFT = await CharacterNFT.deploy();
  await characterNFT.waitForDeployment();
  console.log("✅ CharacterNFT deployed:", await characterNFT.getAddress());

  // ── 5. ZoneDeed ──────────────────────────────────────────────────────────
  const ZoneDeed = await ethers.getContractFactory("ZoneDeed");
  const zoneDeed = await ZoneDeed.deploy();
  await zoneDeed.waitForDeployment();
  console.log("✅ ZoneDeed deployed (8 zone deeds minted to deployer):", await zoneDeed.getAddress());

  // ── 6. GameTreasury ──────────────────────────────────────────────────────
  const GameTreasury = await ethers.getContractFactory("GameTreasury");
  const gameTreasury = await GameTreasury.deploy(
    await punkToken.getAddress(),
    await zoneDeed.getAddress()
  );
  await gameTreasury.waitForDeployment();
  console.log("✅ GameTreasury deployed:", await gameTreasury.getAddress());

  // ── Grant roles ───────────────────────────────────────────────────────────
  const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
  const TREASURY_ROLE = ethers.keccak256(ethers.toUtf8Bytes("TREASURY_ROLE"));

  // GameTreasury can mint $PUNK
  await punkToken.grantRole(MINTER_ROLE, await gameTreasury.getAddress());
  console.log("✅ MINTER_ROLE on PunkToken → GameTreasury");

  // GameTreasury can record zone earnings
  await zoneDeed.grantRole(TREASURY_ROLE, await gameTreasury.getAddress());
  console.log("✅ TREASURY_ROLE on ZoneDeed → GameTreasury");

  // ── Register Portland Relics ──────────────────────────────────────────────
  const relics = [
    { id: 1, name: "Powell's Tome of Forbidden Code",  lore: "Stolen from Portland's greatest bookstore. Contains source code to reality itself.",            maxSupply: 50 },
    { id: 2, name: "Voodoo Donut Hex Ring",             lore: "A cursed sprinkle ring from the famous SE Burnside shop. Randomizes reality on contact.",       maxSupply: 50 },
    { id: 3, name: "Steel Bridge Chainsaw",             lore: "Forged from the Steel Bridge's lift mechanism. Cleaves through armor like a Willamette current.", maxSupply: 50 },
    { id: 4, name: "Timbers Axe",                       lore: "The legendary lumberjack axe of the Portland Timbers. Calls down a tree-strike AoE.",            maxSupply: 50 },
    { id: 5, name: "Burnside Oracle Staff",             lore: "The Oracle of Burnside's quantum-crystalline staff. Channels prophetic AoE curses.",             maxSupply: 50 },
    { id: 6, name: "Rose Quarter Shield",               lore: "Forged from the scrap metal of the Memorial Coliseum. Near-impenetrable.",                       maxSupply: 50 },
    { id: 7, name: "NoPo Rail Gun",                     lore: "Salvaged from a decommissioned MAX Yellow Line car. Fires compressed plasma slugs.",             maxSupply: 50 },
    { id: 8, name: "Forest Park Spear",                 lore: "Grown from a Leif Erikson Trail cedar. Channels bio-organic electrical energy.",                 maxSupply: 50 },
  ];

  for (const relic of relics) {
    await relicNFT.addRelicType(relic.id, relic.name, relic.lore, relic.maxSupply);
    console.log(`✅ Relic type registered: ${relic.name}`);
  }

  // ── Save addresses ────────────────────────────────────────────────────────
  const addresses = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    PunkToken:    await punkToken.getAddress(),
    GearNFT:      await gearNFT.getAddress(),
    RelicNFT:     await relicNFT.getAddress(),
    CharacterNFT: await characterNFT.getAddress(),
    ZoneDeed:     await zoneDeed.getAddress(),
    GameTreasury: await gameTreasury.getAddress(),
  };

  const outPath = path.join(__dirname, "../../shared/deployedAddresses.json");
  fs.writeFileSync(outPath, JSON.stringify(addresses, null, 2));
  console.log("\n📄 Deployed addresses saved to shared/deployedAddresses.json");
  console.log(JSON.stringify(addresses, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
