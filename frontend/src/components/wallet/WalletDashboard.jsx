import React from "react";
import WalletCard from "./WalletCard";
import SendForm from "./SendForm";
import TransactionHistory from "./TransactionHistory";
import { Send, Clock, LogOut } from "lucide-react";

export default function WalletDashboard({
  activeTab,
  setActiveTab,
  walletAddress,
  privateKey,
  balance,
  showPrivateKey,
  setShowPrivateKey,
  copied,
  copyToClipboard,
  truncateAddress,
  sendTransaction,
  recipient,
  setRecipient,
  amount,
  setAmount,
  txHash,
  checkTxStatus,
  transactions,
  loading,
  resetWallet,
}) {
  return (
    <div className="space-y-6 relative">
      <WalletCard
        walletAddress={walletAddress}
        privateKey={privateKey}
        balance={balance}
        showPrivateKey={showPrivateKey}
        setShowPrivateKey={setShowPrivateKey}
        copied={copied}
        copyToClipboard={copyToClipboard}
        truncateAddress={truncateAddress}
        resetWallet={resetWallet}
      />

      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("send")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "send"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {/* <Send className="w-4 h-4 inline mr-2" /> */}
          Send
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "history"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {/* <Clock className="w-4 h-4 inline mr-2" /> */}
          History
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        {activeTab === "send" && (
          <SendForm
            sendTransaction={sendTransaction}
            recipient={recipient}
            setRecipient={setRecipient}
            amount={amount}
            setAmount={setAmount}
            txHash={txHash}
            checkTxStatus={checkTxStatus}
            loading={loading}
            truncateAddress={truncateAddress}
          />
        )}

        {activeTab === "history" && (
          <TransactionHistory
            transactions={transactions}
            truncateAddress={truncateAddress}
          />
        )}
      </div>
    </div>
  );
}
