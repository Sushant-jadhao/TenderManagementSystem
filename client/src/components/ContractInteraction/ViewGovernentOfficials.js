// ViewGovernmentOfficials.js
import React, { useState, useEffect } from "react";
// import { interactWithContract } from "../utils/web3"; // Import the function for interacting with the smart contract
import { interactWithContract } from "../../utils/web3";
const ViewGovernmentOfficials = ({ contract }) => {
  const [officials, setOfficials] = useState([]);

  useEffect(() => {
    const fetchOfficials = async () => {
      try {
        // Call the smart contract function to retrieve government officials
        const numOfficials = await interactWithContract(
          contract,
          "getNumberOfGovernmentOfficials"
        );
        const officials = [];
        for (let i = 0; i < numOfficials; i++) {
          const official = await interactWithContract(
            contract,
            "getGovernmentOfficialByIndex",
            i
          );
          officials.push(official);
        }
        setOfficials(officials);
      } catch (error) {
        console.error("Error fetching government officials:", error);
      }
    };

    fetchOfficials();
  }, [contract]);

  return (
    <div>
      <h2>Government Officials</h2>
      <ul>
        {officials.map((official, index) => (
          <li key={index}>{official}</li>
        ))}
      </ul>
    </div>
  );
};

export default ViewGovernmentOfficials;
