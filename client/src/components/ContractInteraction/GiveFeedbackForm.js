import React, { useState, useEffect } from "react";
import Web3 from "web3";
import TenderManagementContract from "../../contracts/TenderManagement.json";
import "./GiveFeedbackForm.css";

const GiveFeedbackForm = ({ contract }) => {
  const [tenderId, setTenderId] = useState("");
  const [rating, setRating] = useState("");
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
    if (!tenderId || !rating || !contractInstance) return;

    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      const currentAccount = accounts[0];

      await contractInstance.methods
        .provideFeedback(parseInt(tenderId), parseInt(rating))
        .send({ from: currentAccount });

      setTenderId("");
      setRating("");
      alert("Feedback provided successfully!");
    } catch (error) {
      console.error("Error providing feedback:", error);
      alert("Failed to provide feedback. Please try again.");
    }
  };

  return (
    <div className="give-feedback-form">
      <h2>Give Feedback</h2>
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
          <label htmlFor="rating">Rating (1-5):</label>
          <input
            id="rating"
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default GiveFeedbackForm;
