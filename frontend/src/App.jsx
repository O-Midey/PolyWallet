import React from "react";
import PolyWallet from "./components/wallet/polywallet";
import ErrorBoundary from "./components/wallet/ErrorBoundary";
const API_BASE = "http://localhost:3000/api";

export default function App() {
  return (
    <div className="max-w-[90%] m-auto min-h-screen">
      <ErrorBoundary>
        <PolyWallet />
      </ErrorBoundary>
    </div>
  );
}
