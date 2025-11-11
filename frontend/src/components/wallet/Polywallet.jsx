import React, { useEffect } from "react";
import { useWalletStore } from "../../store/walletStore";
import WalletWelcome from "./walletWelcome";
import WalletDashboard from "./WalletDashboard";
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
    <div className="h-full bg-black flex flex-col overflow-hidden w-full">
      {state.notification && <Notification notification={state.notification} />}

      <div
        className={`max-w-md mx-auto flex flex-col px-4 ${
          state.screen === "dashboard"
            ? "h-full py-8"
            : "h-full overflow-y-auto py-8"
        }`}
      >
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
            privateKey={state.privateKey}
            balance={state.balance}
            showPrivateKey={state.showPrivateKey}
            setShowPrivateKey={state.setShowPrivateKey}
            copied={state.copied}
            copyToClipboard={state.copyToClipboard}
            sendTransaction={state.sendTransaction}
            recipient={state.recipient}
            setRecipient={state.setRecipient}
            amount={state.amount}
            setAmount={state.setAmount}
            txHash={state.txHash}
            checkTxStatus={state.checkTxStatus}
            loading={state.loading}
            resetWallet={state.resetWallet}
            transactions={state.transactions}
            truncateAddress={truncateAddress}
            fetchBalance={state.fetchBalance}
            getRecentAddresses={state.getRecentAddresses}
          />
        )}
      </div>
    </div>
  );
}
