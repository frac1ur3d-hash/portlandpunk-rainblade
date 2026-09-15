# PortlandPunk

> **Cyberpunk Location-Based Hack & Slash RPG on the Base Blockchain**
> *Portland's streets just went rogue. Hack through them. Own what you earn.*

## Project Structure

```
E:\portlandpunk\
├── client/       # React + Vite frontend (game UI + maps)
├── server/       # Node.js + Express backend (game logic oracle)
├── contracts/    # Hardhat + Solidity (Base blockchain)
└── shared/       # Shared game data (zones, enemies, items, skills)
```

## Quick Start

### 1. Prerequisites
- Node.js 18+ (installed)
- MetaMask browser extension
- A Google Maps API key (or use DEMO_MAP_ID for dev)

### 2. Install All Dependencies

```bash
# From E:\portlandpunk
npm install --workspace=client
npm install --workspace=server
npm install --workspace=contracts
```

### 3. Run a Local Blockchain

```bash
npm run dev:chain
# Starts a local Hardhat node at http://localhost:8545
```

### 4. Deploy Contracts Locally

```bash
npm run deploy:local
# Deploys all 6 contracts, saves addresses to shared/deployedAddresses.json
```

### 5. Start the Dev Servers

```bash
npm run dev:client   # React app at http://localhost:5173
npm run dev:server   # Express API at http://localhost:3001
```

## Blockchain (Base Network)

| Contract | Purpose |
|---|---|
| `PunkToken` | ERC-20 $PUNK in-game currency |
| `GearNFT` | ERC-721 equipment items |
| `RelicNFT` | ERC-721 legendary Portland Relics |
| `CharacterNFT` | ERC-721 player characters (1 per wallet) |
| `ZoneDeed` | ERC-721 neighborhood ownership (8 zones) |
| `GameTreasury` | Distributes $PUNK + zone royalties |

### Testnet Deploy (Base Sepolia)

1. Copy `contracts/.env.example` → `contracts/.env`
2. Add your Alchemy Base Sepolia URL and wallet private key
3. Get testnet ETH from https://faucet.base.org
4. Run: `npm run deploy:testnet`

## Game Zones (Portland, OR)

| Zone | Faction | Tier |
|---|---|---|
| Pearl District | Corp Drones | High |
| Burnside Badlands | Street Punks | Mid |
| Rose Quarter Ruins | Scavengers | Mid |
| Hawthorne Hackers | Netrunners | High |
| Sellwood Syndicate | River Pirates | Mid |
| NoPo Wastes | Gang Territory | High |
| Forest Park Glitch | Feral Drones | Rare |
| MAX Corridor | Transit Raiders | Mid |

## Environment Variables

### client/.env
```
VITE_GOOGLE_MAPS_API_KEY=your_key_here
VITE_SERVER_URL=http://localhost:3001
VITE_CHAIN_ID=84532
```

### server/.env
```
PORT=3001
DATABASE_URL=./db/portlandpunk.db
PRIVATE_KEY=your_oracle_wallet_private_key
PUNK_TOKEN_ADDRESS=
GEAR_NFT_ADDRESS=
RELIC_NFT_ADDRESS=
CHARACTER_NFT_ADDRESS=
ZONE_DEED_ADDRESS=
GAME_TREASURY_ADDRESS=
```

## License
MIT
