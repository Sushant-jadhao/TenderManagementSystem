// ContractorDetails.js
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import TenderManagementContract from "../../contracts/TenderManagement.json";
import "./ContractorDetails.css";

const ContractorDetails = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [contractorAddress, setContractorAddress] = useState("");
  const [contractorDetails, setContractorDetails] = useState({
    name: "",
    description: "",
    reputation: 0,
    totalContracts: 0,
    isBlacklisted: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });
          setWeb3(web3Instance);

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = TenderManagementContract.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            TenderManagementContract.abi,
            deployedNetwork && deployedNetwork.address
          );
          setContract(contractInstance);
        } else {
          console.error("MetaMask not detected.");
        }
      } catch (error) {
        console.error("Error initializing Web3:", error);
      }
    };

    initializeWeb3();
  }, []);

  const handleContractorAddressChange = (e) => {
    setContractorAddress(e.target.value);
  };

  const fetchContractorDetails = async () => {
    setLoading(true);
    try {
      const details = await contract.methods
        .getContractorDetails(contractorAddress)
        .call();
      setContractorDetails({
        name: details[0],
        description: details[1],
        reputation: Number(details[2]),
        totalContracts: Number(details[3]),
        isBlacklisted: details[4],
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contractor details:", error);
      setLoading(false);
    }
  };

  return (
    <div className="contractor-details-container">
      <h2>Contractor Details</h2>
      <div className="form-group">
        <label>Contractor Address:</label>
        <input
          type="text"
          value={contractorAddress}
          onChange={handleContractorAddressChange}
        />
      </div>
      <button onClick={fetchContractorDetails}>Fetch Details</button>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="contractor-details">
          <p>Name: {contractorDetails.name}</p>
          <p>Description: {contractorDetails.description}</p>
          <p>Reputation: {contractorDetails.reputation}</p>
          <p>Total Contracts: {contractorDetails.totalContracts}</p>
          <p>Blacklisted: {contractorDetails.isBlacklisted ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );
};

export default ContractorDetails;
