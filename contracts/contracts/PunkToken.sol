// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title Portland Punk Token ($PUNK) — In-game currency for PortlandPunk RPG
contract PunkToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    event PunkMinted(address indexed to, uint256 amount);
    event PunkBurned(address indexed from, uint256 amount);

    constructor() ERC20("Portland Punk Token", "PUNK") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    /// @notice Mint $PUNK to a player address. Only authorized minters (game server oracle).
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
        emit PunkMinted(to, amount);
    }

    /// @notice Burn $PUNK from caller (used for shop purchases).
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
        emit PunkBurned(msg.sender, amount);
    }

    /// @notice Burn $PUNK from an approved address (shop contract pulls).
    function burnFrom(address from, uint256 amount) external {
        _spendAllowance(from, msg.sender, amount);
        _burn(from, amount);
        emit PunkBurned(from, amount);
    }
}
