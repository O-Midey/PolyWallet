import React from "react";
import { Wallet, Eye, EyeOff, Copy, Check, LogOut } from "lucide-react";

export default function WalletCard({
  walletAddress,
  privateKey,
  balance,
  showPrivateKey,
  setShowPrivateKey,
  copied,
  copyToClipboard,
  truncateAddress,
  resetWallet,
}) {
  return (
    <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-purple-200 text-sm mb-1">Wallet Address</p>
          <div className="flex items-center gap-2">
            <p className="text-xl font-mono">
              {truncateAddress(walletAddress)}
            </p>
            <button
              onClick={() => copyToClipboard(walletAddress)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        <Wallet className="w-8 h-8 opacity-80" />
      </div>

      <div className="mb-4">
        <p className="text-purple-200 text-sm mb-1">Balance</p>
        <p className="text-4xl font-bold">
          {balance || "0.00"} <span className="text-2xl">MATIC</span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowPrivateKey(!showPrivateKey)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
        >
          {showPrivateKey ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
          {showPrivateKey ? "Hide" : "Show"} Private Key
        </button>
        {showPrivateKey && (
          <div className="flex-1 bg-white/10 px-3 py-2 rounded-lg font-mono text-sm truncate">
            {truncateAddress(privateKey)}
          </div>
        )}
        <button
          onClick={resetWallet}
          className="ml-auto flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
