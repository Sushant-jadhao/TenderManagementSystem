// TenderBids.js
import React, { useState, useEffect } from "react";
// import { interactWithContract } from "../utils/web3"; // Import the function for interacting with the smart contract
import { interactWithContract } from "../../utils/web3";
const TenderBids = ({ contract, tenderId }) => {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        // Call the smart contract function to retrieve bids for the tender
        const numBids = await interactWithContract(
          contract,
          "getTotalBids",
          tenderId
        );
        const bids = [];
        for (let i = 0; i < numBids; i++) {
          const bid = await interactWithContract(
            contract,
            "getBidAmount",
            tenderId,
            i
          );
          bids.push(bid);
        }
        setBids(bids);
      } catch (error) {
        console.error("Error fetching bids:", error);
      }
    };

    fetchBids();
  }, [contract, tenderId]);

  return (
    <div>
      <h2>Bids for Tender</h2>
      <ul>
        {bids.map((bid, index) => (
          <li key={index}>Bid Amount: {bid}</li>
        ))}
      </ul>
    </div>
  );
};

export default TenderBids;
