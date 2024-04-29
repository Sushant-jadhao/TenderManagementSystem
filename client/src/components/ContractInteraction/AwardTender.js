import React, { useState, useEffect } from "react";
import Web3 from "web3";
import TenderManagementContract from "../../contracts/TenderManagement.json";
import "./AwardTender.css";

const AwardTender = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  // const [tenderId, setTenderId] = useState("");
  const [winningBidder, setWinningBidder] = useState("");
  const [amount, setAmount] = useState("");
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
          throw new Error("MetaMask not detected.");
        }
      } catch (error) {
        setError(error.message);
      }
    };

    initializeWeb3();
  }, []);

  // const handleTenderIdChange = (e) => {
  //   setTenderId(e.target.value);
  // };

  const handleWinningBidderChange = (e) => {
    setWinningBidder(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(String(e.target.value)); // Convert input to string
  };

  const handleAwardTender = async () => {
    setLoading(true);
    try {
      if (!contract) {
        throw new Error("Contract not initialized.");
      }

      const accounts = await web3.eth.getAccounts();
      const currentAccount = accounts[0];

      const result = await contract.methods
        .awardTender(11, winningBidder)
        .send({
          from: currentAccount,
          value: web3.utils.toWei(amount, "ether"),
        });

      setLoading(false);
      alert("Tender awarded successfully!");
      console.log("Transaction result:", result);
    } catch (error) {
      console.error("Error awarding tender:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="award-tender">
        <h2 className="mb-4">Pay Tender</h2>
        {error && <p className="text-danger">{error}</p>}

        <div className="form-group">
          <label htmlFor="winningBidder">Winning Bidder Address:</label>
          <input
            id="winningBidder"
            type="text"
            value={winningBidder}
            onChange={handleWinningBidderChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount:</label>
          <input
            id="amount"
            type="text"
            value={amount}
            onChange={handleAmountChange}
            required
            className="form-control"
          />
        </div>

        <button
          onClick={handleAwardTender}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? "Awarding..." : "Award Tender"}
        </button>
      </div>
    </div>
  );
};

export default AwardTender;
