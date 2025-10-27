import * as txService from "../services/transactionService.js";

export const sendTransaction = async (req, res) => {
  try {
    const { from, to, amount } = req.body;
    const tx = await txService.sendTransaction(from, to, amount);
    res.status(200).json({ success: true, tx });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTransactionStatus = async (req, res) => {
  try {
    const { hash } = req.params;
    const status = await txService.getTransactionStatus(hash);
    res.status(200).json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWalletHistory = async (req, res) => {
  try {
    const { address } = req.params;
    const history = await txService.getWalletHistory(address);
    res.status(200).json({ address, history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
