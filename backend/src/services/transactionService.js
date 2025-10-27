import { ethers } from "ethers";
import provider from "../utils/ethersProvider.js";
import Wallet from "../models/wallet.js";

// send transaction
export const sendTransaction = async (fromAddress, toAddress, amount) => {
  const sender = await Wallet.findOne({ address: fromAddress.toLowerCase() });
  if (!sender) throw new Error("Wallet not found");

  const wallet = new ethers.Wallet(sender.privateKey, provider);
  const tx = await wallet.sendTransaction({
    to: toAddress,
    value: ethers.parseEther(amount),
  });

  return tx;
};

// get transaction status
export const getTransactionStatus = async (hash) => {
  const tx = await provider.getTransaction(hash);
  if (!tx) return { status: "pending" };

  const receipt = await provider.getTransactionReceipt(hash);
  const status = receipt
    ? receipt.status === 1
      ? "success"
      : "failed"
    : "pending";

  return {
    hash: tx.hash,
    status,
    from: tx.from,
    to: tx.to,
    value: ethers.formatEther(tx.value),
    gasLimit: tx.gasLimit.toString(),
    gasPrice: ethers.formatUnits(tx.gasPrice, "gwei"),
    nonce: tx.nonce,
    blockNumber: tx.blockNumber,
    blockHash: tx.blockHash,
    cumulativeGasUsed: receipt?.cumulativeGasUsed.toString(),
    gasUsed: receipt?.gasUsed.toString(),
    logs: receipt?.logs || [],
    timestamp: receipt
      ? (await provider.getBlock(receipt.blockNumber)).timestamp
      : null,
  };
};

// get wallet history (basic)
export const getWalletHistory = async (address) => {
  const history = await provider.getLogs({
    address,
    fromBlock: "latest",
  });
  return history;
};
