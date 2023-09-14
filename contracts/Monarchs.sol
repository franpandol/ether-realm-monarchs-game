// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

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

    constructor() {
        // The contract deployer becomes the owner (which is the role of the wizard in our case).
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

        emit NewKing(currentKing, claimPrice);
    }

    function sweepFunds() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function listMonarchs() external view returns (Monarch[] memory) {
        return monarchs;
    }

    // The `pause` and `unpause` functions are inherited from the Pausable mixin and are restricted to the owner.
}
