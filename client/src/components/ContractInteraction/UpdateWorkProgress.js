import React, { useState, useEffect } from "react";
import Web3 from "web3";
import TenderManagementContract from "../../contracts/TenderManagement.json";
import "./UpdateWorkProgress.css";

const UpdateWorkProgress = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [tenderId, setTenderId] = useState("");
  const [percentage, setPercentage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [networkId, setNetworkId] = useState(null);

  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });
          setWeb3(web3Instance);

          const networkId = await web3Instance.eth.net.getId();
          setNetworkId(networkId);

          const deployedNetwork = TenderManagementContract.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            TenderManagementContract.abi,
            deployedNetwork && deployedNetwork.address
          );
          setContract(contractInstance);

          const accounts = await web3Instance.eth.getAccounts();
          setCurrentAccount(accounts[0]); // Assuming you want to use the first account
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

  const handlePercentageChange = (e) => {
    setPercentage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentAccount) {
      alert("No Ethereum account selected in MetaMask");
      return;
    }

    setLoading(true);
    try {
      await contract.methods
        .updateWorkProgress(tenderId, percentage)
        .send({ from: currentAccount });
      setLoading(false);
      alert("Work progress updated successfully!");
    } catch (error) {
      console.error("Error updating work progress:", error);
      setLoading(false);
      alert("Failed to update work progress. Please try again.");
    }
  };

  return (
    <div className="update-work-progress-container">
      <h2>Update Work Progress</h2>
      {web3 && networkId && <p>Connected to network: {networkId}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tender ID:</label>
          <input
            type="text"
            value={tenderId}
            onChange={handleTenderIdChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Percentage:</label>
          <input
            type="number"
            value={percentage}
            onChange={handlePercentageChange}
            min="0"
            max="100"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Progress"}
        </button>
      </form>
    </div>
  );
};

export default UpdateWorkProgress;
