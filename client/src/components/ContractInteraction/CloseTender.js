import React, { useState, useEffect } from "react";
import Web3 from "web3";
import TenderManagementContract from "../../contracts/TenderManagement.json";
import "./CloseTender.css";

const CloseTender = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [tenderId, setTenderId] = useState("");
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

  const handleTenderIdChange = (e) => {
    setTenderId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const currentAddress = window.ethereum.selectedAddress;
      await contract.methods
        .closeTender(tenderId)
        .send({ from: currentAddress });
      setLoading(false);
      alert("Tender closed successfully!");
    } catch (error) {
      console.error("Error closing tender:", error);
      setLoading(false);
      alert("Failed to close tender. Please try again.");
    }
  };

  return (
    <div className="close-tender-container">
      <h2>Close Tender</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="tenderId">Tender ID:</label>
          <input
            id="tenderId"
            type="text"
            value={tenderId}
            onChange={handleTenderIdChange}
            required
          />
        </div>
        <button className="close-button" type="submit" disabled={loading}>
          {loading ? "Closing..." : "Close Tender"}
        </button>
      </form>
    </div>
  );
};

export default CloseTender;
