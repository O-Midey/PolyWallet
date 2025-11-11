import React from "react";
import {
  Wallet,
  Plus,
  Loader,
  DownloadIcon,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function WalletSetup({
  createWallet,
  importWallet,
  loading,
  importKey,
  setImportKey,
}) {
  return (
    <div className="max-w-md w-full">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-purple-100 to-blue-100 rounded-full blur-xl opacity-50" />
              <Wallet className="relative w-10 h-10 text-black" />
            </div>
            <h1 className="text-4xl font-bold text-black bg-linear-to-r from-black to-gray-700 bg-clip-text">
              PolyWallet
            </h1>
          </div>
          <p className="text-gray-600">Your gateway to Polygon network</p>
        </div>
        <h2 className="text-2xl font-semibold mb-6 text-center text-black">
          Get Started
        </h2>

        <button
          onClick={createWallet}
          disabled={loading}
          className="w-full bg-black text-white py-3.5 rounded-xl font-medium hover:bg-gray-900 transition-all duration-300 mb-4 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Create New Wallet
            </>
          )}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-medium">or</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <input
              type="password"
              placeholder="Enter private key"
              value={importKey}
              onChange={(e) => setImportKey(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none text-black placeholder-gray-400 transition-all duration-200 hover:border-gray-400"
            />
            {importKey && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Sparkles className="w-4 h-4 text-gray-400" />
              </div>
            )}
          </div>
          <button
            onClick={importWallet}
            disabled={loading || !importKey}
            className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-medium hover:bg-black transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <DownloadIcon className="w-5 h-5" />
                Import Wallet
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
