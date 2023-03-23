// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract KingOfTheHill is ReentrancyGuard {
    address public king;
    uint public currentTakeoverPrice;
    address payable public owner;

    constructor() payable {
        owner = payable(msg.sender);
        king = msg.sender;
        currentTakeoverPrice = msg.value;
    }

    function _king() public view returns (address) {
        return king;
    }

    function takeOver() external payable nonReentrant {
        require(msg.value >= currentTakeoverPrice, "Insufficient amount sent");
        if (msg.sender != king) {
            (bool success, ) = payable(king).call{value: currentTakeoverPrice}("");
            require(success, "Transfer failed");
            king = msg.sender;
        }
        currentTakeoverPrice = msg.value;
    }

    function withdraw() external nonReentrant {
        require(msg.sender == owner, "Only owner can withdraw");
        uint balance = address(this).balance;
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Transfer failed");
    }
}