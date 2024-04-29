// AddGovernmentOfficialForm.js
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import TenderManagementContract from "../../contracts/TenderManagement.json";
import "./AddGovernmentOfficialForm.css";

const AddGovernmentOfficialForm = () => {
  const [officialAddress, setOfficialAddress] = useState("");
  const [officialName, setOfficialName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [contractInstance, setContractInstance] = useState(null);

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

  const handleAddOfficial = async () => {
    if (!officialAddress || !officialName || !contractInstance) return;

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const currentAccount = accounts[0];

      await contractInstance.methods
        .addGovernmentOfficial(officialAddress, officialName)
        .send({ from: currentAccount });

      setOfficialAddress("");
      setOfficialName("");
      setErrorMessage("");
      alert("Government official added successfully!");
    } catch (error) {
      console.error("Error adding government official:", error);
      setErrorMessage("Failed to add government official. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg add-official-form">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">Add Official</h2>
            </div>
            <div className="card-body">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddOfficial();
                }}
              >
                <div className="mb-3">
                  <label htmlFor="officialAddress" className="form-label">
                    Organization Address
                  </label>
                  <input
                    id="officialAddress"
                    type="text"
                    value={officialAddress}
                    onChange={(e) => setOfficialAddress(e.target.value)}
                    required
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="officialName" className="form-label">
                    Organization Name
                  </label>
                  <input
                    id="officialName"
                    type="text"
                    value={officialName}
                    onChange={(e) => setOfficialName(e.target.value)}
                    required
                    className="form-control"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                  Add Official
                </button>
              </form>
              {errorMessage && (
                <div className="alert alert-danger mt-3">{errorMessage}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGovernmentOfficialForm;
