// CheckBlacklistStatus.js
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import TenderManagementContract from "../../contracts/TenderManagement.json";
import "./CheckBlacklistStatus.css";

const CheckBlacklistStatus = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [contractorAddress, setContractorAddress] = useState("");
  const [isBlacklisted, setIsBlacklisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

    initializeWeb3();
  }, []);

  const handleContractorAddressChange = (e) => {
    setContractorAddress(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isBlacklisted = await contract.methods
        .checkContractorBlacklistStatus(contractorAddress)
        .call();
      setIsBlacklisted(isBlacklisted);
    } catch (error) {
      console.error("Error checking blacklist status:", error);
      setErrorMessage("Failed to check blacklist status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="check-blacklist-status">
        <h2>Check Blacklist Status</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
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
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Checking..." : "Check Status"}
          </button>
        </form>
        {loading && <p>Loading...</p>}
        {!loading && (
          <>
            {isBlacklisted ? (
              <p className="blacklisted-msg">This contractor is blacklisted.</p>
            ) : (
              <p className="not-blacklisted-msg">
                This contractor is not blacklisted.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CheckBlacklistStatus;
