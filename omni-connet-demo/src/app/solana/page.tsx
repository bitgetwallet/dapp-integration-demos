"use client";
// import Image from "next/image";
import React from "react";
import {
  OmniConnect,
  PreventType,
  RequestMethods,
} from "@bitget-wallet/omni-connect";
import { useState, useEffect, useMemo, useRef } from "react";
import nacl from "tweetnacl";
import { decodeUTF8, encodeUTF8 } from "tweetnacl-util";
import {
  Keypair,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
  SystemProgram,
  PublicKey,
} from "@solana/web3.js";
import bs58 from "bs58";

export function uint8ArraytoHex(uint8Array) {
  if (!uint8Array) return "";
  return Array.prototype.map
    .call(uint8Array, (x) => ("00" + x.toString(16)).slice(-2))
    .join("");
}

export const hextoUint8Array = (hexString) =>
  new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

export const Toast = ({ message, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 text-center animate-fadeIn">
        <p className="text-gray-800">{message}</p>
      </div>
    </div>
  );
};
export default function Home() {
  const [connector, setConnector] = useState({} as any);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [signature, setSignature] = useState("");
  const [reciept, setReciept] = useState();
  const [msg, setMsg] = useState("The quick brown fox jumps over the lazy dog");

  const [msgSig, setMsgSig] = useState({} as any);
  const connectFlag = useRef(false);

  const [isToastVisible, setToastVisible] = useState(false);
  const [isClickToastVisible, setClickToastVisible] = useState(false);
  const [isFetchToastVisible, setFetchToastVisible] = useState(false);
  const [blockhash, setBlockhash] = useState("");

  const [transferLamports, setTransferLamports] = useState("20");

  const init = async (connector) => {
    const result = await connector.restoreConnection();
    console.log('account', result?.account);
    // setAddress(account);
  };
  useEffect(() => {
    const connector = new OmniConnect({
      metadata: {
        name: "SolDAppName",
        iconUrl:
          "https://raw.githubusercontent.com/bitkeepwallet/download/main/logo/png/bitget_wallet_logo_0_gas_fee_64.jpeg",
        url: "https://web3.bitget.com",
        privacyPolicyUrl: "",
        termsOfUseUrl: "",
      },
      namespace: {
        solana: {},
      },
    });
    setConnector(connector);

    init(connector);

    const subscription = connector.onStatusChange(
      (walletInfo) => {
        console.log("onStatusChange", walletInfo);
        const { id, namespaceKey, event, connected, result } = walletInfo;
        switch (event) {
          case RequestMethods.Connect:
          case RequestMethods.Disconnect:
            setConnected(connected);
            setAddress(result?.address);

            if (connected && !!connectFlag.current) {
              connector.signMessage({
                message: msg,
                settings: {
                  preventPopup: PreventType.Open,
                },
              });
              connectFlag.current = false;
            }
            break;
          case RequestMethods.SignMessage:
            setMsgSig(result);
            break;
          case RequestMethods.SignTransaction:
          case RequestMethods.SendTransaction:
            setSignature(result?.signature);
            setReciept(result?.reciept);
            break;
          default:
            break;
        }
      },
      (err) => {
        const { code, message } = err;
        console.error(`error stream: code: ${code}, message: ${message}`);
      }
    );
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <div className="w-full bg-[#efefef] box-border">
      <div className="fixed w-full h-[55px] text-large font-bold text-white flex justify-center items-center bg-[#3894ff] ">
        <img className="w-6 h-6 rounded-full mr-2" src={"/logo.png"} />
        OmniConnect
      </div>
      <div className="flex flex-col max-w-[600px] mx-auto px-5 py-[55px] gap-3 font-[family-name:var(--font-geist-sans)]">
        {/* connect */}
        <div className="w-full p-5 bg-white rounded-md my-4">
          <div className="flex flex-col justify-between">
            <div className="mb-3">App namespace: Solana</div>
            <div className="mb-3">
              Connect Status: {connected ? "connected" : "unconnect"}
            </div>
          </div>
          <div className="break-all">{connected && `address: ${address}`}</div>
          <button
            className={`w-full h-[48px] rounded-full bg-[#3894ff] text-white text-lg mt-6 `}
            type="button"
            onClick={async () => {
              setClickToastVisible(true);
              setTimeout(() => {
                setClickToastVisible(false);
              }, 500);

              if (!!connected) {
                connector.disconnect();
              } else {
                try {
                  const { account } = await connector.connect();
                  console.log("account", account);
                } catch (error) {}
              }
            }}
          >
            {connected ? "disconnect" : "connect"}
          </button>
        </div>
        <div className="w-full p-5 bg-white rounded-md my-4">
          <h2 className="text-center text-lg font-bold mb-3">Sign message</h2>
          <textarea
            name="sol_sign"
            rows={2}
            className="w-full p-2 text-black border border-solid border-[#dedede] rounded-md"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <button
            className={`w-full h-[48px] rounded-full bg-[#3894ff] text-white text-lg mt-6`}
            type="button"
            onClick={async () => {
              setClickToastVisible(true);
              setTimeout(() => {
                setClickToastVisible(false);
              }, 500);
              console.log("touched sol_sign");

              try {
                const { signature } = await connector.signMessage({
                  message: msg,
                });
                console.log("signature", signature);
              } catch (error) {
                // handle error..
                console.error(error?.message);
              }
            }}
          >
            sign message
          </button>
          <div className="mt-5">
            <div style={{ wordBreak: "break-all" }} className="break-all mb-3">
              signature: {msgSig.signature}
            </div>
            <button
              className={`w-full h-[48px] rounded-full bg-[#3894ff] text-white text-lg mt-4`}
              type="button"
              onClick={() => {
                if (!connected || !msgSig.signature) return;

                const messageBytes = decodeUTF8(msg);
                const result = nacl.sign.detached.verify(
                  messageBytes,
                  hextoUint8Array(msgSig.signature),
                  bs58.decode(address)
                );
                alert(`verify result: ${result}`);
              }}
            >
              verify signed message
            </button>
          </div>
        </div>

        <div className="w-full p-5 bg-white rounded-md my-4">
          <h2 className="text-center text-lg font-bold mb-3">
            Fetch Recent Blockhash
          </h2>
          <div className="break-all">recentBlockhash: {blockhash}</div>
          <button
            className={`w-full h-[48px] rounded-full bg-[#3894ff] text-white text-lg my-4`}
            type="button"
            onClick={async () => {
              setFetchToastVisible(true);
              try {
                const res = await fetch(
                  "https://docs-demo.solana-mainnet.quiknode.pro/",
                  {
                    method: "post",
                    body: JSON.stringify({
                      jsonrpc: "2.0",
                      id: 1,
                      method: "getRecentBlockhash",
                    }),
                  }
                );
                const json = await res.json();
                const { blockhash, feeCalculator } = json?.result?.value;

                setBlockhash(blockhash);
              } catch (error) {
                console.error(error);
              } finally {
                setFetchToastVisible(false);
              }
            }}
          >
            fetch recentBlockhash
          </button>
        </div>

        <div className="w-full p-5 bg-white rounded-md my-4">
          <h2 className="text-center text-lg font-bold mb-3">
            SignTransaction
          </h2>
          transfer lamports:
          <textarea
            rows={1}
            className="w-full min-h-10 p-2 text-black border border-solid border-[#dedede] rounded-md"
            value={transferLamports}
            onChange={(e) => {
              setTransferLamports(e.target.value);
            }}
          />
          <button
            className={`w-full h-[48px] rounded-full bg-[#3894ff] text-white text-lg my-4`}
            type="button"
            onClick={async () => {
              if (!address) {
                alert("please connect wallet first!");
                return;
              }
              if (!blockhash) {
                alert("please get recentBlockhash first!");
                return;
              }
              setClickToastVisible(true);
              setTimeout(() => {
                setClickToastVisible(false);
              }, 500);
              console.log("touched versionedTransaction");

              const instructions = [
                SystemProgram.transfer({
                  fromPubkey: new PublicKey(address),
                  toPubkey: new PublicKey(address),
                  lamports: Number(transferLamports),
                }),
              ];
              const messageV0 = new TransactionMessage({
                payerKey: new PublicKey(address),
                recentBlockhash: blockhash,
                instructions,
              }).compileToV0Message();
              const transactionV0 = new VersionedTransaction(messageV0);
              console.log("VersionedTransaction", transactionV0);

              try {
                const { signature } = await connector.signTransaction({
                  transaction: transactionV0,
                });
                console.log("signature", signature);
              } catch (error) {
                console.error(error?.message);
              }
            }}
          >
            sign versionedTransaction
          </button>
          <button
            className={`w-full h-[48px] rounded-full bg-[#3894ff] text-white text-lg my-4`}
            type="button"
            onClick={async () => {
              if (!address) {
                alert("please connect wallet first!");
                return;
              }
              if (!blockhash) {
                alert("please get recentBlockhash first!");
                return;
              }
              setClickToastVisible(true);
              setTimeout(() => {
                setClickToastVisible(false);
              }, 500);
              console.log("touched legacyTransaction");

              const transaction = new Transaction({
                recentBlockhash: blockhash,
                feePayer: new PublicKey(address),
              });
              const instruction = SystemProgram.transfer({
                fromPubkey: new PublicKey(address),
                toPubkey: new PublicKey(address),
                lamports: 10,
              });
              transaction.add(instruction);
              console.log("legacyTransaction", transaction);

              try {
                const { signature } = await connector.signTransaction({
                  transaction,
                });
                console.log("signature", signature);
              } catch (error) {
                console.error(error?.message);
              }
            }}
          >
            sign legacyTransaction
          </button>
          signature:{" "}
          <textarea
            rows={2}
            className="w-full min-h-10 p-2 text-black border border-solid border-[#dedede] rounded-md"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
          />
          <div className="break-all">reciept: {reciept}</div>
          <button
            className={`w-full h-[48px] rounded-full bg-[#3894ff] text-white text-lg my-4`}
            type="button"
            onClick={async () => {
              if (!signature) {
                alert("Please get signature first!");
                return;
              }
              setFetchToastVisible(true);
              try {
                const res = await fetch(
                  "https://docs-demo.solana-mainnet.quiknode.pro/",
                  {
                    method: "post",
                    body: JSON.stringify({
                      method: "sendTransaction",
                      params: [signature],
                      id: 1,
                      jsonrpc: "2.0",
                    }),
                  }
                );
                const json = await res.json();
                if (json.error) {
                  alert(
                    `code: ${json.error?.code}; message: ${json.error?.message}`
                  );
                  return;
                }

                const reciept = json?.result;

                setReciept(reciept);
              } catch (error) {
                console.error(error);
              } finally {
                setFetchToastVisible(false);
              }
            }}
          >
            send by open api
          </button>
        </div>

        {!connected && (
          <div className="w-full p-5 bg-white rounded-md my-4">
            <button
              className={`w-full h-[48px] rounded-full bg-[#3894ff] text-white text-lg mt-5`}
              type="button"
              onClick={() => {
                setClickToastVisible(true);
                setTimeout(() => {
                  setClickToastVisible(false);
                }, 500);
                console.log("touched connect & sign");

                connector.connect({ ret: PreventType.Close });
                connectFlag.current = true;
              }}
            >
              connect & sign
            </button>
          </div>
        )}
      </div>
      <Toast
        message="Chain switched successfully"
        isVisible={isToastVisible}
        onClose={() => setToastVisible(false)}
      />
      <Toast
        message="Touched"
        isVisible={isClickToastVisible}
        onClose={() => setClickToastVisible(false)}
      />
      <Toast
        message="Fetching"
        isVisible={isFetchToastVisible}
        onClose={() => setFetchToastVisible(false)}
      />
    </div>
  );
}
