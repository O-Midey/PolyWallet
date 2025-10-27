import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
export const solidity = {
  version: "0.8.20",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};
export const networks = {
  // Polygon Mumbai Testnet
  polygonMumbai: {
    url: process.env.RPC_URL || "https://rpc-mumbai.maticvigil.com",
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    chainId: 80001,
    gasPrice: 20000000000, // 20 gwei
  },

  // Polygon Mainnet
  polygon: {
    url: process.env.MAINNET_RPC_URL || "https://polygon-rpc.com",
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    chainId: 137,
    gasPrice: 50000000000, // 50 gwei
  },

  // Local Hardhat network for testing
  hardhat: {
    chainId: 1337,
  },
};
export const etherscan = {
  apiKey: {
    polygon: process.env.POLYGONSCAN_API_KEY || "",
    polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
  },
};
export const paths = {
  sources: "./contracts",
  tests: "./test",
  cache: "./cache",
  artifacts: "./artifacts",
};
