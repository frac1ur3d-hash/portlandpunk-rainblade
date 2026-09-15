// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title Portland Relics — Legendary unique NFTs tied to Portland landmarks
contract RelicNFT is ERC721, ERC721URIStorage, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 private _nextTokenId = 1;

    struct RelicType {
        string name;
        string lore;
        uint256 maxSupply;
        uint256 minted;
    }

    struct RelicInstance {
        uint256 relicTypeId;
        uint256 mintedAt;
    }

    mapping(uint256 => RelicType) public relicTypes;
    mapping(uint256 => RelicInstance) public relicInstances;

    event RelicTypeAdded(uint256 indexed typeId, string name, uint256 maxSupply);
    event RelicMinted(uint256 indexed tokenId, address indexed to, uint256 relicTypeId, string name);

    constructor() ERC721("Portland Relics", "RELIC") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    /// @notice Register a new relic type. Only admin.
    function addRelicType(
        uint256 typeId,
        string calldata name,
        string calldata lore,
        uint256 maxSupply
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(relicTypes[typeId].maxSupply == 0, "RelicNFT: type already registered");
        require(maxSupply > 0, "RelicNFT: maxSupply must be > 0");
        relicTypes[typeId] = RelicType({
            name: name,
            lore: lore,
            maxSupply: maxSupply,
            minted: 0
        });
        emit RelicTypeAdded(typeId, name, maxSupply);
    }

    /// @notice Mint a Portland Relic to a player. Only authorized minters.
    function mintRelic(
        address to,
        uint256 relicTypeId,
        string calldata tokenUri
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        RelicType storage rt = relicTypes[relicTypeId];
        require(rt.maxSupply > 0, "RelicNFT: relic type not registered");
        require(rt.minted < rt.maxSupply, "RelicNFT: max supply reached");

        uint256 tokenId = _nextTokenId++;
        rt.minted++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenUri);
        relicInstances[tokenId] = RelicInstance({
            relicTypeId: relicTypeId,
            mintedAt: block.timestamp
        });

        emit RelicMinted(tokenId, to, relicTypeId, rt.name);
        return tokenId;
    }

    /// @notice Get remaining supply for a relic type
    function remainingSupply(uint256 typeId) external view returns (uint256) {
        RelicType storage rt = relicTypes[typeId];
        return rt.maxSupply - rt.minted;
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
