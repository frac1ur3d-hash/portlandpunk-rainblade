// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./PunkToken.sol";
import "./ZoneDeed.sol";

/// @title Game Treasury — Authoritative loot distributor for PortlandPunk
/// @notice Called by the server oracle to distribute $PUNK and trigger zone royalties
contract GameTreasury is AccessControl {
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");

    PunkToken public punkToken;
    ZoneDeed  public zoneDeed;

    /// @notice Zone royalty rate in basis points (500 = 5%)
    uint256 public zoneRoyaltyBps = 500;

    event LootDistributed(address indexed player, uint256 punkAmount, uint8 zoneId);
    event ZoneRoyaltyPaid(address indexed zoneOwner, uint256 royaltyAmount, uint8 zoneId);
    event ContractsSet(address punkToken, address zoneDeed);

    constructor(address _punkToken, address _zoneDeed) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(DISTRIBUTOR_ROLE, msg.sender);
        punkToken = PunkToken(_punkToken);
        zoneDeed  = ZoneDeed(_zoneDeed);
    }

    /// @notice Update contract addresses (admin only)
    function setContracts(address _punkToken, address _zoneDeed)
        external onlyRole(DEFAULT_ADMIN_ROLE) {
        punkToken = PunkToken(_punkToken);
        zoneDeed  = ZoneDeed(_zoneDeed);
        emit ContractsSet(_punkToken, _zoneDeed);
    }

    /// @notice Set zone royalty rate (admin only). Max 20%.
    function setZoneRoyaltyBps(uint256 bps) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(bps <= 2000, "GameTreasury: royalty too high");
        zoneRoyaltyBps = bps;
    }

    /// @notice Distribute $PUNK loot to a player after combat. Sends royalty cut to zone deed owner.
    /// @param player  Winning player address
    /// @param punkAmount Total $PUNK to award (before royalty split)
    /// @param zoneId  Zone where combat occurred (0-7)
    function distributeLoot(
        address player,
        uint256 punkAmount,
        uint8   zoneId
    ) external onlyRole(DISTRIBUTOR_ROLE) {
        require(punkAmount > 0, "GameTreasury: zero amount");

        // Calculate zone royalty
        uint256 royalty      = (punkAmount * zoneRoyaltyBps) / 10000;
        uint256 playerAmount = punkAmount - royalty;

        // Mint player share
        punkToken.mint(player, playerAmount);

        // Mint zone royalty to deed owner (if royalty > 0)
        if (royalty > 0) {
            address zoneOwner = zoneDeed.getZoneOwner(zoneId);
            punkToken.mint(zoneOwner, royalty);
            zoneDeed.recordEarning(zoneId, royalty);
            emit ZoneRoyaltyPaid(zoneOwner, royalty, zoneId);
        }

        emit LootDistributed(player, playerAmount, zoneId);
    }
}
