pragma solidity >=0.4.22 <0.8.0;

contract Lighthouse  {
    address owner = msg.sender;

    struct Content {
        string cid;
        string config;
        uint fileCost;
    }

    struct Status {
        uint dealId;
        bool active;
        mapping (uint => string) miners;
    }

    event StorageRequest(address uploader, string cid, string config, uint fileCost);

    mapping(address => mapping(string => Content)) public requests;

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
    
    fallback () external payable  {}
    
    function publishStorageStatus(string cid, Status status) # restrict it to only the user {
      
    }
}
