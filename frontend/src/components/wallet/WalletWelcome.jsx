import React from "react";
import {
  CheckCircle,
  AlertTriangle,
  Copy,
  Check,
  Eye,
  EyeOff,
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
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Wallet Created!</h2>
          <p className="text-gray-600">
            Your Polygon wallet has been successfully created
          </p>
        </div>

        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-orange-800 mb-1">
                Important: Save Your Credentials
              </p>
              <p className="text-sm text-orange-700">
                Make sure to save your private key securely. You'll need it to
                access your wallet. Never share it with anyone.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Wallet Address
              </label>
              <button
                onClick={() => copyToClipboard(walletAddress)}
                className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
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
            <p className="font-mono text-sm break-all text-gray-900">
              {walletAddress}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Private Key
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  {showPrivateKey ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => copyToClipboard(privateKey)}
                  className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>
            </div>
            <p className="font-mono text-sm break-all text-gray-900">
              {showPrivateKey ? privateKey : "•".repeat(64)}
            </p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">
            Security Checklist
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
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
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          Continue to Wallet
        </button>
      </div>
    </div>
  );
}
