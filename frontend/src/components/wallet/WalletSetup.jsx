import React from "react";
import { Wallet, Plus, Loader, Download, Lock } from "lucide-react";

export default function WalletSetup({
  createWallet,
  importWallet,
  loading,
  importKey,
  setImportKey,
}) {
  return (
    <div className="max-w-lg w-full h-full my-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl mb-4 shadow-lg">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-black mb-2 tracking-tight">
            PolyWallet
          </h1>
          <p className="text-gray-500 text-sm">
            Secure gateway to the Polygon network
          </p>
        </div>

        <button
          onClick={createWallet}
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-200 mb-4 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white text-gray-400 text-xs font-medium uppercase tracking-wider">
              or import existing
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Lock className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="password"
              placeholder="Enter your private key"
              value={importKey}
              onChange={(e) => setImportKey(e.target.value)}
              disabled={loading}
              className="w-full pl-11 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black focus:border-transparent outline-none text-black placeholder-gray-400 transition-all duration-200 hover:border-gray-300 bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <button
            onClick={importWallet}
            disabled={loading || !importKey}
            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-semibold hover:bg-black transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Download className="w-5 h-5" />
                Import Wallet
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
