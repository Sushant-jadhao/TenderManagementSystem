import React, { useState, useEffect } from "react";
import Web3 from "web3";
import TenderManagementContract from "../../contracts/TenderManagement.json";

const AssignContractForm = () => {
  const [tenderId, setTenderId] = useState("");
  const [contractorAddress, setContractorAddress] = useState("");
  const [contractInstance, setContractInstance] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    initializeWeb3();
  }, []);

  const initializeWeb3 = async () => {
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = TenderManagementContract.networks[networkId];
        const contract = new web3.eth.Contract(
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
    if (!tenderId || !contractorAddress || !contractInstance) return;

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const currentAccount = accounts[0];

      await contractInstance.methods
        .assignContract(tenderId, contractorAddress)
        .send({ from: currentAccount });

      setTenderId("");
      setContractorAddress("");
      alert("Contract assigned successfully!");
    } catch (error) {
      console.error("Error assigning contract:", error);
      alert("Failed to assign contract. Please try again.");
    }
  };

  return (
    <div>
      <h2>Assign Contract</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="tenderId">Tender ID:</label>
          <br />
          <input
            type="number"
            id="tenderId"
            value={tenderId}
            onChange={(e) => setTenderId(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="contractorAddress">Contractor Address:</label>
          <input
            type="text"
            id="contractorAddress"
            value={contractorAddress}
            onChange={(e) => setContractorAddress(e.target.value)}
          />
        </div>
        <button type="submit">Assign Contract</button>
      </form>
      {errorMessage && <div>{errorMessage}</div>}
    </div>
  );
};

export default AssignContractForm;
