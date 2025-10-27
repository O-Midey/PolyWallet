import walletService from "../services/walletService.js";

describe("WalletService", () => {
  describe("createWallet", () => {
    test("should create a new wallet with valid address and mnemonic", () => {
      const wallet = walletService.createWallet();

      expect(wallet).toHaveProperty("address");
      expect(wallet).toHaveProperty("mnemonic");
      expect(wallet).toHaveProperty("encryptedPrivateKey");
      expect(wallet.address).toMatch(/^0x[a-fA-F0-9]{40}$/);
      expect(wallet.mnemonic.split(" ").length).toBeGreaterThanOrEqual(12);
    });

    test("should create unique wallets on each call", () => {
      const wallet1 = walletService.createWallet();
      const wallet2 = walletService.createWallet();

      expect(wallet1.address).not.toBe(wallet2.address);
      expect(wallet1.mnemonic).not.toBe(wallet2.mnemonic);
    });
  });

  describe("importWallet", () => {
    test("should import wallet from valid mnemonic", () => {
      const originalWallet = walletService.createWallet();
      const importedWallet = walletService.importWallet(
        originalWallet.mnemonic
      );

      expect(importedWallet.address).toBe(originalWallet.address);
    });

    test("should throw error for invalid mnemonic", () => {
      expect(() => {
        walletService.importWallet("invalid mnemonic phrase");
      }).toThrow();
    });
  });

  describe("isValidAddress", () => {
    test("should validate correct Ethereum address", () => {
      const wallet = walletService.createWallet();
      expect(walletService.isValidAddress(wallet.address)).toBe(true);
    });

    test("should reject invalid addresses", () => {
      expect(walletService.isValidAddress("0x123")).toBe(false);
      expect(walletService.isValidAddress("invalid")).toBe(false);
      expect(walletService.isValidAddress("")).toBe(false);
    });
  });

  describe("encryption/decryption", () => {
    test("should encrypt and decrypt data correctly", () => {
      const originalData = "sensitive-private-key";
      const key = "test-encryption-key";

      const encrypted = walletService.encryptData(originalData, key);
      const decrypted = walletService.decryptData(encrypted, key);

      expect(encrypted).not.toBe(originalData);
      expect(decrypted).toBe(originalData);
    });

    test("should produce different encrypted output each time", () => {
      const data = "test-data";
      const key = "test-key";

      const encrypted1 = walletService.encryptData(data, key);
      const encrypted2 = walletService.encryptData(data, key);

      expect(encrypted1).not.toBe(encrypted2);
    });
  });

  // Integration tests

  describe("blockchain operations", () => {
    const TEST_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";
    const TEST_TOKEN = "0x0000000000000000000000000000000000001010"; // MATIC token on Polygon

    test("should fetch native balance", async () => {
      const balance = await walletService.getNativeBalance(TEST_ADDRESS);

      expect(balance).toHaveProperty("address");
      expect(balance).toHaveProperty("balance");
      expect(balance).toHaveProperty("currency", "MATIC");
    }, 10000); // 10 second timeout

    test("should throw error for invalid address when fetching balance", async () => {
      await expect(
        walletService.getNativeBalance("invalid-address")
      ).rejects.toThrow();
    });
  });
});
