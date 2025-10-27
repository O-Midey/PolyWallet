import express from "express";
import {
  createWallet,
  importWallet,
  getBalance,
} from "../controllers/walletController.js";

const router = express.Router();

router.post("/create", createWallet);
router.post("/import", importWallet);
router.get("/:address/balance", getBalance);

export default router;
