import React from "react";
import {
  Clock,
  ArrowUpRight,
  Hash,
  ExternalLink,
  CheckCircle2,
  Loader2,
  XCircle,
} from "lucide-react";

export default function TransactionHistory({
  transactions,
  truncateAddress,
  loading,
}) {
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown";

    // Handle different timestamp formats
    let date;
    if (typeof timestamp === "string") {
      // If it's a string, try parsing it
      date = new Date(timestamp);
    } else if (typeof timestamp === "number") {
      // Backend converts seconds to milliseconds (timestamp * 1000)
      // So if we receive a number, it should already be in milliseconds
      // But check: if it's less than year 2000 in milliseconds, it might be in seconds
      // Year 2000 in milliseconds: 946684800000
      // Year 2020 in seconds: 1577836800
      // Year 2020 in milliseconds: 1577836800000

      // If timestamp is less than 10000000000, it's definitely in seconds (before year 2286)
      if (timestamp < 10000000000) {
        date = new Date(timestamp * 1000);
      } else {
        // Otherwise assume it's already in milliseconds
        date = new Date(timestamp);
      }
    } else {
      date = new Date(timestamp);
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn("Invalid timestamp:", timestamp);
      return "Invalid date";
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    // Handle negative differences (future dates)
    if (diffMs < 0) {
      return "Just now";
    }

    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    // For older dates, show formatted date
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
      case "confirmed":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    if (!status) return null;
    const statusLower = status.toLowerCase();
    const colors = {
      success: "bg-green-100 text-green-700 border-green-200",
      confirmed: "bg-green-100 text-green-700 border-green-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      failed: "bg-red-100 text-red-700 border-red-200",
    };
    return (
      <span
        className={`px-2 py-0.5 text-xs font-medium rounded-lg border ${
          colors[statusLower] || "bg-gray-100 text-gray-700 border-gray-200"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="h-full flex flex-col w-full">
      <div className="mb-6 shrink-0">
        <h3 className="text-2xl font-bold text-black mb-2">
          Transaction History
        </h3>
        <p className="text-gray-600 text-sm">
          View all your recent transactions
        </p>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-5 bg-gray-50 rounded-xl border border-gray-200 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-24" />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-5 bg-gray-200 rounded w-20 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-gray-50 to-gray-100 mb-4 border border-gray-200">
              <Clock className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium text-lg mb-1">
              No transactions yet
            </p>
            <p className="text-gray-500 text-sm">
              Your transaction history will appear here once you start sending
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx, idx) => {
              const fullHash = tx.hash || tx.txHash;
              const polygonScanUrl = fullHash
                ? `https://polygonscan.com/tx/${fullHash}`
                : null;
              return (
                <div
                  key={idx}
                  className="group flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-200 hover:border-black hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="shrink-0 w-12 h-12 bg-linear-to-br from-white to-gray-50 rounded-xl flex items-center justify-center border border-gray-200 group-hover:border-black group-hover:shadow-sm transition-all duration-300">
                      <ArrowUpRight className="w-6 h-6 text-black" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-black truncate">
                          {truncateAddress(tx.to)}
                        </p>
                        {getStatusIcon(tx.status)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>{formatTimestamp(tx.timestamp)}</span>
                        {tx.status && getStatusBadge(tx.status)}
                      </div>
                      {fullHash && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                          <Hash className="w-3 h-3" />
                          <span className="font-mono">
                            {truncateAddress(fullHash)}
                          </span>
                          {polygonScanUrl && (
                            <a
                              href={polygonScanUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="ml-1 text-gray-500 hover:text-black transition-colors"
                              title="View on PolygonScan"
                            >
                              <ExternalLink className="w-3 h-3 inline" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <p className="font-bold text-lg text-black mb-1">
                      {tx.amount}{" "}
                      <span className="text-sm text-gray-600">MATIC</span>
                    </p>
                    {polygonScanUrl && (
                      <a
                        href={polygonScanUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-black font-medium transition-colors hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
