import { ethers } from "ethers";
import provider from "../utils/ethersProvider.js";
import Wallet from "../models/wallet.js";
import axios from "axios";

const ETHERSCAN_API_BASE = "https://api.etherscan.io/v2/api";
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "";

// send transaction
export const sendTransaction = async (fromPrivateKey, toAddress, amount) => {
  console.log("Sending transaction:", { fromPrivateKey, toAddress, amount });

  const wallet = new ethers.Wallet(fromPrivateKey, provider);
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

export const getWalletHistory = async (address, page = 1, offset = 20) => {
  try {
    // Build URL with all parameters
    const url = `${ETHERSCAN_API_BASE}?chainid=80002&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=${page}&offset=${offset}&sort=desc&apikey=${POLYGONSCAN_API_KEY}`;

    const response = await fetch(url);

    // Check if response is ok (status 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the raw text first to see what we're getting
    const text = await response.text();

    // parse  as JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
    }

    if (!data) {
      throw new Error("No data received from API");
    }

    if (data.status !== "1") {
      const errorMsg = `API Error: ${
        data.message || "Unknown error"
      } (Status: ${data.status})`;
      throw new Error(errorMsg);
    }

    // Check if result is empty
    if (!data.result || data.result.length === 0) {
      return {
        transactions: [],
        totalCount: 0,
      };
    }

    const transactions = data.result.map((tx) => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: tx.value,
      timestamp: parseInt(tx.timeStamp) * 1000,
      blockNumber: parseInt(tx.blockNumber),
      gasUsed: tx.gasUsed,
      gasPrice: tx.gasPrice,
      status: tx.isError === "0" ? "success" : "failed",
      methodId: tx.methodId,
      functionName: tx.functionName,
    }));

    return {
      transactions,
      totalCount: transactions.length,
    };
  } catch (error) {
    throw error;
  }
};
