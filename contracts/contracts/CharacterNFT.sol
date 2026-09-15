// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title Portland Punk Character NFT — One per wallet, tradeable
contract CharacterNFT is ERC721, ERC721URIStorage, AccessControl {
    bytes32 public constant MINTER_ROLE   = keccak256("MINTER_ROLE");
    bytes32 public constant UPDATER_ROLE  = keccak256("UPDATER_ROLE");

    // Character classes
    uint8 public constant SAMURAI    = 0;
    uint8 public constant NETRUNNER  = 1;
    uint8 public constant INFILTRATOR = 2;
    uint8 public constant SHAMAN     = 3;

    uint256 private _nextTokenId = 1;

    struct CharacterData {
        uint8   classId;
        string  characterName;
        uint16  level;
        uint256 xp;
        uint256 mintedAt;
    }

    mapping(uint256 => CharacterData) public characters;
    mapping(address => uint256)        public walletCharacter; // wallet => tokenId (0 = none)

    event CharacterMinted(uint256 indexed tokenId, address indexed to, uint8 classId, string characterName);
    event CharacterProgressed(uint256 indexed tokenId, uint16 newLevel, uint256 newXp);

    constructor() ERC721("Portland Punk Character", "CHAR") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(UPDATER_ROLE, msg.sender);
    }

    /// @notice Mint a character. One per wallet enforced.
    function mintCharacter(
        address to,
        uint8 classId,
        string calldata characterName,
        string calldata tokenUri
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        require(walletCharacter[to] == 0, "CharacterNFT: wallet already has a character");
        require(classId <= SHAMAN, "CharacterNFT: invalid class");
        require(bytes(characterName).length > 0, "CharacterNFT: name required");

        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenUri);

        characters[tokenId] = CharacterData({
            classId: classId,
            characterName: characterName,
            level: 1,
            xp: 0,
            mintedAt: block.timestamp
        });
        walletCharacter[to] = tokenId;

        emit CharacterMinted(tokenId, to, classId, characterName);
        return tokenId;
    }

    /// @notice Update level and XP checkpoint on-chain. Called by server oracle periodically.
    function updateProgress(
        uint256 tokenId,
        uint16 newLevel,
        uint256 newXp
    ) external onlyRole(UPDATER_ROLE) {
        require(ownerOf(tokenId) != address(0), "CharacterNFT: token does not exist");
        CharacterData storage c = characters[tokenId];
        c.level = newLevel;
        c.xp    = newXp;
        emit CharacterProgressed(tokenId, newLevel, newXp);
    }

    /// @notice Update wallet mapping on transfer so one-per-wallet holds
    function _update(address to, uint256 tokenId, address auth)
        internal override returns (address) {
        address from = super._update(to, tokenId, auth);
        if (from != address(0)) {
            walletCharacter[from] = 0;
        }
        if (to != address(0)) {
            require(walletCharacter[to] == 0, "CharacterNFT: destination already has a character");
            walletCharacter[to] = tokenId;
        }
        return from;
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
