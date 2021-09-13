// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.22 <0.8.0;

contract Lighthouse  {
    address owner;

    constructor () {
        owner == msg.sender;    
    }

    struct Content {
        string cid;
        string config;
        uint fileCost;
    }

    struct Status {
        uint dealId;
        bool active;
        // mapping (uint => string) miners;
    }

    event StorageRequest(address uploader, string cid, string config, uint fileCost);
    event StorageStatusRequest(address requester, string cid);

    mapping(address => mapping(string => Content)) public requests;
    mapping(address => mapping(string => Status)) public status; // address -> cid -> status

    function store(string calldata cid, string calldata config)
        external
        payable
    {
        uint fileCost = msg.value;
        requests[msg.sender][cid] = Content(cid, config, fileCost);
        emit StorageRequest(msg.sender, cid, config, msg.value);
    }

    function getPaid(uint amount, address payable recipient)
        external
    {
        require(msg.sender == owner);
        recipient.transfer(amount);
    }

    function requestStorageStatus(string calldata cid) 
        external
    {
        emit StorageStatusRequest(msg.sender, cid);
    }
    
    function publishStorageStatus(address sender, string calldata cid, uint dealId, bool active) 
        external
    { // restrict it to only to the user
        require(msg.sender == owner);
        status[sender][cid] = Status(dealId, active);
    }

    fallback () external payable  {}
}
