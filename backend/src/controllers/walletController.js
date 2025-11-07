import { ethers } from "ethers";
import * as walletService from "../services/walletService.js";

export const createWallet = async (req, res) => {
  try {
    const wallet = await walletService.createWallet();
    res
      .status(201)
      .json({ success: true, wallet, message: "Wallet created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const importWallet = async (req, res) => {
  try {
    let { privateKey } = req.body;
    console.log("Received private key:", privateKey);

    if (!privateKey) {
      console.log("❌ No private key provided");
      return res
        .status(400)
        .json({ success: false, error: "Private key required" });
    }

    // Trim spaces/newlines
    privateKey = privateKey.trim();

    // Add 0x prefix if missing
    if (!privateKey.startsWith("0x")) {
      privateKey = "0x" + privateKey;
    }

    console.log("Normalized key:", privateKey);

    // Validate key format
    if (!/^0x[a-fA-F0-9]{64}$/.test(privateKey)) {
      console.log("❌ Invalid private key format");
      return res
        .status(400)
        .json({ success: false, error: "Invalid private key format" });
    }

    // Try creating a wallet
    const wallet = new ethers.Wallet(privateKey);
    console.log("✅ Wallet imported:", wallet.address);

    return res
      .status(200)
      .json({ success: true, address: wallet.address, privateKey });
  } catch (err) {
    console.error("❌ Wallet import failed:", err);
    return res
      .status(400)
      .json({ success: false, error: "Invalid private key" });
  }
};

export const getBalance = async (req, res) => {
  try {
    let { address } = req.params;

    // Clean the address
    address = address?.trim();

    if (!address) {
      return res.status(400).json({ error: "Address parameter is required." });
    }

    const balance = await walletService.getBalance(address);
    res.status(200).json({ address, balance });
  } catch (err) {
    console.error("Error in getBalance controller:", err);
    res.status(500).json({ error: err.message });
  }
};
