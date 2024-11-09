"use client";
// import Image from "next/image";
import { OmniConnect } from "@bitget-wallet/omni-connect";
import { useState, useEffect } from "react";

export default function Home() {
  const [connector, setConnector] = useState({} as any);
  const [walletInfo, setWalletInfo] = useState<any>({});

  useEffect(() => {
    const connector = new OmniConnect({
      metadata: {
        name: "OmniConnect Demo",
        iconUrl: "https://raw.githubusercontent.com/bitkeepwallet/download/main/logo/jpeg/omni-connect-demo.jpeg",
        url: "https://t.me/BitgetWalletTeam_bot/demo",
        privacyPolicyUrl: "",
        termsOfUseUrl: "",
      },
      // manifestUrl: "http://localhost:3001/omniconnect-manifest.json",
      namespace: {
        ton: {},
      },
    });

    setConnector(connector);

    const subscription = connector.onStatusChange((walletInfo) => {
      console.log("onStatusChange", walletInfo);
      setWalletInfo(walletInfo);
    },()=>{});
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <div className="flex flex-col p-5 gap-3 font-[family-name:var(--font-geist-sans)]">
      <div>App namespace: Ton</div>
      <div style={{ wordBreak: "break-all" }}>
        address: {walletInfo?.address}
      </div>
      <div style={{ wordBreak: "break-all" }}>
        signature: {walletInfo?.signature}
      </div>

      <div className="flex flex-col gap-10">
        <button
          type="button"
          onClick={() => {
            connector.connect();
          }}
        >
          connect
        </button>
        <button
          type="button"
          onClick={() => {
            connector.signTransaction();
          }}
        >
          signTransaction
        </button>
        <button
          type="button"
          onClick={() => {
            connector.disconnect();
          }}
        >
          disconnect
        </button>
      </div>
    </div>
  );
}
