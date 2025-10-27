import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const provider = new ethers.JsonRpcProvider(
  "https://polygon-amoy.g.alchemy.com/v2/pk_ka94Za-Qyxi4Pb6xYm"
);

export default provider;
