import React from "react";
import WalletCard from "./WalletCard";
import SendForm from "./SendForm";
import TransactionHistory from "./TransactionHistory";
import { Send, Clock } from "lucide-react";

export default function WalletDashboard({
  activeTab,
  setActiveTab,
  walletAddress,
  balance,
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
  fetchBalance,
  getRecentAddresses,
}) {
  return (
    <div className="flex flex-col h-full relative w-full max-w-4xl mx-auto">
      {/* Single Unified Container */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-200 flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Wallet Info Section */}
        <div className="shrink-0 p-8 border-b border-gray-200">
          <WalletCard
            walletAddress={walletAddress}
            balance={balance}
            copied={copied}
            copyToClipboard={copyToClipboard}
            truncateAddress={truncateAddress}
            resetWallet={resetWallet}
            fetchBalance={fetchBalance}
          />
        </div>

        {/* Tab Navigation */}
        <div className="shrink-0 px-8 pt-6 pb-4">
          <div className="flex gap-1 bg-gray-50 rounded-2xl p-1.5">
            <button
              onClick={() => setActiveTab("send")}
              className={`relative flex-1 flex items-center justify-center gap-2 px-6 py-3.5 font-medium rounded-xl transition-all duration-300 ${
                activeTab === "send"
                  ? "text-white bg-black shadow-sm"
                  : "text-gray-600 hover:text-black hover:bg-white"
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`relative flex-1 flex items-center justify-center gap-2 px-6 py-3.5 font-medium rounded-xl transition-all duration-300 ${
                activeTab === "history"
                  ? "text-white bg-black shadow-sm"
                  : "text-gray-600 hover:text-black hover:bg-white"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>History</span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto min-h-0 px-8 pb-8 w-full">
          <div className="w-full">
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
                balance={balance}
                getRecentAddresses={getRecentAddresses}
              />
            )}

            {activeTab === "history" && (
              <TransactionHistory
                transactions={transactions}
                truncateAddress={truncateAddress}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
