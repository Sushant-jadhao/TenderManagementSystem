// AddContractorForm.js
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import TenderManagementContract from "../../contracts/TenderManagement.json";
import "./AddContractorForm.css";

const AddContractorForm = () => {
  const [contractorAddress, setContractorAddress] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
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
    if (!contractorAddress || !name || !description || !contractInstance)
      return; // Don't submit if any field is empty

    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      const currentAccount = accounts[0];

      await contractInstance.methods
        .addContractor(contractorAddress, name, description)
        .send({ from: currentAccount });

      setContractorAddress("");
      setName("");
      setDescription("");
      alert("Contractor added successfully!");
    } catch (error) {
      console.error("Error adding contractor:", error);
      alert("Failed to add contractor. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          <div className="card shadow-lg add-contractor-form">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">Add Contractor</h2>
            </div>
            <div className="card-body">
              {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="contractorAddress" className="form-label">
                    Contractor Address
                  </label>
                  <input
                    id="contractorAddress"
                    type="text"
                    value={contractorAddress}
                    onChange={(e) => setContractorAddress(e.target.value)}
                    required
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <input
                    id="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="form-control"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                  Add Contractor
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddContractorForm;
