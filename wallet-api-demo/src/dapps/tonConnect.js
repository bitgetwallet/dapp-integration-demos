import { TonConnectUI } from "@tonconnect/ui";
import React, { useState } from "react";

const tonConnectUI = new TonConnectUI({
  manifestUrl: "https://app.ston.fi/tonconnect-manifest.json",
  walletsListConfiguration: {
    includeWallets: [
      {
        name: "Bitget Wallet",
        appName: "bitgetTonWallet",
        jsBridgeKey: "bitgetTonWallet",
        imageUrl:
          "https://raw.githubusercontent.com/bitkeepwallet/download/main/logo/png/bitget%20wallet_logo_iOS.png",
        aboutUrl: "https://web3.bitget.com",
        bridgeUrl: "https://ton-connect-bridge.bgwapi.io/bridge",
        universalLink: "https://bkcode.vip/ton-connect",
        deepLink: "bitkeep://",
        platforms: ["ios", "android", "chrome"],
      },
      {
        appName: "bitgetWalletLite",
        name: "Bitget Wallet Lite",
        imageUrl: "https://raw.githubusercontent.com/bitgetwallet/download/main/logo/png/bitget_wallet_lite_logo.png",
        aboutUrl: "https://web3.bitget.com",
        universalLink: "https://t.me/BitgetWallet_TGBot?attach=wallet",
        bridgeUrl: "https://ton-connect-bridge.bgwapi.io/bridge",
        platforms: ["ios", "android", "macos", "windows", "linux"]
      }
    ],
  },
});

export default function TonConnectDApp() {
  const [currentInfo, setCurrentInfo] = useState({});
  const openModal = async () => await tonConnectUI.openModal();
  const closeModal = async () => tonConnectUI.closeModal();
  const currentWallet = () => tonConnectUI.wallet;
  const currentWalletInfo = () => tonConnectUI.walletInfo;
  const currentAccount = () => tonConnectUI.account;
  const currentIsConnectedStatus = () => tonConnectUI.connected;
  const disconnect = async () => await tonConnectUI.disconnect();
  const openBitgetTonWallet = async () =>
    await tonConnectUI.openSingleWalletModal("bitgetTonWallet");
  const openBitgetWalletLite = async () =>
    await tonConnectUI.openSingleWalletModal("bitgetWalletLite");
  const getWallets = async () => await tonConnectUI.getWallets();
  const onStatusChange = async () => {
    const unsubscribe = tonConnectUI.onStatusChange((walletInfo) => {
      console.log("walletInfo", walletInfo);
    });
    return unsubscribe;
  };
  const onModalChange = async () => {
    const unsubscribe = tonConnectUI.onModalStateChange((WalletsModalState) => {
      console.log("WalletsModalState", WalletsModalState);
    });
    return unsubscribe;
  };
  const sendTransaction = async () => {
    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
      messages: [
        {
          address: "EQBBJBB3HagsujBqVfqeDUPJ0kXjgTPLWPFFffuNXNiJL0aA",
          amount: "20000000",
          // stateInit: "base64bocblahblahblah==" // just for instance. Replace with your transaction initState or remove
        },
        {
          address: "EQDmnxDMhId6v1Ofg_h5KR5coWlFG6e86Ro3pc7Tq4CA0-Jn",
          amount: "60000000",
          // payload: "base64bocblahblahblah==" // just for instance. Replace with your transaction payload or remove
        },
      ],
    };
    return await tonConnectUI.sendTransaction(transaction);
  };
  const funcNames = [
    "openBitgetWalletLite",
    "openBitgetTonWallet",
    "openModal",
    "closeModal",
    "currentWallet",
    "currentWalletInfo",
    "currentAccount",
    "currentIsConnectedStatus",
    "disconnect",
    "getWallets",
    "onStatusChange",
    "onModalChange",
    "sendTransaction",
  ];
  return (
    <>
      <h2>Ton Connect DApp Demo</h2>
      <div style={{ display: "grid", gap: 20 }}>
        {[
          openBitgetTonWallet,
          openModal,
          closeModal,
          currentWallet,
          currentWalletInfo,
          currentAccount,
          currentIsConnectedStatus,
          disconnect,
          getWallets,
          onStatusChange,
          onModalChange,
          sendTransaction,
        ].map((func, index) => (
          <div key={index}>
            <button
              onClick={async () => {
                try {
                  setCurrentInfo({
                    "function name": func.name,
                    "function returns": await func(),
                  });
                } catch (e) {
                  console.error(e);
                }
              }}
            >
              {`${func?.name || funcNames[index]} Button`}
            </button>
          </div>
        ))}
      </div>
      {Object.keys(currentInfo).map((k) => (
        <div key={k} style={{ wordWrap: "break-word" }}>
          {k}: {JSON.stringify(currentInfo[k])}
        </div>
      ))}
    </>
  );
}
