// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title Portland Punk Gear NFT — Player-owned equipment items
contract GearNFT is ERC721, ERC721URIStorage, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 private _nextTokenId = 1;

    struct GearData {
        uint8 rarity;       // 0=Common, 1=Uncommon, 2=Rare, 3=Epic, 4=Legendary
        string itemName;
        uint256 mintedAt;
        uint8 zoneId;       // Zone where it dropped
    }

    mapping(uint256 => GearData) public gearData;

    event GearMinted(
        uint256 indexed tokenId,
        address indexed to,
        uint8 rarity,
        string itemName,
        uint8 zoneId
    );

    constructor() ERC721("Portland Punk Gear", "GEAR") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    /// @notice Mint a gear NFT to a player after a combat drop
    function mintGear(
        address to,
        string calldata tokenUri,
        uint8 rarity,
        string calldata itemName,
        uint8 zoneId
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenUri);
        gearData[tokenId] = GearData({
            rarity: rarity,
            itemName: itemName,
            mintedAt: block.timestamp,
            zoneId: zoneId
        });
        emit GearMinted(tokenId, to, rarity, itemName, zoneId);
        return tokenId;
    }

    /// @notice Get all gear data for a token
    function getGearData(uint256 tokenId) external view returns (GearData memory) {
        require(ownerOf(tokenId) != address(0), "GearNFT: token does not exist");
        return gearData[tokenId];
    }

    // --- Required overrides ---
    function tokenURI(uint256 tokenId)
        public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721, ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
