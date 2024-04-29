import React, { useState, useEffect } from "react";
import Web3 from "web3";
import TenderManagementContract from "../../contracts/TenderManagement.json";
import "./CreateTenderForm.css";

const CreateTenderForm = () => {
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [budget, setBudget] = useState("");
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

  const handleCreateTender = async (e) => {
    e.preventDefault();
    if (!description || !deadline || !budget || !contractInstance) return;

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const currentAccount = accounts[0];

      const deadlineTimestamp = new Date(deadline).getTime() / 1000;

      await contractInstance.methods
        .createTender(
          description,
          deadlineTimestamp,
          Web3.utils.toWei(budget.toString(), "ether")
        )
        .send({ from: currentAccount });

      setDescription("");
      setDeadline("");
      setBudget("");
      alert("Tender created successfully!");
    } catch (error) {
      console.error("Error creating tender:", error);
      alert("Failed to create tender. Please try again.");
    }
  };

  return (
    <div className="create-tender-container">
      <h2>Create New Tender</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleCreateTender}>
        <div className="form-group">
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Deadline:</label>
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Budget (ETH):</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Tender</button>
      </form>
    </div>
  );
};

export default CreateTenderForm;
