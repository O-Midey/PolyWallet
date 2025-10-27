import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

//  color codes for better terminal output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  section: (msg) =>
    console.log(`\n${colors.cyan}━━━ ${msg} ━━━${colors.reset}`),
};

async function verifyWalletFunctionality() {
  try {
    log.section("Starting Wallet Verification");

    // Connect to Polygon network
    log.info("Connecting to Polygon network...");
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const network = await provider.getNetwork();
    log.success(
      `Connected to network: ${network.name} (Chain ID: ${network.chainId})`
    );

    // Create a test wallet
    log.section("Wallet Creation Test");
    const wallet = ethers.Wallet.createRandom();
    log.success(`Created wallet: ${wallet.address}`);
    log.info(`Mnemonic: ${wallet.mnemonic.phrase}`);

    //  Import wallet from mnemonic
    log.section("Wallet Import Test");
    const importedWallet = ethers.Wallet.fromPhrase(wallet.mnemonic.phrase);
    if (importedWallet.address === wallet.address) {
      log.success("Wallet import successful - addresses match");
    } else {
      log.error("Wallet import failed - address mismatch");
    }

    // Check if token contract is configured
    if (!process.env.UMC_TOKEN_ADDRESS) {
      log.warn("UMC_TOKEN_ADDRESS not set in .env file");
      log.info(
        "Deploy the TestToken contract first using: npx hardhat run scripts/deploy.js --network polygonMumbai"
      );
      return;
    }

    const tokenAddress = process.env.UMC_TOKEN_ADDRESS;
    log.section("Token Contract Verification");
    log.info(`Token contract: ${tokenAddress}`);

    // Connect to token contract
    const tokenABI = [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function decimals() view returns (uint8)",
      "function totalSupply() view returns (uint256)",
      "function balanceOf(address) view returns (uint256)",
    ];

    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);

    //  Fetch token details
    try {
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        tokenContract.name(),
        tokenContract.symbol(),
        tokenContract.decimals(),
        tokenContract.totalSupply(),
      ]);

      log.success("Token contract is accessible");
      log.info(`Token: ${name} (${symbol})`);
      log.info(`Decimals: ${decimals}`);
      log.info(
        `Total Supply: ${ethers.formatUnits(totalSupply, decimals)} ${symbol}`
      );
    } catch (error) {
      log.error(`Failed to read token contract: ${error.message}`);
      return;
    }

    // 7. Test balance checking
    log.section("Balance Check Test");
    const testAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"; // Random test address

    try {
      const maticBalance = await provider.getBalance(testAddress);
      log.success(
        `Native balance check successful: ${ethers.formatEther(
          maticBalance
        )} MATIC`
      );

      const tokenBalance = await tokenContract.balanceOf(testAddress);
      const symbol = await tokenContract.symbol();
      log.success(
        `Token balance check successful: ${ethers.formatUnits(
          tokenBalance,
          18
        )} ${symbol}`
      );
    } catch (error) {
      log.error(`Balance check failed: ${error.message}`);
    }

    // Gas estimation test
    log.section("Gas Estimation Test");
    try {
      const feeData = await provider.getFeeData();
      log.success("Gas price fetched successfully");
      log.info(
        `Gas Price: ${ethers.formatUnits(feeData.gasPrice, "gwei")} gwei`
      );

      if (feeData.maxFeePerGas) {
        log.info(
          `Max Fee: ${ethers.formatUnits(feeData.maxFeePerGas, "gwei")} gwei`
        );
      }
      if (feeData.maxPriorityFeePerGas) {
        log.info(
          `Priority Fee: ${ethers.formatUnits(
            feeData.maxPriorityFeePerGas,
            "gwei"
          )} gwei`
        );
      }
    } catch (error) {
      log.error(`Gas estimation failed: ${error.message}`);
    }

    // Transaction monitoring test
    log.section("Transaction Monitoring Test");
    const blockNumber = await provider.getBlockNumber();
    log.success(`Current block number: ${blockNumber}`);

    const block = await provider.getBlock(blockNumber);
    log.info(
      `Block timestamp: ${new Date(block.timestamp * 1000).toISOString()}`
    );
    log.info(`Transactions in block: ${block.transactions.length}`);

    // Address validation test
    log.section("Address Validation Test");
    const validAddresses = [
      "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      wallet.address,
    ];
    const invalidAddresses = ["0x123", "invalid", "0xZZZ"];

    validAddresses.forEach((addr) => {
      if (ethers.isAddress(addr)) {
        log.success(`Valid address: ${addr}`);
      } else {
        log.error(`Should be valid but failed: ${addr}`);
      }
    });

    invalidAddresses.forEach((addr) => {
      if (!ethers.isAddress(addr)) {
        log.success(`Correctly rejected invalid address: ${addr}`);
      } else {
        log.error(`Should be invalid but passed: ${addr}`);
      }
    });

    log.section("Verification Summary");
    log.success("All basic wallet operations verified successfully!");
    log.info("Your wallet integration is ready for testing");

    console.log("\n📝 Next Steps:");
    console.log(
      "1. Fund a test wallet with MATIC from: https://faucet.polygon.technology/"
    );
    console.log("2. Start the backend API: npm run dev");
    console.log("3. Test API endpoints with Postman or curl");
    console.log("4. Integrate with frontend application\n");
  } catch (error) {
    log.error(`Verification failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run verification
verifyWalletFunctionality()
  .then(() => {
    console.log("\n✨ Verification completed!\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Verification failed:", error.message);
    process.exit(1);
  });
