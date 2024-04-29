import React, { useState, useEffect } from "react";
import Web3 from "web3";
import contractData from "../../contracts/TenderManagement.json";
import "./TendersComponent.css";

async function getAllTenders(contractInstance) {
  try {
    const result = await contractInstance.methods.getAllTenders().call();
    const tenderIds = result[0];
    const governmentOfficials = result[1];
    const descriptions = result[2];
    const deadlines = result[3];
    const budgets = result[4];
    const totalBids = result[5];
    const statuses = result[6];

    const tenders = tenderIds.map((tenderId, index) => ({
      tenderId,
      governmentOfficial: governmentOfficials[index],
      description: descriptions[index],
      deadline: deadlines[index],
      budget: budgets[index],
      totalBids: totalBids[index],
      status: statuses[index],
    }));

    return tenders;
  } catch (error) {
    console.error("Error fetching tenders:", error);
    throw new Error("Failed to fetch tenders. Please try again.");
  }
}

function TendersComponent() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [tenders, setTenders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showTenders, setShowTenders] = useState(false);

  useEffect(() => {
    const loadContract = async () => {
      try {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        setWeb3(web3Instance);

        const networkId = await web3Instance.eth.net.getId();
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

  const handleShowTenders = async () => {
    try {
      const fetchedTenders = await getAllTenders(contract);
      setTenders(fetchedTenders);
      setShowTenders(true);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container">
      <div className="tenders-component">
        <h1 className="mb-4">All Tenders</h1>
        <button onClick={handleShowTenders} className="btn btn-primary mb-3">
          Show Tenders
        </button>
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
        {showTenders && (
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Tender ID</th>
                  {/* <th>Tender ID</th> */}
                  <th>Government Official</th>
                  <th>Description</th>
                  <th>Deadline</th>
                  <th>Budget</th>
                  <th>Total Bids</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tenders.map((tender, index) => (
                  <tr key={index}>
                    <td>{index}</td>
                    {/* <td>{tender.tenderId}</td> */}
                    <td>{tender.governmentOfficial}</td>
                    <td>{tender.description}</td>
                    <td>
                      {new Date(
                        parseInt(tender.deadline) * 1000
                      ).toLocaleString()}
                    </td>
                    <td>
                      {web3.utils.fromWei(tender.budget.toString(), "ether")}{" "}
                      ETH
                    </td>
                    <td>{tender.totalBids}</td>
                    <td>{tender.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default TendersComponent;
