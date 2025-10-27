import express from "express";
import {
  sendTransaction,
  getTransactionStatus,
  getWalletHistory,
} from "../controllers/transactionController.js";

const router = express.Router();

router.post("/send", sendTransaction);
router.get("/:hash/status", getTransactionStatus);
router.get("/:address/history", getWalletHistory);

export default router;
