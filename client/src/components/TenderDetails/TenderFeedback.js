import React, { useState, useEffect } from "react";
import Web3 from "web3";
import TenderManagementContract from "../../contracts/TenderManagement.json";

const TenderFeedback = ({ tenderId, contractorAddress }) => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [feedback, setFeedback] = useState(null);

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

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!contract) return;

      try {
        const feedbackValue = await contract.methods
          .getFeedback(tenderId, contractorAddress)
          .call();
        setFeedback(feedbackValue);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    if (web3) {
      fetchFeedback();
    }
  }, [contract, tenderId, contractorAddress, web3]);

  if (feedback === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Feedback for Contractor</h2>
      <p>Rating: {feedback} stars</p>
    </div>
  );
};

export default TenderFeedback;
