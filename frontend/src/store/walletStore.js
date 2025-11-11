import React, { useSyncExternalStore } from "react";
import api from "../components/wallet/utils/api";
import { ethers } from "ethers";
function createStore(createState) {
  let state;
  const listeners = new Set();

  const setState = (partial) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    state = { ...state, ...nextState };
    listeners.forEach((listener) => listener());
  };

  const getState = () => state;

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const apiObj = { setState, getState, subscribe };
  state = createState(setState, getState, apiObj);

  const useStore = (selector) =>
    useSyncExternalStore(
      subscribe,
      () => (selector ? selector(state) : state),
      () => (selector ? selector(state) : state)
    );

  return useStore;
}

export const useWalletStore = createStore((set, get) => ({
  screen: "setup",
  walletAddress: "",
  privateKey: "",
  balance: null,
  transactions: [],
  loading: false,
  copied: false,
  showPrivateKey: false,
  notification: null,
  importKey: "",
  recipient: "",
  amount: "",
  txHash: "",
  txStatus: null,
  activeTab: "send",

  // UI actions
  setShowPrivateKey: (showPrivateKey) => set({ showPrivateKey }),
  setImportKey: (importKey) => set({ importKey }),
  setRecipient: (recipient) => set({ recipient }),
  setAmount: (amount) => set({ amount }),
  setActiveTab: (activeTab) => set({ activeTab }),

  showNotification: (message, type = "success") => {
    set({ notification: { message, type } });
    setTimeout(() => set({ notification: null }), 3000);
  },

  // Wallet lifecycle
  loadWalletFromStorage: () => {
    try {
      const storedWallet = localStorage.getItem("wallet");
      if (storedWallet) {
        const { address, key } = JSON.parse(storedWallet);
        set({
          walletAddress: address,
          privateKey: key,
          screen: "dashboard",
        });
      }
    } catch (error) {
      console.error("Failed to load wallet:", error);
    }
  },

  createWallet: async () => {
    set({ loading: true });
    const result = await api.createWallet();

    if (result?.success) {
      set({
        walletAddress: result.data.wallet.address,
        privateKey: result.data.wallet.privateKey,
        screen: "welcome",
      });
      get().showNotification("Wallet created successfully!");
    } else {
      get().showNotification("Failed to create wallet", "error");
    }

    set({ loading: false });
  },

  importWallet: async () => {
    const { importKey } = get();
    set({ loading: true });
    const result = await api.importWallet(importKey);
    if (result?.success) {
      set({
        walletAddress: result?.address,
        privateKey: importKey,
        importKey: "",
        screen: "welcome",
      });
      get().showNotification("Wallet imported successfully!");
    } else {
      get().showNotification("Failed to import wallet", "error");
    }

    set({ loading: false });
  },

  proceedToWallet: () => {
    const { walletAddress, privateKey } = get();
    try {
      localStorage.setItem(
        "wallet",
        JSON.stringify({ address: walletAddress, key: privateKey })
      );
      set({ screen: "dashboard" });
      get().showNotification("Welcome to your wallet!");
    } catch (error) {
      console.error(error);
      get().showNotification("Failed to save wallet", "error");
    }
  },

  fetchBalance: async () => {
    const { walletAddress } = get();
    if (walletAddress) {
      await api.fetchBalance(walletAddress, (balance) => set({ balance }));
    }
  },
  fetchTransactions: async () => {
    const { walletAddress } = get();
    if (!walletAddress) {
      console.log("No wallet address set");
      return;
    }

    set({ loading: true, error: null });

    try {
      const txs = await api.fetchTransactions(walletAddress);
      set({ transactions: txs, loading: false });
      console.log("Fetched transactions:", txs);

      // Extract and save unique recipient addresses from transaction history
      const uniqueAddresses = txs
        .map((tx) => tx.to)
        .filter((addr, idx, arr) => addr && arr.indexOf(addr) === idx);

      uniqueAddresses.forEach((addr) => {
        if (addr && /^0x[a-fA-F0-9]{40}$/.test(addr)) {
          get().addRecentAddress(addr);
        }
      });
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      set({ error: err.message, loading: false });
    }
  },

  sendTransaction: async () => {
    const { privateKey, recipient, amount } = get();
    set({ loading: true });
    const result = await api.sendTransaction(privateKey, recipient, amount);
    console.log("Send transaction result:", result);
    if (result?.success) {
      // Save recipient to recent addresses
      if (recipient && /^0x[a-fA-F0-9]{40}$/.test(recipient)) {
        get().addRecentAddress(recipient);
      }

      set({
        txHash: result.tx.txHash,
        recipient: result.tx.to,
        amount: ethers.formatUnits(result.tx.value, 18),
      });
      get().showNotification("Transaction sent successfully!");

      setTimeout(() => {
        get().fetchBalance();
        get().fetchTransactions();
      }, 2000);
    } else {
      get().showNotification("Transaction failed", "error");
    }

    set({ loading: false });
  },

  addRecentAddress: (address) => {
    try {
      const key = `recentAddresses_${get().walletAddress}`;
      const stored = localStorage.getItem(key);
      const recentAddresses = stored ? JSON.parse(stored) : [];

      // Remove if already exists and add to front
      const filtered = recentAddresses.filter(
        (addr) => addr.toLowerCase() !== address.toLowerCase()
      );
      const updated = [address, ...filtered].slice(0, 10); // Keep only last 10

      localStorage.setItem(key, JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to save recent address:", error);
    }
  },

  getRecentAddresses: () => {
    try {
      const key = `recentAddresses_${get().walletAddress}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
      // Also extract from transaction history
      const { transactions } = get();
      const addressesFromTxs = transactions
        .map((tx) => tx.to)
        .filter((addr, idx, arr) => addr && arr.indexOf(addr) === idx)
        .slice(0, 10);
      return addressesFromTxs;
    } catch (error) {
      console.error("Failed to get recent addresses:", error);
      return [];
    }
  },

  checkTxStatus: async (hash) => {
    const data = await api.checkTxStatus(hash);
    set({ txStatus: data });
  },

  copyToClipboard: (text) => {
    navigator.clipboard.writeText(text);
    set({ copied: true });
    setTimeout(() => set({ copied: false }), 2000);
  },

  resetWallet: () => {
    try {
      localStorage.removeItem("wallet");
    } catch (error) {
      console.log(error, "No wallet to delete");
    }
    set({
      walletAddress: "",
      privateKey: "",
      balance: null,
      transactions: [],
      screen: "setup",
    });
    get().showNotification("Wallet reset successfully!");
  },
}));
