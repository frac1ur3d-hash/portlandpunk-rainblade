// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title Portland Zone Deed — Neighborhood ownership NFTs
/// @notice Each of Portland's 8 game zones has one deed. Owners earn $PUNK from zone activity.
contract ZoneDeed is ERC721, ERC721URIStorage, AccessControl {
    bytes32 public constant TREASURY_ROLE = keccak256("TREASURY_ROLE");

    uint8 public constant TOTAL_ZONES = 8;

    struct ZoneData {
        uint8   zoneId;
        string  zoneName;
        uint256 totalEarned; // cumulative $PUNK recorded (informational)
    }

    mapping(uint8 => ZoneData) public zones;
    // tokenId == zoneId + 1  (zone 0 → token 1, zone 7 → token 8)

    event ZoneEarningRecorded(uint8 indexed zoneId, uint256 amount, uint256 totalEarned);
    event ZoneDeedTransferred(uint8 indexed zoneId, address indexed from, address indexed to);

    string[8] private _zoneNames = [
        "Pearl District",
        "Burnside Badlands",
        "Rose Quarter Ruins",
        "Hawthorne Hackers",
        "Sellwood Syndicate",
        "NoPo Wastes",
        "Forest Park Glitch",
        "MAX Corridor"
    ];

    constructor() ERC721("Portland Zone Deed", "ZONE") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(TREASURY_ROLE, msg.sender);

        // Mint all 8 zone deeds to deployer at launch
        for (uint8 i = 0; i < TOTAL_ZONES; i++) {
            uint256 tokenId = uint256(i) + 1;
            _safeMint(msg.sender, tokenId);
            zones[i] = ZoneData({
                zoneId: i,
                zoneName: _zoneNames[i],
                totalEarned: 0
            });
        }
    }

    /// @notice Record $PUNK earnings for a zone (called by GameTreasury)
    function recordEarning(uint8 zoneId, uint256 amount) external onlyRole(TREASURY_ROLE) {
        require(zoneId < TOTAL_ZONES, "ZoneDeed: invalid zone");
        zones[zoneId].totalEarned += amount;
        emit ZoneEarningRecorded(zoneId, amount, zones[zoneId].totalEarned);
    }

    /// @notice Get the current owner of a zone
    function getZoneOwner(uint8 zoneId) external view returns (address) {
        require(zoneId < TOTAL_ZONES, "ZoneDeed: invalid zone");
        return ownerOf(uint256(zoneId) + 1);
    }

    /// @notice Get zone data by zone ID
    function getZoneData(uint8 zoneId) external view returns (ZoneData memory) {
        require(zoneId < TOTAL_ZONES, "ZoneDeed: invalid zone");
        return zones[zoneId];
    }

    // --- Overrides ---
    function tokenURI(uint256 tokenId)
        public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721, ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
