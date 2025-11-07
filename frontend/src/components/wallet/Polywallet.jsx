import React, { useEffect } from "react";
import { useWalletStore } from "../../store/walletStore";

const truncateAddress = (address) => {
  if (!address) return "";
  return address.slice(0, 6) + "..." + address.slice(-4);
};

const Notification = ({ notification }) => (
  <div
    className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
      notification.type === "success" ? "bg-green-500" : "bg-red-500"
    } text-white font-semibold z-50 animate-slide-in`}
  >
    {notification.message}
  </div>
);

const WalletSetup = ({
  createWallet,
  importWallet,
  loading,
  importKey,
  setImportKey,
}) => (
  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
    <h1 className="text-4xl font-bold text-white mb-2">PolyWallet</h1>
    <p className="text-gray-400 mb-6 text-sm">Secure Polygon Wallet</p>

    <button
      onClick={createWallet}
      disabled={loading}
      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 mb-4 transition-all"
    >
      {loading ? "Creating..." : "Create New Wallet"}
    </button>

    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-600"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-2 bg-black/50 text-gray-400">or</span>
      </div>
    </div>

    <input
      type="password"
      value={importKey}
      onChange={(e) => setImportKey(e.target.value)}
      placeholder="Enter private key to import"
      className="w-full bg-black/30 text-white px-4 py-3 rounded-lg mb-3 border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
    />
    <button
      onClick={importWallet}
      disabled={loading || !importKey}
      className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 font-semibold transition-all"
    >
      {loading ? "Importing..." : "Import Wallet"}
    </button>
  </div>
);

const WalletWelcome = ({
  walletAddress,
  privateKey,
  copied,
  copyToClipboard,
  showPrivateKey,
  setShowPrivateKey,
  proceedToWallet,
}) => (
  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
    <div className="text-center mb-6">
      <div className="inline-block p-3 bg-green-500/20 rounded-full mb-3">
        <svg
          className="w-12 h-12 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-white">Wallet Created!</h2>
      <p className="text-gray-400 mt-2">Save your private key securely</p>
    </div>

    <div className="mb-4 bg-black/30 p-4 rounded-lg">
      <p className="text-gray-400 text-sm mb-2">Wallet Address</p>
      <div className="flex gap-2 items-center">
        <p className="text-white font-mono text-sm break-all flex-1">
          {truncateAddress(walletAddress)}
        </p>
        <button
          onClick={() => copyToClipboard(walletAddress)}
          className="bg-blue-500 px-3 py-2 rounded text-white text-sm hover:bg-blue-600 transition-colors flex-shrink-0"
        >
          {copied ? "✓" : "Copy"}
        </button>
      </div>
    </div>

    <div className="mb-6 bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
      <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
        <svg
          className="w-4 h-4 text-red-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        Private Key (Keep Secret!)
      </p>
      <button
        onClick={() => setShowPrivateKey(!showPrivateKey)}
        className="text-blue-400 text-sm mb-2 hover:text-blue-300 transition-colors"
      >
        {showPrivateKey ? "Hide" : "Show"} Private Key
      </button>
      {showPrivateKey && (
        <p className="text-white font-mono text-xs break-all bg-black/50 p-3 rounded mt-2">
          {privateKey}
        </p>
      )}
    </div>

    <button
      onClick={proceedToWallet}
      className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-all"
    >
      Go to Wallet Dashboard
    </button>
  </div>
);

const WalletDashboard = ({
  walletAddress,
  balance,
  copied,
  copyToClipboard,
  sendTransaction,
  recipient,
  setRecipient,
  amount,
  setAmount,
  loading,
  resetWallet,
  transactions,
  activeTab,
  setActiveTab,
}) => (
  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
    <h2 className="text-2xl font-bold text-white mb-6">Wallet Dashboard</h2>

    <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg p-4 mb-4 border border-purple-500/30">
      <p className="text-gray-400 text-sm mb-2">Your Address</p>
      <div className="flex gap-2 items-center">
        <p className="text-white font-mono text-sm break-all flex-1">
          {truncateAddress(walletAddress)}
        </p>
        <button
          onClick={() => copyToClipboard(walletAddress)}
          className="bg-blue-500 px-3 py-2 rounded text-white text-sm hover:bg-blue-600 transition-colors"
        >
          {copied ? "✓" : "Copy"}
        </button>
      </div>
    </div>

    <div className="bg-black/30 rounded-lg p-6 mb-6 text-center">
      <p className="text-gray-400 text-sm mb-2">Balance</p>
      <p className="text-white text-4xl font-bold">
        {Number(balance).toFixed(6) || "0.00"}
      </p>
      <p className="text-gray-400 text-sm mt-1">POL</p>
    </div>

    <div className="flex gap-2 mb-6 border-b border-gray-700">
      <button
        onClick={() => setActiveTab("wallet")}
        className={`px-4 py-2 font-semibold transition-colors ${
          activeTab === "wallet"
            ? "text-blue-500 border-b-2 border-blue-500"
            : "text-gray-400 hover:text-gray-300"
        }`}
      >
        Send
      </button>
      <button
        onClick={() => setActiveTab("history")}
        className={`px-4 py-2 font-semibold transition-colors ${
          activeTab === "history"
            ? "text-blue-500 border-b-2 border-blue-500"
            : "text-gray-400 hover:text-gray-300"
        }`}
      >
        History
      </button>
    </div>

    {activeTab === "wallet" && (
      <div className="mb-4">
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Recipient address (0x...)"
          className="w-full bg-black/30 text-white px-4 py-3 rounded-lg mb-3 border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
        />
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount (POL)"
          className="w-full bg-black/30 text-white px-4 py-3 rounded-lg mb-3 border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
        />
        <button
          onClick={sendTransaction}
          disabled={loading || !recipient || !amount}
          className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 font-semibold transition-all"
        >
          {loading ? "Sending..." : "Send Transaction"}
        </button>
      </div>
    )}

    {activeTab === "history" && (
      <div className="mb-4">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx, idx) => (
              <div key={idx} className="bg-black/30 p-3 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">To:</span>
                  <span className="text-white font-mono">
                    {truncateAddress(tx.to)}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white">{tx.value} POL</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )}

    <button
      onClick={resetWallet}
      className="w-full bg-red-500/80 text-white py-2 rounded-lg hover:bg-red-500 transition-all"
    >
      Reset Wallet
    </button>
  </div>
);

export default function PolyWallet() {
  const state = useWalletStore();

  useEffect(() => {
    state.loadWalletFromStorage();
  }, []);

  useEffect(() => {
    if (state.walletAddress && state.screen === "dashboard") {
      state.fetchBalance();
      state.fetchTransactions();
    }
  }, [state.walletAddress, state.screen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      {state.notification && <Notification notification={state.notification} />}

      <div className="max-w-md mx-auto min-h-screen px-4 py-8">
        {state.screen === "setup" && (
          <WalletSetup
            createWallet={state.createWallet}
            importWallet={state.importWallet}
            loading={state.loading}
            importKey={state.importKey}
            setImportKey={state.setImportKey}
          />
        )}

        {state.screen === "welcome" && (
          <WalletWelcome
            walletAddress={state.walletAddress}
            privateKey={state.privateKey}
            copied={state.copied}
            copyToClipboard={state.copyToClipboard}
            showPrivateKey={state.showPrivateKey}
            setShowPrivateKey={state.setShowPrivateKey}
            proceedToWallet={state.proceedToWallet}
          />
        )}

        {state.screen === "dashboard" && (
          <WalletDashboard
            activeTab={state.activeTab}
            setActiveTab={state.setActiveTab}
            walletAddress={state.walletAddress}
            balance={state.balance}
            copied={state.copied}
            copyToClipboard={state.copyToClipboard}
            sendTransaction={state.sendTransaction}
            recipient={state.recipient}
            setRecipient={state.setRecipient}
            amount={state.amount}
            setAmount={state.setAmount}
            loading={state.loading}
            resetWallet={state.resetWallet}
            transactions={state.transactions}
          />
        )}
      </div>
    </div>
  );
}
