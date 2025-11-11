import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  AlertTriangle,
  Copy,
  Check,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

export default function WalletWelcome({
  walletAddress,
  privateKey,
  copied,
  copyToClipboard,
  showPrivateKey,
  setShowPrivateKey,
  proceedToWallet,
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <div className="text-center mb-8">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div
              className={`absolute inset-0 bg-linear-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center border-2 border-green-200 transition-all duration-1000 ${
                isAnimating ? "scale-110 animate-pulse" : "scale-100"
              }`}
            >
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            {isAnimating && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-yellow-400 animate-spin" />
              </div>
            )}
          </div>
          <h2 className="text-3xl font-bold mb-2 text-black animate-in fade-in slide-in-from-bottom-2 duration-500">
            Wallet Created!
          </h2>
          <p className="text-gray-600 animate-in fade-in slide-in-from-bottom-3 duration-700">
            Your Polygon wallet has been successfully created
          </p>
        </div>

        <div className="bg-linear-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-lg animate-in fade-in slide-in-from-left-2 duration-500">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-amber-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            </div>
            <div>
              <p className="font-semibold text-amber-900 mb-1">
                Important: Save Your Credentials
              </p>
              <p className="text-sm text-amber-800">
                Make sure to save your private key securely. You'll need it to
                access your wallet. Never share it with anyone.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-all duration-200 group">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Wallet Address
              </label>
              <button
                onClick={() => copyToClipboard(walletAddress)}
                className={`flex items-center gap-1 text-sm transition-all duration-200 rounded-lg px-2 py-1 ${
                  copied
                    ? "bg-green-100 text-green-700"
                    : "text-black hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <p className="font-mono text-sm break-all text-black bg-white px-3 py-2 rounded-lg border border-gray-200">
              {walletAddress}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-all duration-200 group">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Private Key
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                  className="p-1.5 text-sm text-black hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  {showPrivateKey ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => copyToClipboard(privateKey)}
                  className={`flex items-center gap-1 text-sm transition-all duration-200 rounded-lg px-2 py-1 ${
                    copied
                      ? "bg-green-100 text-green-700"
                      : "text-black hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>
            </div>
            <p className="font-mono text-sm break-all text-black bg-white px-3 py-2 rounded-lg border border-gray-200">
              {showPrivateKey ? privateKey : "•".repeat(34)}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
          <h3 className="font-semibold text-black mb-3">Security Checklist</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <label className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" />
              <span>I have saved my private key in a secure location</span>
            </label>
            <label className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" />
              <span>I understand I cannot recover my wallet without it</span>
            </label>
            <label className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" />
              <span>I will never share my private key with anyone</span>
            </label>
          </div>
        </div>

        <button
          onClick={proceedToWallet}
          className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Continue to Wallet
        </button>
      </div>
    </div>
  );
}
