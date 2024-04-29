import React, { useState, useEffect } from "react";
import Web3 from "web3";
import TenderManagementContract from "../../contracts/TenderManagement.json";
import "./styles.css";

const TenderDetails = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [tenderId, setTenderId] = useState("");
  const [tenderDetails, setTenderDetails] = useState("");
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

  const fetchTenderDetails = async () => {
    try {
      if (!contract || !tenderId) return;

      const details = await contract.methods.getTenderDetails(tenderId).call();
      const status = details[5] === "0" ? "closed" : "open";
      const budgetInWei = details[3];
      const budgetInEth = web3.utils.fromWei(budgetInWei, "ether");
      const formattedBudget = `${budgetInEth} ETH`;
      const formattedDetails = `
        Government Official: ${details[0]}
        Description: ${details[1]}
        Deadline: ${new Date(parseInt(details[2]) * 1000).toLocaleString()}
        Budget: ${formattedBudget}
        Total Bids: ${details[4]}
        Status: ${status}
      `;
      setTenderDetails(formattedDetails);
    } catch (error) {
      console.error("Error fetching tender details:", error);
      setErrorMessage("Failed to fetch tender details. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTenderDetails();
  };

  return (
    <div className="tender-details-container">
      <h2>Tender Details</h2>
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
            className="input-field"
          />
        </div>
        <button type="submit" className="submit-button">
          Fetch Details
        </button>
      </form>
      {tenderDetails && (
        <div className="tender-details">
          <p>{tenderDetails}</p>
        </div>
      )}
    </div>
  );
};

export default TenderDetails;
