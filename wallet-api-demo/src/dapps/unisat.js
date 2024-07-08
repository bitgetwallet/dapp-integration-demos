import React, { useState } from "react";
import { verifyMessage } from "@unisat/wallet-utils";

const provider = window.unisat;

export default function UnisatDApp() {
  const [currentInfo, setCurrentInfo] = useState({});
  const [params, setParams] = useState("");
  const requestAccounts = async () => await provider.requestAccounts();
  const getAccounts = async () => await provider.getAccounts();
  const getNetwork = async () => await provider.getNetwork();
  const switchNetwork = async (args) =>
    await provider.switchNetwork(...args);
  const getPublicKey = async () => await provider.getPublicKey();
  const getBalance = async () => await provider.getBalance();
  const getInscriptions = async () => await provider.getInscriptions();
  const sendBitcoin = async (
    args = [
      "bc1pjgte9l97r9fj7k3w09e55u0mtuf8ps4paan8mrlz6lumeyu7x7asrdqz4q",
      1000,
    ],
  ) => await provider.sendBitcoin(...args);
  const sendInscription = async (
    args = [
      "tb1q8h8s4zd9y0lkrx334aqnj4ykqs220ss7mjxzny",
      "e9b86a063d78cc8a1ed17d291703bcc95bcd521e087ab0c7f1621c9c607def1ai0",
      { feeRate: 15 },
    ],
  ) => await provider.sendInscription(...args);
  const signMessage_verifyMessage = async () => {
    const message = "abcdefghijk123456789";
    const signature = await provider.signMessage(message);
    const pubkey = await getPublicKey();
    const res = verifyMessage(pubkey, message, signature);
    return {
      message,
      signature,
      pubkey,
      verifyMessageResult: res,
    };
  };
  const signPsbt = async (
    args = [
      "70736274ff0100890200000001668438b4fcafa31fe575284af4fd144a5b1f74edbc1733609de2634f5683607e0100000000ffffffff02920b000000000000225120f0a8ac7eeeb1a7d919c670d60120b94ef502b13e19ffda0b35cc21f8e8b458335c46000000000000225120921792fcbe19532f5a2e79734a71fb5f1270c2a1ef667d8fe2d7f9bc939e37bb000000000001012b8e5b000000000000225120921792fcbe19532f5a2e79734a71fb5f1270c2a1ef667d8fe2d7f9bc939e37bb01172047eafdc07e0d12def374cebee7a9fcf81130f6eb34530fcf936e4557a762c602000000",
    ],
  ) => await provider.signPsbt(...args);
  return (
    <>
      <h2>Unisat DApp Demo</h2>
      <textarea
        type="text"
        value={params}
        onChange={(e) => setParams(e.target.value)}
        placeholder={`多参数间使用','分隔`}
      />
      <div style={{ display: "grid", gap: 20 }}>
        {[
          requestAccounts,
          getAccounts,
          getNetwork,
          switchNetwork,
          getPublicKey,
          getBalance,
          getInscriptions,
          sendBitcoin,
          sendInscription,
          signMessage_verifyMessage,
          signPsbt,
        ].map((func, index) => (
          <div key={index}>
            <button
              onClick={async () => {
                try {
                  setCurrentInfo({
                    "function name": func.name,
                    "function params": params.split(','),
                    "function returns": await func(params ? params.split(',') : undefined),
                  });
                } catch (e) {
                  console.error(e);
                }
              }}
            >
              {func.name}
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
