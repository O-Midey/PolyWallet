// lib/api.js
const API_BASE = "http://localhost:3000/api";

const api = {
  createWallet: async () => {
    try {
      const res = await fetch(`${API_BASE}/wallet/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "user_" + Date.now() }),
      });
      const data = await res.json();
      return { success: true, data };
    } catch (err) {
      console.error("Create wallet failed:", err);
      return { success: false, err };
    }
  },

  importWallet: async (privateKey) => {
    console.log("Sending to backend:", { privateKey });
    const res = await fetch(`${API_BASE}/wallet/import`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ privateKey }),
    });
    const data = await res.json();
    console.log("Backend response:", data);
    return data;
  },

  fetchBalance: async (walletAddress, setBalance) => {
    try {
      const res = await fetch(`${API_BASE}/wallet/${walletAddress}/balance`);
      const data = await res.json();
      setBalance(data.balance);
    } catch (err) {
      console.error("Fetch balance failed:", err);
    }
  },

  fetchTransactions: async (address) => {
    try {
      const res = await fetch(`${API_BASE}/transaction/${address}/history`);
      const data = await res.json();
      console.log("Fetched transactions data for:", address, data);
      return data.history || [];
    } catch (err) {
      console.error("Fetch transactions failed:", err);
      return [];
    }
  },

  sendTransaction: async (fromPrivateKey, to, amount) => {
    try {
      const res = await fetch(`${API_BASE}/transaction/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: fromPrivateKey, to, amount }),
      });
      return await res.json();
    } catch (err) {
      console.error("Send transaction failed:", err);
      return { err };
    }
  },

  checkTxStatus: async (hash) => {
    try {
      const res = await fetch(`${API_BASE}/transaction/${hash}/status`);
      return await res.json();
    } catch (err) {
      console.error("Check tx status failed:", err);
      return err;
    }
  },
};

export default api;
