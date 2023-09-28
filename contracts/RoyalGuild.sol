// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RoyalGuild {
    address private _owner;  // The owner (or wizard) of the game.
    mapping(address => uint) public monarchJoinCount;  // Tracks how many times a monarch has claimed the throne.
    mapping(address => bool) public isMember;  // Tracks if a monarch is a member of the Royal Guild.

    // Ensuring only one instance by having a private constructor.
    constructor(address owner) {
        _owner = owner;
    }

    // A function to join the Royal Guild.
    function joinGuild(address monarch) external {
        require(msg.sender == _owner, "Only the game contract can add members.");
        require(monarchJoinCount[monarch] >= 1, "Monarch must claim the throne 3 times to join.");
        isMember[monarch] = true;
    }

    // A function for the game contract to increase the join count of a monarch.
    function increaseJoinCount(address monarch) external {
        require(msg.sender == _owner, "Only the game contract can increase join count.");
        monarchJoinCount[monarch]++;
    }

    function getMonarchJoinCount(address monarch) external view returns (uint) {
        return monarchJoinCount[monarch];
    }

}
