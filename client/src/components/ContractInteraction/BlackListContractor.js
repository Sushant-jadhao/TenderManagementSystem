// BlacklistContractor.js
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import TenderManagementContract from "../../contracts/TenderManagement.json";
import "./BlacklistContractor.css";

const BlacklistContractor = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [contractorAddress, setContractorAddress] = useState("");
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

  const handleContractorAddressChange = (e) => {
    setContractorAddress(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const currentAddress = window.ethereum.selectedAddress;
      await contract.methods
        .blacklistContractor(contractorAddress)
        .send({ from: currentAddress });
      setLoading(false);
    } catch (error) {
      console.error("Error blacklisting contractor:", error);
      setError("Failed to blacklist contractor. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="blacklist-contractor">
        <h2 className="mb-4">Blacklist Contractor</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="contractorAddress">Contractor Address:</label>
            <input
              id="contractorAddress"
              type="text"
              value={contractorAddress}
              onChange={handleContractorAddressChange}
              required
              className="form-control"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary mb-3"
          >
            {loading ? "Blacklisting..." : "Blacklist Contractor"}
          </button>
        </form>
        {error && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
};

export default BlacklistContractor;
