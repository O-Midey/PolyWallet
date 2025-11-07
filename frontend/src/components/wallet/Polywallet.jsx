import React, { useEffect } from "react";
import { useWalletStore } from "../../store/walletStore";
import WalletWelcome from "./walletWelcome";
import WalletDashboard from "./walletDashboard";
import Notification from "./notification";
import WalletSetup from "./WalletSetup";

const truncateAddress = (addr) => {
  return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
};

export default function PolyWallet() {
  const state = useWalletStore();

  useEffect(() => {
    state.loadWalletFromStorage();
  }, []);

  useEffect(() => {
    if (state.walletAddress && state.screen === "dashboard") {
      state.fetchBalance();
      state.fetchTransactions();
    }
  }, [state.walletAddress, state.screen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      {state.notification && <Notification notification={state.notification} />}

      <div className="max-w-md mx-auto min-h-screen px-4 py-8">
        {state.screen === "setup" && (
          <WalletSetup
            createWallet={state.createWallet}
            importWallet={state.importWallet}
            loading={state.loading}
            importKey={state.importKey}
            setImportKey={state.setImportKey}
          />
        )}
        {state.screen === "welcome" && (
          <WalletWelcome
            walletAddress={state.walletAddress}
            privateKey={state.privateKey}
            copied={state.copied}
            copyToClipboard={state.copyToClipboard}
            showPrivateKey={state.showPrivateKey}
            setShowPrivateKey={state.setShowPrivateKey}
            proceedToWallet={state.proceedToWallet}
          />
        )}

        {state.screen === "dashboard" && (
          <WalletDashboard
            activeTab={state.activeTab}
            setActiveTab={state.setActiveTab}
            walletAddress={state.walletAddress}
            balance={state.balance}
            copied={state.copied}
            copyToClipboard={state.copyToClipboard}
            sendTransaction={state.sendTransaction}
            recipient={state.recipient}
            setRecipient={state.setRecipient}
            amount={state.amount}
            setAmount={state.setAmount}
            loading={state.loading}
            resetWallet={state.resetWallet}
            transactions={state.transactions}
            truncateAddress={truncateAddress}
          />
        )}
      </div>
    </div>
  );
}
