import React, { useState, useEffect } from "react";
import Web3 from "web3";
import TenderManagementContract from "../../contracts/TenderManagement.json";
import "./SubmitBidForm.css";

const SubmitBidForm = ({ contract }) => {
  const [tenderId, setTenderId] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [contractInstance, setContractInstance] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    initializeWeb3();
  }, []);

  const initializeWeb3 = async () => {
    try {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = TenderManagementContract.networks[networkId];
        const contract = new web3Instance.eth.Contract(
          TenderManagementContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        setContractInstance(contract);
      } else {
        console.error("MetaMask not detected.");
        setErrorMessage(
          "MetaMask not detected. Please install MetaMask to use this application."
        );
      }
    } catch (error) {
      console.error("Error initializing Web3:", error);
      setErrorMessage(
        "Failed to initialize Web3. Please check your connection and try again."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tenderId || !bidAmount || !contractInstance) return;

    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      const currentAccount = accounts[0];

      await contractInstance.methods
        .submitBid(tenderId, web3.utils.toWei(bidAmount.toString(), "ether"))
        .send({ from: currentAccount });

      setTenderId("");
      setBidAmount("");
      alert("Bid submitted successfully!");
    } catch (error) {
      console.error("Error submitting bid:", error);
      alert("Failed to submit bid. Please try again.");
    }
  };

  return (
    <div className="submit-bid-form">
      <h2>Submit Bid</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="tenderId">Tender ID:</label>
          <input
            id="tenderId"
            type="number"
            min="0"
            value={tenderId}
            onChange={(e) => setTenderId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="bidAmount">Bid Amount (ETH):</label>
          <input
            id="bidAmount"
            type="number"
            min="0"
            step="any"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Bid</button>
      </form>
    </div>
  );
};

export default SubmitBidForm;
