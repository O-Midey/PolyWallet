import hre from "hardhat";
import fs from "fs";

async function main() {
  console.log("🚀 Starting TestToken (UMC) deployment...\n");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contract with account:", deployer.address);

  // Check deployer balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(
    "💰 Account balance:",
    hre.ethers.formatEther(balance),
    "MATIC\n"
  );

  if (balance === 0n) {
    console.error("❌ Error: Deployer account has no MATIC for gas fees");
    console.log(
      "💡 Get testnet MATIC from: https://faucet.polygon.technology/"
    );
    process.exit(1);
  }

  // Initial supply (1 million tokens)
  const INITIAL_SUPPLY = 1_000_000;

  // Deploy the contract
  console.log("📦 Deploying TestToken contract...");
  const TestToken = await hre.ethers.getContractFactory("TestToken");
  const token = await TestToken.deploy(INITIAL_SUPPLY);

  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();

  console.log("✅ TestToken deployed successfully!");
  console.log("📍 Contract address:", tokenAddress);

  // Get contract details
  const name = await token.name();
  const symbol = await token.symbol();
  const decimals = await token.decimals();
  const totalSupply = await token.totalSupply();
  const deployerBalance = await token.balanceOf(deployer.address);

  console.log("\n📊 Token Details:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Name:", name);
  console.log("Symbol:", symbol);
  console.log("Decimals:", decimals.toString());
  console.log(
    "Total Supply:",
    hre.ethers.formatUnits(totalSupply, decimals),
    symbol
  );
  console.log(
    "Deployer Balance:",
    hre.ethers.formatUnits(deployerBalance, decimals),
    symbol
  );
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Get network info
  const network = await hre.ethers.provider.getNetwork();
  const networkName =
    network.name === "unknown" ? "Custom Network" : network.name;

  console.log("🌐 Network Information:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Network:", networkName);
  console.log("Chain ID:", network.chainId.toString());

  // Provide explorer links
  if (network.chainId === 80001n) {
    console.log(
      "🔍 View on PolygonScan:",
      `https://mumbai.polygonscan.com/address/${tokenAddress}`
    );
    console.log(
      "🔍 Verify contract:",
      `npx hardhat verify --network polygonMumbai ${tokenAddress} ${INITIAL_SUPPLY}`
    );
  } else if (network.chainId === 137n) {
    console.log(
      "🔍 View on PolygonScan:",
      `https://polygonscan.com/address/${tokenAddress}`
    );
    console.log(
      "🔍 Verify contract:",
      `npx hardhat verify --network polygon ${tokenAddress} ${INITIAL_SUPPLY}`
    );
  }
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Save deployment info

  const deploymentInfo = {
    network: networkName,
    chainId: network.chainId.toString(),
    contractAddress: tokenAddress,
    deployerAddress: deployer.address,
    tokenName: name,
    tokenSymbol: symbol,
    decimals: decimals.toString(),
    totalSupply: totalSupply.toString(),
    deploymentDate: new Date().toISOString(),
    initialSupply: INITIAL_SUPPLY,
  };

  const deploymentsDir = "./deployments";
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  const filename = `${deploymentsDir}/${networkName}-${Date.now()}.json`;
  fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Deployment info saved to:", filename);

  console.log("\n✨ Deployment completed successfully!");
  console.log("🔧 Update your .env file with:");
  console.log(`UMC_TOKEN_ADDRESS=${tokenAddress}\n`);
}

// Error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
