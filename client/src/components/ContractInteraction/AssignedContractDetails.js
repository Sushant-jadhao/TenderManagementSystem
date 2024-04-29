import React, { useState } from "react";
import Web3 from "web3";
import TenderManagementContract from "../../contracts/TenderManagement.json";
import "./AssignedContractDetails.css";

const AssignedContractDetails = () => {
  const [contractorAddress, setContractorAddress] = useState("");
  const [tenderId, setTenderId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleGetAssignedContract = async () => {
    try {
      if (!tenderId) return;

      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      const currentAccount = accounts[0];

      const contract = new web3.eth.Contract(
        TenderManagementContract.abi,
        TenderManagementContract.networks["5777"].address
      );

      const assignedContractor = await contract.methods
        .getAssignedContract(tenderId)
        .call({ from: currentAccount });

      setContractorAddress(assignedContractor.toString());
    } catch (error) {
      console.error("Error fetching assigned contract:", error);
      setErrorMessage("Failed to fetch assigned contract. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          <div className="card shadow-lg assigned-contract-details">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">Assigned Contract Details</h2>
            </div>
            <div className="card-body">
              {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
              )}
              <div className="mb-3">
                <label htmlFor="tenderId" className="form-label">
                  Tender ID
                </label>
                <input
                  id="tenderId"
                  type="text"
                  value={tenderId}
                  onChange={(e) => setTenderId(e.target.value)}
                  required
                  className="form-control"
                />
              </div>
              <button
                type="button"
                onClick={handleGetAssignedContract}
                className="btn btn-primary btn-block"
              >
                Get Assigned Contract
              </button>
              {contractorAddress && (
                <div className="assigned-contractor-container">
                  <h3>Assigned Contractor</h3>
                  <p>Contractor Address: {contractorAddress}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedContractDetails;
