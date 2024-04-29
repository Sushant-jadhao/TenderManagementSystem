import React, { useState, useEffect } from "react";
import Web3 from "web3";
import TenderManagementContract from "../../contracts/TenderManagement.json";

const GetFeedback = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [tenderId, setTenderId] = useState("");
  const [contractorAddress, setContractorAddress] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");

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

          // Fetch the current account
          const accounts = await web3Instance.eth.getAccounts();
          setCurrentAccount(accounts[0]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await contract.methods
        .getFeedback(tenderId, contractorAddress)
        .call({ from: currentAccount });
      setFeedback(result.toString()); // Convert feedback to string
      setLoading(false);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Get Feedback</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="tenderId">Tender ID:</label>
        <input
          id="tenderId"
          type="text"
          value={tenderId}
          onChange={handleTenderIdChange}
          required
        />
        <label htmlFor="contractorAddress">Contractor Address:</label>
        <input
          id="contractorAddress"
          type="text"
          value={contractorAddress}
          onChange={handleContractorAddressChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Fetching..." : "Get Feedback"}
        </button>
      </form>
      {feedback !== "" && (
        <div>
          <h3>Feedback:</h3>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
};

export default GetFeedback;
