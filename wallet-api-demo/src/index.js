import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { BitgetWallet } from "@bitget-wallet/aptos-wallet-adapter";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";

const root = ReactDOM.createRoot(document.getElementById("root"));
// const wallets = [new PetraWallet()];
// const wallets = [new BitgetWallet()];

root.render(
  <React.StrictMode>
    <AptosWalletAdapterProvider
      // plugins={wallets}
      autoConnect={false}
    >
      <App />
    </AptosWalletAdapterProvider>
  </React.StrictMode>,
);
