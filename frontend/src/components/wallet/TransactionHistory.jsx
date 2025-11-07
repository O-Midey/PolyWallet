import React from "react";
import { Clock, ArrowUpRight } from "lucide-react";

export default function TransactionHistory({ transactions, truncateAddress }) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
      {transactions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">{truncateAddress(tx.to)}</p>
                  <p className="text-sm text-gray-500">{tx.timestamp}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{tx.amount} MATIC</p>
                <p className="text-xs text-gray-500">
                  {truncateAddress(tx.hash)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
