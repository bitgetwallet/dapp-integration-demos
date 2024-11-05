import { TonConnectUI, THEME } from "@tonconnect/ui";
import React, { useState, useEffect } from "react";

const tonConnectUI = new TonConnectUI({
  manifestUrl: "https://app.ston.fi/tonconnect-manifest.json",
  walletsListConfiguration: {
    includeWallets: [
      {
        appName: 'bitgetWalletLite',
        name: 'Bitget Wallet Lite',
        imageUrl:
          'https://raw.githubusercontent.com/bitgetwallet/download/main/logo/png/bitget_wallet_lite_logo.png',
        aboutUrl: 'https://web3.bitget.com',
        universalLink: 'https://t.me/BitgetWallet_TGBot?attach=wallet',
        bridgeUrl: 'https://ton-connect-bridge.bgwapi.io/bridge',
        platforms: ['ios', 'android', 'macos', 'windows', 'linux'],
      },
      {
        name: 'Bitget Wallet',
        appName: 'bitgetTonWallet',
        jsBridgeKey: 'bitgetTonWallet',
        imageUrl:
          'https://raw.githubusercontent.com/bitkeepwallet/download/main/logo/png/bitget%20wallet_logo_iOS.png',
        aboutUrl: 'https://web3.bitget.com',
        bridgeUrl: 'https://ton-connect-bridge.bgwapi.io/bridge',
        universalLink: 'https://bkcode.vip/ton-connect',
        deepLink: 'bitkeep://',
        platforms: ['ios', 'android', 'chrome'],
      },
    ],
  },
});

// uiOptions
tonConnectUI.uiOptions = {
  language: 'en', // type Locales
  uiPreferences: {
      theme: THEME.DARK
  },
  actionsConfiguration: {
     /**
     * Specifies return url for TMA connections.
     * This will be applied as a return strategy if dApp is opened as a TMA and user selects TMA wallet (overrides `returnStrategy` if).
     */
     twaReturnUrl: "https://t.me/<YOUR TMA APP>",
  }
};

export default function TonConnectDApp() {
  const [currentInfo, setCurrentInfo] = useState({});
  const [proof, setProof] = useState('');

  const getWallets = async () => await tonConnectUI.getWallets();

  const openModal = async () => await tonConnectUI.openModal();
  const closeModal = async () => tonConnectUI.closeModal();
  const openBitgetWalletLite = async () => {
    if(tonConnectUI.connected) {
      await disconnect()
    }
    await tonConnectUI.openSingleWalletModal("bitgetWalletLite");
  }
  const openBitgetTonWallet = async () => {
    if(tonConnectUI.connected) {
      await disconnect()
    }
    await tonConnectUI.openSingleWalletModal("bitgetTonWallet");
  }

  const currentWallet = () => tonConnectUI.wallet;
  const currentWalletInfo = () => tonConnectUI.walletInfo;

  const currentAccount = () => tonConnectUI.account;
  const currentIsConnectedStatus = () => tonConnectUI.connected;
  const disconnect = async () => await tonConnectUI.disconnect();
  
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

  useEffect(() => {
    // update tonProof when refresh
    setProof(localStorage.getItem("tonProof") ?? '');
  }, [])

  useEffect(() => {
    tonConnectUI.onStatusChange((wallet) => {
      // get tonProof
      // When the wallet is connected, you can find the ton_proof result in the wallet object
      console.log('onStatusChange:', wallet)
      if (wallet?.connectItems?.tonProof && 'proof' in wallet.connectItems.tonProof) {
        // do something with tonProof
        // checkProofInYourBackend(wallet.connectItems.tonProof.proof)
        localStorage.setItem('tonProof', JSON.stringify(wallet.connectItems.tonProof.proof))
        setProof(JSON.stringify(wallet.connectItems.tonProof.proof))
      }
    })
  }, [])

  // connect and get proof
  const connectToGetProof = async () => {
   console.log('isConnected:', tonConnectUI.connected, tonConnectUI.account)
   if(tonConnectUI.connected) {
     await disconnect()
     localStorage.removeItem('tonProof')
     setProof('')
   }
    try {
      // enable ui loader
      tonConnectUI.setConnectRequestParameters({
        state: 'loading'
      })
      // payload message for proof
      const messageJson = {
        user_id: "testUserID",
        amount: 10
      }
      // to hex string
      const payload = Buffer.from(JSON.stringify(messageJson), 'utf-8').toString('hex')
      // add tonProof to the connect request
      tonConnectUI.setConnectRequestParameters({
        state: 'ready',
        value: { tonProof: payload }
      })
      // connect
      // You can find ton_proof result in the wallet object when wallet will be connected
      tonConnectUI.openSingleWalletModal('bitgetTonWallet')
      // or
      // await tonConnectUI.openSingleWalletModal("bitgetWalletLite");
    } catch (error) {
      console.log(error)
    }
  }

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
    "getProof",
  ];
  return (
    <>
      <h2>Ton Connect DApp Demo</h2>
      <div style={{ display: "flex", flexWrap: 'wrap', gap: 20, marginBottom: 20 }}>
        {[
          openBitgetWalletLite,
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
      <button style={{width: 'fit-content'}} onClick={connectToGetProof}>connectToGetProof</button>
      </div>
      {Object.keys(currentInfo).map((k) => (
        <div key={k} style={{ wordWrap: "break-word" }}>
          {k}: {JSON.stringify(currentInfo[k])}
        </div>
      ))}
      {proof && <p style={{ wordWrap: "break-word" }}>proof: {proof}</p>}
    </>
  );
}
