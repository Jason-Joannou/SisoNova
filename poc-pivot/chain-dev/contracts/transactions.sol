// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Transactions is Ownable {

    event LogAcceptedTransaction (
        uint256 indexed id,
        address indexed belongsTo,
        uint256 amount,
        uint256 timestamp,
        string transactionType,
        string capturedAt,
        uint16 validityScore
    );

    event LogRejectedTransaction (
        uint256 indexed id,
        address indexed user,      
        address rejector,
        uint256 amount,
        uint256 timestamp,
        string reason
    );

    constructor() Ownable(msg.sender) {}

    function logTransaction (
        uint256 id,
        address belongsTo,
        uint256 amount,
        uint256 timestamp,
        string transactionType,
        string capturedAt,
        uint16 validityScore
    ) external {
        emit LogAcceptedTransaction(
            id,
            belongsTo,
            amount,
            timestamp,
            transactionType,
            capturedAt,
            validityScore
        );
    }

    function logRejection (
        uint256 id,
        address user,
        address rejector,
        uint256 amount,
        uint256 timestamp,
        string reason
    ) external {
        emit LogRejectedTransaction(
            id,
            user,
            rejector,
            amount,
            timestamp,
            reason
        );
    }

}
