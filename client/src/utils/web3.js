import Web3 from "web3";

// Function to initialize web3 with MetaMask provider
const initWeb3 = async () => {
  if (window.ethereum) {
    // Modern dapp browsers
    window.web3 = new Web3(window.ethereum);
    try {
      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.error("User denied account access");
      throw error; // Rethrow the error to handle it at a higher level
    }
  } else if (window.web3) {
    // Legacy dapp browsers
    window.web3 = new Web3(window.web3.currentProvider);
  } else {
    // Non-dapp browsers
    console.log(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
    throw new Error("MetaMask not detected");
  }
  return window.web3;
};

// Function to interact with smart contracts using MetaMask
const interactWithContract = async (contract, method, ...args) => {
  const account = window.web3.eth.defaultAccount;
  try {
    // Send transaction to contract method
    const result = await contract.methods[method](...args).send({
      from: account,
    });
    return result;
  } catch (error) {
    console.error("Error interacting with contract:", error);
    throw error; // Rethrow the error to handle it at a higher level
  }
};

export { initWeb3, interactWithContract };
