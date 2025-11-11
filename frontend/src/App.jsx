import React from "react";
import PolyWallet from "./components/wallet/polywallet";
import ErrorBoundary from "./components/wallet/ErrorBoundary";
const API_BASE = import.meta.env.VITE_API_BASE;
export default function App() {
  return (
    <div className="h-screen overflow-hidden">
      <div className="max-w-[90%] m-auto h-full">
        <ErrorBoundary>
          <PolyWallet />
        </ErrorBoundary>
      </div>
    </div>
  );
}
