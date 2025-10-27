import { ethers } from "ethers";
import Wallet from "../models/wallet.js";
import provider from "../utils/ethersProvider.js";

// create a new wallet
export const createWallet = async () => {
  const wallet = ethers.Wallet.createRandom();
  const newWallet = await Wallet.create({
    address: wallet.address.toLowerCase(),
    privateKey: wallet.privateKey,
  });
  return newWallet;
};

// import existing wallet using private key
export const importWallet = async (privateKey) => {
  const wallet = new ethers.Wallet(privateKey);
  let existing = await Wallet.findOne({ address: wallet.address });
  if (!existing) {
    existing = await Wallet.create({ address: wallet.address, privateKey });
  }
  return existing;
};

// get balance
// export const getBalance = async (address) => {
//   // Validate and normalize the address
//   if (!ethers.isAddress(address)) {
//     throw new Error(
//       "Invalid address format. Please provide a valid Ethereum address (0x...)"
//     );
//   }

//   const normalizedAddress = ethers.getAddress(address);

//   const balance = await provider.getBalance(normalizedAddress);
//   return ethers.formatEther(balance);
// };

// get balance
export const getBalance = async (address) => {
  // Normalize and validate the address
  try {
    const validAddress = ethers.getAddress(address.trim());
    const balance = await provider.getBalance(validAddress);
    return ethers.formatEther(balance);
  } catch (error) {
    if (error.code === "INVALID_ARGUMENT") {
      throw new Error(
        "Invalid address format. Please provide a valid Ethereum address (0x...)"
      );
    }
    throw error;
  }
};
