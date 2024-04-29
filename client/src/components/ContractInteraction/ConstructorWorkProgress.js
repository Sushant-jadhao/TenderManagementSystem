import React, { useState, useEffect } from "react";
import Web3 from "web3";
import TenderManagementContract from "../../contracts/TenderManagement.json";
import "./ContractorWorkProgress.css";

const ContractorWorkProgress = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [tenderId, setTenderId] = useState("");
  const [contractorAddress, setContractorAddress] = useState("");
  const [workProgress, setWorkProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleTenderIdChange = (e) => {
    setTenderId(e.target.value);
  };

  const handleContractorAddressChange = (e) => {
    setContractorAddress(e.target.value);
  };

  const handleGetProgress = async () => {
    setLoading(true);
    try {
      const progress = await contract.methods
        .getContractorWorkProgress(tenderId, contractorAddress)
        .call();
      setWorkProgress(progress);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching work progress:", error);
      setError("Failed to fetch work progress. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="contractor-work-progress-container">
      <h2>Contractor Work Progress</h2>
      <label>
        Tender ID:
        <input
          type="text"
          value={tenderId}
          onChange={handleTenderIdChange}
          required
        />
      </label>
      <label>
        Contractor Address:
        <input
          type="text"
          value={contractorAddress}
          onChange={handleContractorAddressChange}
          required
        />
      </label>
      <button
        className="get-progress-button"
        onClick={handleGetProgress}
        disabled={loading}
      >
        {loading ? "Loading..." : "Get Progress"}
      </button>
      {workProgress !== null && (
        <div className="progress-display">
          <p>Work Progress: {workProgress}%</p>
          <progress value={workProgress} max={100} />
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ContractorWorkProgress;
