import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  HashRouter,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";
// import { Buffer } from 'buffer';

import "./App.css";

import AptosDApp from "./dapps/aptos";
import Aptos62DApp from "./dapps/aip-62";
import CosmosDApp from "./dapps/cosmos";
import StarknetApp from "./dapps/starknet";
import SuiDApp from "./dapps/sui";
import UnisatDApp from "./dapps/unisat";
import SolanaDApp from "./dapps/solana";
import EthDApp from "./dapps/eth";
import TonDApp from "./dapps/ton";
import TonConnectDApp from "./dapps/tonConnect";
import Deeplink from "./dapps/deeplink";
import WalletConnect from "./dapps/walletConnect";

// 但是使用最新solana，需要配置一些Buffer内容否则会报错：‘ReferenceError: Buffer is not defined’
// window.Buffer = Buffer;

export default function App() {
  const chains = ["aptos", "aptos62", "cosmos", "starknet", "sui", "unisat", "solana", "eth", "ton", 'tonConnect', 'WalletConnect'];
  
  return (
    <>
      <BrowserRouter>
        <div className="dapps">
          {chains.map((chain, index) => (
            <a href={"/" + chain} key={index}>
              {chain}
            </a>
          ))}
        </div>

        <Routes>
          <Route exact path="/" element={<TonConnectDApp />} />
          <Route exact path="/deeplink" element={<Deeplink />} />
          <Route exact path="/aptos" element={<AptosDApp />} />
          <Route exact path="/aptos62" element={<Aptos62DApp />} />
          <Route exact path="/cosmos" element={<CosmosDApp />} />
          <Route exact path="/starknet" element={<StarknetApp />} />
          <Route exact path="/sui" element={<SuiDApp />} />
          <Route exact path="/unisat" element={<UnisatDApp />} />
          <Route exact path="/solana" element={<SolanaDApp />} />
          <Route exact path="/eth" element={<EthDApp />} />
          <Route exact path="/ton" element={<TonDApp />} />
          <Route exact path="/tonConnect" element={<TonConnectDApp />} />
          <Route exact path="/walletConnect" element={<WalletConnect />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
