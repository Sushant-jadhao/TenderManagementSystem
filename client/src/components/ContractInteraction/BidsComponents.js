// BidsComponent.js
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import contractData from "../../contracts/TenderManagement.json";
import "./BidsComponent.css";

function BidsComponent() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [bidsData, setBidsData] = useState({
    bidderAddresses: [],
    bidAmounts: [],
  });
  const [tenderId, setTenderId] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [showBids, setShowBids] = useState(false);

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
          const result = await contract.methods.getAllBids(tenderId).call();
          const bidderAddresses = result[0];
          const bidAmounts = result[1].map((amount) =>
            web3.utils.fromWei(amount, "ether")
          );
          setBidsData({ bidderAddresses, bidAmounts });
        }
      } catch (error) {
        console.error("Error fetching bids:", error);
        setErrorMessage("Failed to fetch bids. Please try again.");
      }
    };

    fetchData();
  }, [contract, tenderId]);

  const handleTenderIdChange = (event) => {
    setTenderId(event.target.value);
  };

  const handleShowBids = () => {
    setShowBids(true);
  };

  return (
    <div className="container">
      <div className="bids-component">
        <h1 className="mb-4">Bids for Tender</h1>
        <div className="form-group">
          <label htmlFor="tenderId">Enter Tender ID:</label>
          <input
            type="number"
            id="tenderId"
            value={tenderId}
            onChange={handleTenderIdChange}
            className="form-control"
          />
        </div>
        <button onClick={handleShowBids} className="btn btn-primary mb-3">
          Show Bids
        </button>
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
        {showBids && (
          <table className="table">
            <thead>
              <tr>
                <th>Bidder Address</th>
                <th>Bid Amount (Ether)</th>
              </tr>
            </thead>
            <tbody>
              {bidsData.bidderAddresses.map((address, index) => (
                <tr key={index}>
                  <td>{address}</td>
                  <td>{bidsData.bidAmounts[index]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default BidsComponent;
