import React, { useEffect, useState } from "react";
import { Copy, Check, LogOut, RefreshCw, ExternalLink } from "lucide-react";

export default function WalletCard({
  walletAddress,
  balance,
  copied,
  copyToClipboard,
  truncateAddress,
  resetWallet,
  fetchBalance,
}) {
  const [displayBalance, setDisplayBalance] = useState(balance || "0.00");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (balance !== null) {
      const target = Number(balance).toFixed(4);
      const current = Number(displayBalance).toFixed(4);
      if (target !== current) {
        // Animate balance change
        setDisplayBalance(target);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balance]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (fetchBalance) {
      await fetchBalance();
    }
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const polygonScanUrl = `https://polygonscan.com/address/${walletAddress}`;

  return (
    <div className="relative overflow-hidden group">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <p className="text-gray-500 text-xs font-medium mb-2 uppercase tracking-wider">
              Wallet Address
            </p>
            <div className="flex items-center gap-3">
              <p className="text-lg font-mono font-semibold bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 text-black transition-all duration-200 hover:border-gray-300">
                {truncateAddress(walletAddress)}
              </p>
              <button
                onClick={() => copyToClipboard(walletAddress)}
                className={`p-2.5 rounded-xl transition-all duration-300 border shrink-0 ${
                  copied
                    ? "bg-green-50 border-green-200 text-green-600"
                    : "hover:bg-gray-100 border-gray-200 text-gray-600"
                }`}
                title="Copy address"
              >
                {copied ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
              <a
                href={polygonScanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200 text-gray-600 hover:text-black shrink-0"
                title="View on PolygonScan"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
          <button
            onClick={resetWallet}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 text-gray-500 hover:text-gray-700"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
              Balance
            </p>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-all duration-200 disabled:opacity-50"
              title="Refresh balance"
            >
              <RefreshCw
                className={`w-4 h-4 text-gray-500 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-5xl font-bold tracking-tight text-black transition-all duration-500">
              {Number(displayBalance).toFixed(4)}
              <span className="text-xl font-semibold text-gray-600 ml-2">
                MATIC
              </span>
            </p>
          </div>
          {balance === null && (
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-200 rounded-full animate-pulse"
                style={{ width: "60%" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
