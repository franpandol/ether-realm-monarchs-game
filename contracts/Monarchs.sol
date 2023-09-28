// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RoyalGuild.sol";

contract Monarchs is Pausable, Ownable {
    address public currentKing;
    uint256 public claimPrice = 0.01 ether;
    uint256 constant incrementPercentage = 10;

    struct Monarch {
        address monarchAddress;
        uint256 pricePaid;
    }

    Monarch[] public monarchs;

    event NewKing(address indexed king, uint256 price);

    RoyalGuild private royalGuild;

    constructor() {
        // The contract deployer becomes the owner (which is the role of the wizard in our case).
        // Create the single instance of the Royal Guild.
        royalGuild = new RoyalGuild(address(this));
        emit RoyalGuildCreated(address(royalGuild));
    }

    function claimThrone() external payable whenNotPaused {
        require(msg.value >= claimPrice, "Sent Ether is less than the current price");

        if (currentKing != address(0)) {
            payable(currentKing).transfer(claimPrice);
        }

        monarchs.push(Monarch({
            monarchAddress: msg.sender,
            pricePaid: msg.value
        }));

        currentKing = msg.sender;
        claimPrice = (claimPrice * (100 + incrementPercentage)) / 100;

        royalGuild.increaseJoinCount(msg.sender);
        emit NewKing(currentKing, claimPrice);
    }

    function sweepFunds() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function listMonarchs() external view returns (Monarch[] memory) {
        return monarchs;
    }
    function getAllMonarchJoinCounts() external view returns (address[] memory monarchAddresses, uint[] memory joinCounts) {
        // Temporary array to filter unique monarchs.
        address[] memory uniqueMonarchs = new address[](monarchs.length);
        
        uint uniqueCount = 0;
        // First pass: Identify unique monarchs.
        for (uint i = 0; i < monarchs.length; i++) {
            bool isUnique = true;
            for (uint j = 0; j < uniqueCount; j++) {
                if (monarchs[i].monarchAddress == uniqueMonarchs[j]) {
                    isUnique = false;
                    break;
                }
            }
            if (isUnique) {
                uniqueMonarchs[uniqueCount] = monarchs[i].monarchAddress;
                uniqueCount++;
            }
        }

        monarchAddresses = new address[](uniqueCount);
        joinCounts = new uint[](uniqueCount);
        
        // Second pass: Populate the return arrays.
        for (uint i = 0; i < uniqueCount; i++) {
            monarchAddresses[i] = uniqueMonarchs[i];
            joinCounts[i] = royalGuild.getMonarchJoinCount(uniqueMonarchs[i]);
        }
    }

    function joinRoyalGuild() external {
        require(monarchs.length > 0, "No monarchs to join the guild.");
        royalGuild.joinGuild(msg.sender);
    }
    function getGuildMembers() external view returns (address[] memory) {
        uint count = 0;
        for (uint i = 0; i < monarchs.length; i++) {
            if (royalGuild.isMember(monarchs[i].monarchAddress)) {
                count++;
            }
        }
        
        address[] memory guildMembers = new address[](count);
        
        uint index = 0;
        for (uint i = 0; i < monarchs.length; i++) {
            if (royalGuild.isMember(monarchs[i].monarchAddress)) {
                guildMembers[index] = monarchs[i].monarchAddress;
                index++;
            }
        }
        
        return guildMembers;
    }

    event RoyalGuildCreated(address indexed royalGuildAddress);

    // The `pause` and `unpause` functions are inherited from the Pausable mixin and are restricted to the owner.
}
