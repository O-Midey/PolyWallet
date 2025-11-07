import React from "react";
import { Send, Loader } from "lucide-react";

export default function SendForm({
  sendTransaction,
  recipient,
  setRecipient,
  amount,
  setAmount,
  txHash,
  checkTxStatus,
  loading,
  truncateAddress,
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Send MATIC</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recipient Address
        </label>
        <input
          type="text"
          placeholder="0x..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount (MATIC)
        </label>
        <input
          type="number"
          step="0.001"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
        />
      </div>
      <button
        onClick={sendTransaction}
        disabled={loading || !recipient || !amount}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <Loader className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}{" "}
        Send Transaction
      </button>

      {txHash && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-sm font-medium text-green-800 mb-2">
            Transaction Sent!
          </p>
          <div className="flex items-center gap-2">
            <p className="text-xs text-green-700 font-mono">
              {truncateAddress(txHash)}
            </p>
            <button
              onClick={() => checkTxStatus(txHash)}
              className="text-xs text-green-700 hover:text-green-900"
            >
              Check Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
