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
    const { privateKey } = req.body;
    const wallet = await walletService.importWallet(privateKey);
    res
      .status(200)
      .json({ success: true, wallet, message: "Wallet imported successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
