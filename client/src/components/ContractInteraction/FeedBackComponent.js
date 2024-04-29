import React, { useState, useEffect } from "react";
import Web3 from "web3";
import contractData from "../../contracts/TenderManagement.json";
import "./FeedbackComponent.css";

function FeedbackComponent() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [feedbackData, setFeedbackData] = useState({
    addresses: [],
    ratings: [],
  });
  const [tenderId, setTenderId] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const loadContract = async () => {
      try {
        const networkId = "5777"; // Default network ID for Ganache or local blockchain
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        setWeb3(web3Instance);

        const deployedNetwork = contractData.networks[networkId];
        const contractInstance = new web3Instance.eth.Contract(
          contractData.abi,
          deployedNetwork && deployedNetwork.address
        );
        setContract(contractInstance);
      } catch (error) {
        console.error("Error loading contract:", error);
        setErrorMessage("Failed to load contract. Please try again.");
      }
    };

    loadContract();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (contract) {
          const result = await contract.methods.getAllFeedback(tenderId).call();
          const addresses = result[0];
          const ratings = result[1].map((rating) => rating.toString());
          setFeedbackData({ addresses, ratings });
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setErrorMessage("Failed to fetch feedback. Please try again.");
      }
    };

    fetchData();
  }, [contract, tenderId]);

  const handleTenderIdChange = (event) => {
    setTenderId(event.target.value);
  };

  const handleShowFeedback = () => {
    setShowFeedback(true);
  };

  return (
    <div className="feedback-container">
      <h1>Feedback for Tender</h1>
      <label htmlFor="tenderId">Enter Tender ID:</label>
      <input
        type="number"
        id="tenderId"
        value={tenderId}
        onChange={handleTenderIdChange}
      />
      <button onClick={handleShowFeedback}>Show Feedback</button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {showFeedback && (
        <table>
          <thead>
            <tr>
              <th>Address</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {feedbackData.addresses.map((address, index) => (
              <tr key={index}>
                <td>{address}</td>
                <td>{feedbackData.ratings[index]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FeedbackComponent;
