import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  privateKey: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Wallet", walletSchema);
