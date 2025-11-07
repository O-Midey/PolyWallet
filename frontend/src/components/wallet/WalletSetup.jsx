import React from "react";
import { Wallet, Plus, Download, Loader } from "lucide-react";

export default function WalletSetup({
  createWallet,
  importWallet,
  loading,
  importKey,
  setImportKey,
}) {
  return (
    <div className="max-w-md w-full h-full">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Wallet className="w-10 h-10 text-black" />
            <h1 className="text-4xl font-bold bg-black bg-clip-text text-transparent">
              PolyWallet
            </h1>
          </div>
          <p className="text-gray-600">Your gateway to Polygon network</p>
        </div>
        <h2 className="text-2xl font-semibold mb-6 text-center">Get Started</h2>

        <button
          onClick={createWallet}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all mb-4 flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
          Create New Wallet
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">or</span>
          </div>
        </div>

        <div className="space-y-3">
          <input
            type="password"
            placeholder="Enter private key"
            value={importKey}
            onChange={(e) => setImportKey(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
          <button
            onClick={importWallet}
            disabled={loading || !importKey}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            Import Wallet
          </button>
        </div>
      </div>
    </div>
  );
}
