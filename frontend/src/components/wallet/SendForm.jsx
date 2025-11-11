import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Loader,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  Zap,
  Clock,
} from "lucide-react";

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
  balance,
  getRecentAddresses,
}) {
  const [errors, setErrors] = useState({ recipient: "", amount: "" });
  const [isValidAddress, setIsValidAddress] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    // Validate recipient address
    if (recipient) {
      const isValid = /^0x[a-fA-F0-9]{40}$/.test(recipient);
      setIsValidAddress(isValid);
      setErrors((prev) => ({
        ...prev,
        recipient: isValid ? "" : "Invalid Ethereum/Polygon address",
      }));

      // Update suggestions based on input
      if (getRecentAddresses) {
        const recent = getRecentAddresses();
        if (recipient.length > 0 && recipient.length < 42 && !isValid) {
          // Filter suggestions that match the input (only show if not complete address)
          const filtered = recent.filter((addr) =>
            addr.toLowerCase().includes(recipient.toLowerCase())
          );
          setSuggestions(filtered);
          setShowSuggestions(filtered.length > 0);
        } else if (isValid) {
          // Hide suggestions when address is valid
          setShowSuggestions(false);
        } else {
          setShowSuggestions(false);
        }
      }
    } else {
      setIsValidAddress(true);
      setErrors((prev) => ({ ...prev, recipient: "" }));
      setShowSuggestions(false);
    }
  }, [recipient, getRecentAddresses]);

  // Load suggestions when input is focused
  useEffect(() => {
    if (getRecentAddresses && recipient.length === 0) {
      const recent = getRecentAddresses();
      setSuggestions(recent.slice(0, 5)); // Show top 5 when empty
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getRecentAddresses]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectSuggestion = (address) => {
    setRecipient(address);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  useEffect(() => {
    // Validate amount
    if (amount) {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        setErrors((prev) => ({
          ...prev,
          amount: "Amount must be greater than 0",
        }));
      } else if (balance && numAmount > parseFloat(balance)) {
        setErrors((prev) => ({
          ...prev,
          amount: "Insufficient balance",
        }));
      } else {
        setErrors((prev) => ({ ...prev, amount: "" }));
      }
    } else {
      setErrors((prev) => ({ ...prev, amount: "" }));
    }
  }, [amount, balance]);

  const handleMaxAmount = () => {
    if (balance) {
      // Leave a small amount for gas (0.001 MATIC)
      const maxAmount = Math.max(0, parseFloat(balance) - 0.001);
      setAmount(maxAmount.toFixed(4));
    }
  };

  const isValid =
    isValidAddress && amount && !errors.amount && parseFloat(amount) > 0;

  const polygonScanUrl = txHash ? `https://polygonscan.com/tx/${txHash}` : null;

  return (
    <div className="space-y-6 min-h-full w-full">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-black mb-2">Send MATIC</h3>
        <p className="text-gray-600 text-sm">
          Transfer tokens to any Polygon address
        </p>
      </div>

      <div className="space-y-5">
        <div className="relative">
          <div className="flex items-center justify-between mb-2.5">
            <label className="block text-sm font-medium text-gray-700">
              Recipient Address
            </label>
            {recipient && !isValidAddress && (
              <span className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Invalid
              </span>
            )}
          </div>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              onFocus={() => {
                if (getRecentAddresses) {
                  if (recipient.length === 0) {
                    const recent = getRecentAddresses();
                    setSuggestions(recent.slice(0, 5));
                    setShowSuggestions(recent.length > 0);
                  } else if (
                    recipient.length > 0 &&
                    recipient.length < 42 &&
                    !isValidAddress
                  ) {
                    const recent = getRecentAddresses();
                    const filtered = recent.filter((addr) =>
                      addr.toLowerCase().includes(recipient.toLowerCase())
                    );
                    setSuggestions(filtered);
                    setShowSuggestions(filtered.length > 0);
                  }
                }
              }}
              className={`w-full px-5 py-3.5 bg-white border rounded-xl focus:ring-2 focus:outline-none text-black placeholder-gray-400 transition-all duration-200 ${
                recipient && !isValidAddress
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-black focus:border-black hover:border-gray-400"
              }`}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="max-h-60 overflow-y-auto">
                  {suggestions.map((address, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSuggestion(address)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="font-mono text-sm text-black truncate">
                          {address}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 ml-2 shrink-0">
                        {truncateAddress(address)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {errors.recipient && (
            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.recipient}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="block text-sm font-medium text-gray-700">
              Amount (MATIC)
            </label>
            <div className="flex items-center gap-2">
              {balance && (
                <span className="text-xs text-gray-500">
                  Available: {Number(balance).toFixed(4)} MATIC
                </span>
              )}
              <button
                onClick={handleMaxAmount}
                disabled={!balance || parseFloat(balance) <= 0}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-600 hover:text-black bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Use maximum amount"
              >
                Max
              </button>
            </div>
          </div>
          <div className="relative">
            <input
              type="number"
              step="0.0001"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full px-5 py-3.5 bg-white border rounded-xl focus:ring-2 focus:outline-none text-black placeholder-gray-400 transition-all duration-200 ${
                errors.amount
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-black focus:border-black hover:border-gray-400"
              }`}
            />
            {amount && !errors.amount && parseFloat(amount) > 0 && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Zap className="w-4 h-4 text-green-500" />
              </div>
            )}
          </div>
          {errors.amount && (
            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.amount}
            </p>
          )}
        </div>

        <button
          onClick={sendTransaction}
          disabled={loading || !isValid}
          className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Send Transaction</span>
            </>
          )}
        </button>
      </div>

      {txHash && (
        <div className="mt-6 p-5 bg-linear-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-900 mb-2">
                Transaction Sent Successfully!
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-xs text-gray-700 font-mono bg-white px-3 py-1.5 rounded-lg border border-green-200">
                  {truncateAddress(txHash)}
                </p>
                <a
                  href={polygonScanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-green-700 hover:text-green-900 font-medium transition-colors hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View on PolygonScan
                </a>
                <button
                  onClick={() => checkTxStatus(txHash)}
                  className="flex items-center gap-1.5 text-xs text-green-700 hover:text-green-900 font-medium transition-colors hover:underline"
                >
                  Check Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
