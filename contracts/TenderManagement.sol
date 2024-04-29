// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TenderManagement {
    enum TenderStatus { Open, Closed, Awarded }

    struct Tender {
        address governmentOfficial;
        string description;
        uint deadline;
        uint budget;
        mapping(address => uint) bids;
        uint totalBids;
        TenderStatus status;
        mapping(address => uint) feedbacks;
        address[] bidderAddresses;
    }
    
    struct Contractor {
        string name;
        string description;
        uint reputation;
        uint totalContracts;
        mapping(uint => uint) contractsInProgress;
        bool isBlacklisted;
    }
    event EtherReceived(address indexed sender, uint amount);

    // Function to receive Ether
    receive() external payable {
        emit EtherReceived(msg.sender, msg.value);
    }
    
    mapping(address => Contractor) public contractors;
    mapping(address => string) public governmentOfficials;
    mapping(uint => Tender) public tenders;
    uint public tenderCount;
    address public admin;
    uint public contractsCounter;
    address[] public contractorsAddresses; 

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyGovernmentOfficial() {
        require(msg.sender == admin || bytes(governmentOfficials[msg.sender]).length > 0, "Only government officials can perform this action");
        _;
    }

    modifier onlyContractor() {
        require(bytes(contractors[msg.sender].name).length > 0, "Only registered contractors can perform this action");
        _;
    }

    function addGovernmentOfficial(address _official, string memory _name) public onlyAdmin {
        governmentOfficials[_official] = _name;
    }

    function createTender(string memory _description, uint _deadline, uint _budget) public onlyGovernmentOfficial {
        Tender storage newTender = tenders[tenderCount];
        newTender.governmentOfficial = msg.sender;
        newTender.description = _description;
        newTender.deadline = _deadline;
        newTender.budget = _budget;
        newTender.status = TenderStatus.Open;
        tenderCount++;
    }

    function submitBid(uint _tenderId, uint _bidAmount) public onlyContractor {
        Tender storage tender = tenders[_tenderId];
        require(tender.status == TenderStatus.Open, "Tender is not open for bidding");
        require(_bidAmount > 0, "Bid amount must be greater than zero");
        tender.bids[msg.sender] = _bidAmount;
        tender.totalBids++;
        tender.bidderAddresses.push(msg.sender);
    }

    function provideFeedback(uint _tenderId, uint _rating) public onlyGovernmentOfficial() {
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");
        tenders[_tenderId].feedbacks[msg.sender] = _rating;
    }
     function blacklistContractor(address _contractorAddress) public onlyGovernmentOfficial {
        contractors[_contractorAddress].isBlacklisted = true;
    }
     function checkContractorBlacklistStatus(address _contractorAddress) public view returns (bool) {
        return contractors[_contractorAddress].isBlacklisted;
    }
    

    function awardTender(uint _tenderId, address payable _winningBidder) public onlyGovernmentOfficial payable {
    Tender storage tender = tenders[_tenderId];

    

    // Ensure that the amount sent is sufficient
    require(msg.value >= tender.budget, "Insufficient Ether sent");

    // Update tender status to Awarded
    tender.status = TenderStatus.Awarded;

    // Increment contractor's totalContracts and reputation
    contractors[_winningBidder].totalContracts++;
    contractors[_winningBidder].reputation++;

    // Use call to transfer the Ether to the winning bidder
    (bool success, ) = _winningBidder.call{value: tender.budget}("");
    require(success, "Ether transfer failed");
}

    function updateWorkProgress(uint _tenderId, uint _percentage) public onlyContractor {
        require(_percentage >= 0 && _percentage <= 100, "Percentage must be between 0 and 100");
        contractors[msg.sender].contractsInProgress[_tenderId] = _percentage;
    }
    function closeTender(uint _tenderId) public onlyGovernmentOfficial {
        Tender storage tender = tenders[_tenderId];
        require(tender.status == TenderStatus.Open, "Tender is already closed or awarded");
        tender.status = TenderStatus.Closed;
    }

    function addContractor(address _contractorAddress, string memory _name, string memory _description) public onlyGovernmentOfficial {
        Contractor storage newContractor = contractors[_contractorAddress];
        newContractor.name = _name;
        newContractor.description = _description;
        newContractor.reputation = 0;
        newContractor.totalContracts = 0;
        newContractor.isBlacklisted = false;
        contractorsAddresses.push(_contractorAddress);
    }

    function assignContract(uint _tenderId, address _contractorAddress) public onlyGovernmentOfficial {
        require(bytes(contractors[_contractorAddress].name).length > 0, "Contractor does not exist");
        require(tenders[_tenderId].status == TenderStatus.Open, "Tender is not open");
        
        contractors[_contractorAddress].contractsInProgress[_tenderId] = contractsCounter;
        contractsCounter++;
        
        tenders[_tenderId].status = TenderStatus.Closed;
    }

    function getAssignedContract(uint _tenderId) public view returns (address contractorAddress) {
        for (uint i = 0; i < contractorsAddresses.length; i++) {
            Contractor storage contractor = contractors[contractorsAddresses[i]];
            if (contractor.contractsInProgress[_tenderId] != 0) {
                contractorAddress = contractorsAddresses[i];
                return contractorAddress;
            }
        }
        revert("No contractor is assigned to the specified tender");
    }

    function getTenderDetails(uint _tenderId) public view returns (
        address governmentOfficial,
        string memory description,
        uint deadline,
        uint budget,
        uint totalBids,
        TenderStatus status
    ) {
        Tender storage tender = tenders[_tenderId];
        return (
            tender.governmentOfficial,
            tender.description,
            tender.deadline,
            tender.budget,
            tender.totalBids,
            tender.status
        );
    }

    function getBidAmount(uint _tenderId, address _bidder) public view returns (uint) {
        return tenders[_tenderId].bids[_bidder];
    }

    function getFeedback(uint _tenderId, address _contractor) public view returns (uint) {
        return tenders[_tenderId].feedbacks[_contractor];
    }

    function getContractorDetails(address _contractorAddress) public view returns (
        string memory name,
        string memory description,
        uint reputation,
        uint totalContracts,
        bool isBlacklisted
    ) {
        Contractor storage contractor = contractors[_contractorAddress];
        return (
            contractor.name,
            contractor.description,
            contractor.reputation,
            contractor.totalContracts,
            contractor.isBlacklisted
        );
    }

    function getContractorWorkProgress(uint _tenderId, address _contractor) public view returns (uint) {
        return contractors[_contractor].contractsInProgress[_tenderId];
    }

    function getAllFeedback(uint _tenderId) public view returns (address[] memory, uint[] memory) {
        Tender storage tender = tenders[_tenderId];
        uint numFeedbacks = tender.bidderAddresses.length;
        address[] memory feedbackAddresses = new address[](numFeedbacks);
        uint[] memory ratings = new uint[](numFeedbacks);

        for (uint i = 0; i < numFeedbacks; i++) {
            feedbackAddresses[i] = tender.bidderAddresses[i];
            ratings[i] = tender.feedbacks[tender.bidderAddresses[i]];
        }

        return (feedbackAddresses, ratings);
    }

    function getAllBids(uint _tenderId) public view returns (address[] memory, uint[] memory) {
        Tender storage tender = tenders[_tenderId];
        uint numBids = tender.bidderAddresses.length;
        address[] memory bidderAddresses = new address[](numBids);
        uint[] memory bidAmounts = new uint[](numBids);

        for (uint i = 0; i < numBids; i++) {
            bidderAddresses[i] = tender.bidderAddresses[i];
            bidAmounts[i] = tender.bids[tender.bidderAddresses[i]];
        }

        return (bidderAddresses, bidAmounts);
    }

    function getAllTenders() public view returns (
        uint[] memory tenderIds,
        address[] memory officials,
        string[] memory descriptions,
        uint[] memory deadlines,
        uint[] memory budgets,
        uint[] memory totalBids,
        TenderStatus[] memory statuses
    ) {
        uint numTenders = tenderCount;
        tenderIds = new uint[](numTenders);
        officials = new address[](numTenders);
        descriptions = new string[](numTenders);
        deadlines = new uint[](numTenders);
        budgets = new uint[](numTenders);
        totalBids = new uint[](numTenders);
        statuses = new TenderStatus[](numTenders);

        for (uint i = 0; i < numTenders; i++) {
            Tender storage tender = tenders[i];
            tenderIds[i] = i;
            officials[i] = tender.governmentOfficial;
            descriptions[i] = tender.description;
            deadlines[i] = tender.deadline;
            budgets[i] = tender.budget;
            totalBids[i] = tender.totalBids;
            statuses[i] = tender.status;
        }

        return (tenderIds, officials, descriptions, deadlines, budgets, totalBids, statuses);
    }
}
