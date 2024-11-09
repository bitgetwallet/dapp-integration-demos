"use client";
// import Image from "next/image";
import React from "react";
import {
  Eip155SigningMethods,
  OmniConnect,
  PreventType,
  RequestMethods,
} from "@bitget-wallet/omni-connect";
import { useState, useEffect, useMemo, useRef } from "react";
import { hashMessage } from "@ethersproject/hash";
import { recoverAddress, verifyMessage } from "ethers";
import { toChecksumAddress } from "ethereumjs-util";
import {
  recoverTypedSignature,
  SignTypedDataVersion,
} from "@metamask/eth-sig-util";

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
  const [signature, setSignature] = useState();
  const [reciept, setReciept] = useState();
  const [msg, setMsg] = useState({
    eth_sign: "Hello World!",
    personal_sign: "Personal:FOMO NUCN, just beyond FOMO3D",
    eth_signTypedData: [
      {
        type: "string",
        name: "Message",
        value: "Hi, Alice!",
      },
      {
        type: "uint32",
        name: "A number",
        value: "1337",
      },
    ],
    eth_signTypedData_v4: {
      domain: {
        chainId: 56,
        // Give a user-friendly name to the specific contract you're signing for.
        name: "Ether Mail",
        // Add a verifying contract to make sure you're establishing contracts with the proper entity.
        verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
        // This identifies the latest version.
        version: "1",
      },
      message: {
        contents: "Hello, Bob!",
        attachedMoneyInEth: 4.2,
        from: {
          name: "Cow",
          wallets: [
            "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
            "0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF",
          ],
        },
        to: [
          {
            name: "Bob",
            wallets: [
              "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
              "0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57",
              "0xB0B0b0b0b0b0B000000000000000000000000000",
            ],
          },
        ],
      },
      primaryType: "Mail",
      types: {
        // This refers to the domain the contract is hosted on.
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        // Not an EIP712Domain definition.
        Group: [
          { name: "name", type: "string" },
          { name: "members", type: "Person[]" },
        ],
        // Refer to primaryType.
        Mail: [
          { name: "from", type: "Person" },
          { name: "to", type: "Person[]" },
          { name: "contents", type: "string" },
        ],
        // Not an EIP712Domain definition.
        Person: [
          { name: "name", type: "string" },
          { name: "wallets", type: "address[]" },
        ],
      },
    },
  });
  const [msgSig, setMsgSig] = useState({} as any);
  const connectFlag = useRef(false);

  const [txData, setTxData] = useState({
    chainId: "0x38",
    data: "0x",
    from: address,
    to: "0x1A0A18AC4BECDDbd6389559687d1A73d8927E416",
    value: "0x0",
    // nonce: "0x1",
    gasLimit: "0x5208",
    maxPriorityFeePerGas: "0x3b9aca00", //wei
    maxFeePerGas: "0x2540be400", //wei
  });
  const [chainId, setChainId] = useState("1");
  const [isToastVisible, setToastVisible] = useState(false);
  const [isClickToastVisible, setClickToastVisible] = useState(false);

  const init = async (connector) => {
    const result = await connector.restoreConnection();
    console.log('account', result?.account);
    // setAddress(account);
  };
  useEffect(() => {
    const connector = new OmniConnect({
      metadata: {
        name: "DAppName",
        iconUrl:
          "https://raw.githubusercontent.com/bitkeepwallet/download/main/logo/png/bitget_wallet_logo_0_gas_fee_64.jpeg",
        url: "https://web3.bitget.com",
        privacyPolicyUrl: "",
        termsOfUseUrl: "",
      },
      namespace: {
        eip155: {
          chains: ["1", "56"],
          // methods: ["eth_sign", "personal_sign"],
          // events: ["accountsChanged", "chainChanged"],
        },
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

            setTxData({
              ...txData,
              from: result?.address,
            });
            if (connected && !!connectFlag.current) {
              connector.signMessage({
                method: Eip155SigningMethods.EthSign,
                params: [address, msg.eth_sign],
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

  const onSelectChain = (e) => {
    if (e.target.value !== chainId) {
      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false);
      }, 1300);
    }
    setChainId(e.target.value);
  };

  const txFromRef = useRef<any>(null);
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
            <div className="mb-3">App namespace: Eip155</div>
            <div className="mb-3">
              Chain:
              <select name="chain" id="chain" onChange={onSelectChain}>
                <option value="1">ETH</option>
                <option value="56">BNB</option>
              </select>
            </div>
            <div className="mb-3">ChainId: {chainId}</div>
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
          <h2 className="text-center text-lg font-bold mb-3">Eth Sign</h2>
          <textarea
            name="eth_sign"
            rows={1}
            className="w-full p-2 text-black border border-solid border-[#dedede] rounded-md"
            value={msg.eth_sign}
            onChange={(e) =>
              setMsg({
                ...msg,
                eth_sign: e.target.value,
              })
            }
          />
          <button
            className={`w-full h-[48px] rounded-full bg-[#3894ff] text-white text-lg mt-6`}
            type="button"
            onClick={async () => {
              setClickToastVisible(true);
              setTimeout(() => {
                setClickToastVisible(false);
              }, 500);
              console.log("touched eth_sign");

              try {
                const { signature } = await connector.signMessage({
                  method: "eth_sign",
                  params: [address, msg.eth_sign],
                });
                // handle result...
                console.log("signature", signature);
              } catch (error) {
                const { code, message } = error;
                console.error(`error code: ${code}, message: ${message}`);
              }
            }}
          >
            eth_sign
          </button>
          <div className="mt-5">
            <div style={{ wordBreak: "break-all" }} className="break-all mb-3">
              signature:{" "}
              {msgSig?.messageType === "eth_sign" && msgSig.signature}
            </div>
            <button
              className={`w-full h-[48px] rounded-full bg-[#3894ff] text-white text-lg mt-4`}
              type="button"
              onClick={() => {
                if (!connected) return;
                const verifySigner = recoverAddress(
                  hashMessage(msg.eth_sign),
                  msgSig.signature
                );
                console.log("verifySigner", verifySigner);
                console.log(
                  `equal to address: ${address} ? ${verifySigner === address}`
                );
                alert(
                  `equal to address: ${address} ? ${verifySigner === address}`
                );
              }}
            >
              verify eth_sign message
            </button>
          </div>
        </div>

        <div className="w-full p-5 bg-white rounded-md my-4">
          {/* personal_sign */}
          <div className="border-b border-[#dedede]">
            <h2 className="text-center text-lg font-bold mb-3">
              Sign Message personal
            </h2>
            <textarea
              rows={1}
              className="w-full min-h-10 p-2 text-black border border-solid border-[#dedede] rounded-md"
              value={msg.personal_sign}
              onChange={(e) =>
                setMsg({
                  ...msg,
                  personal_sign: e.target.value,
                })
              }
            />
            <button
              className={`w-full h-[48px] rounded-full bg-[#3894ff] text-white text-lg my-4`}
              type="button"
              onClick={async () => {
                setClickToastVisible(true);
                setTimeout(() => {
                  setClickToastVisible(false);
                }, 500);
                console.log("touched personal_sign");
                try {
                  const { signature } = await connector.signMessage({
                    method: "personal_sign",
                    params: [address, msg.personal_sign],
                  });
                  console.log("signature", signature);
                } catch (error) {
                  const { code, message } = error;
                  console.error(`error code: ${code}, message: ${message}`);
                }
              }}
            >
              personal_sign
            </button>
            <div className="mt-5">
              <div
                style={{ wordBreak: "break-all" }}
                className="break-all mb-3"
              >
                signature:{" "}
                {msgSig?.messageType === "personal_sign" && msgSig.signature}
              </div>
              <button
                className={`w-full h-[48px] rounded-full bg-[#3894ff] text-white text-lg mt-4`}
                type="button"
                onClick={() => {
                  if (!connected) return;
                  const verifySigner = verifyMessage(
                    msg.personal_sign,
                    msgSig.signature
                  );
                  console.log("verifySigner", verifySigner);
                  console.log(
                    `equal to address: ${address} ? ${verifySigner === address}`
                  );
                  alert(
                    `equal to address: ${address} ? ${verifySigner === address}`
                  );
                }}
              >
                verify personal_sign message
              </button>
            </div>
          </div>

          {/* eth_signTypedData*/}
          <div className="border-b border-[#dedede] py-4">
            <h2 className="text-center text-lg font-bold mb-3">
              Sign Message signTypedData
            </h2>
            <textarea
              rows={3}
              className="w-full min-h-16 p-2 text-black border border-solid border-[#dedede] rounded-md mt-4"
              readOnly
              value={JSON.stringify(msg.eth_signTypedData)}
              onChange={(e) =>
                setMsg({
                  ...msg,
                  eth_signTypedData: JSON.parse(e.target.value),
                })
              }
            />
            <button
              type="button"
              className={`w-full h-[48px] rounded-full bg-[#3894ff] text-white text-lg mt-4`}
              onClick={async () => {
                setClickToastVisible(true);
                setTimeout(() => {
                  setClickToastVisible(false);
                }, 500);
                console.log("touched eth_signTypedData");

                try {
                  const { signature } = await connector.signMessage({
                    method: "eth_signTypedData",
                    params: [address, msg.eth_signTypedData],
                  });
                  console.log("signature", signature);
                } catch (error) {
                  const { code, message } = error;
                  console.error(`error code: ${code}, message: ${message}`);
                }
              }}
            >
              eth_signTypedData
            </button>
            <div className="mt-5">
              <div
                style={{ wordBreak: "break-all" }}
                className="break-all mb-3"
              >
                signature:{" "}
                {msgSig?.messageType === "eth_signTypedData" &&
                  msgSig.signature}
              </div>
              <button
                className={`w-full h-[48px] rounded-full bg-[#3894ff] text-white text-lg mt-4`}
                type="button"
                onClick={() => {
                  if (!connected) return;
                  const verifySigner = recoverTypedSignature({
                    data: msg.eth_signTypedData,
                    signature: msgSig.signature,
                    version: SignTypedDataVersion.V1,
                  });
                  console.log("verifySigner", verifySigner);
                  alert(
                    `equal to address: ${toChecksumAddress(address)} ? ${
                      toChecksumAddress(verifySigner) ===
                      toChecksumAddress(address)
                    }`
                  );
                }}
              >
                verify eth_signTypedData message
              </button>
            </div>
          </div>

          {/* eth_signTypedData_v4*/}
          <div className=" py-4">
            <h2 className="text-center text-lg font-bold mb-3">
              Sign Message signTypedData_v4
            </h2>
            <textarea
              readOnly
              rows={6}
              className="w-full min-h-16 p-2 text-black border border-solid border-[#dedede] rounded-md mt-4"
              defaultValue={JSON.stringify(msg.eth_signTypedData_v4)}
            />
            <button
              type="button"
              className={`w-full h-[48px] rounded-full bg-[#3894ff] text-white text-lg mt-6`}
              onClick={async () => {
                setClickToastVisible(true);
                setTimeout(() => {
                  setClickToastVisible(false);
                }, 500);
                console.log("touched eth_signTypedData_v4");

                try {
                  const { signature } = await connector.signMessage({
                    method: "eth_signTypedData_v4",
                    params: [address, msg.eth_signTypedData_v4],
                  });
                  console.log("signature", signature);
                } catch (error) {
                  const { code, message } = error;
                  console.error(`error code: ${code}, message: ${message}`);
                }
              }}
            >
              eth_signTypedData_v4
            </button>
            <div className="mt-5">
              <div
                style={{ wordBreak: "break-all" }}
                className="break-all mb-3"
              >
                signature:{" "}
                {msgSig?.messageType === "eth_signTypedData_v4" &&
                  msgSig.signature}
              </div>
              <button
                className={`w-full h-[48px] rounded-full bg-[#3894ff] text-white text-lg mt-4`}
                type="button"
                onClick={() => {
                  if (!connected) return;
                  const verifySigner = recoverTypedSignature({
                    data: msg.eth_signTypedData_v4 as any,
                    signature: msgSig.signature,
                    version: SignTypedDataVersion.V4,
                  });
                  console.log("verifySigner", verifySigner);
                  alert(
                    `equal to address: ${toChecksumAddress(address)} ? ${
                      toChecksumAddress(verifySigner) ===
                      toChecksumAddress(address)
                    }`
                  );
                }}
              >
                verify eth_signTypedData_v4 message
              </button>
            </div>
          </div>
        </div>

        <div className="w-full p-5 bg-white rounded-md my-4">
          <h2 className="text-center text-lg font-bold mb-3">
            SignTransaction
          </h2>
          <textarea
            rows={6}
            name="txInput"
            className="w-full min-h-10 p-2 text-black border border-solid border-[#dedede] rounded-md"
            value={JSON.stringify(txData)}
            onChange={(e) => {
              setTxData(JSON.parse(e.target.value));
            }}
          />
          <div style={{ wordBreak: "break-all" }} className="break-all mb-3">
            signature:{signature}
          </div>
          <button
            className={`w-full h-[48px] rounded-full bg-[#3894ff] text-white text-lg my-4`}
            type="button"
            onClick={async () => {
              setClickToastVisible(true);
              setTimeout(() => {
                setClickToastVisible(false);
              }, 500);
              console.log("touched signTransaction");

              try {
                const { signature } = await connector.signTransaction({
                  method: "eth_signTransaction",
                  params: [txData],
                });
                console.log("signature", signature);
              } catch (error) {
                const { code, message } = error;
                console.error(`error code: ${code}, message: ${message}`);
              }
            }}
          >
            signTransaction
          </button>
        </div>

        <div className="w-full p-5 bg-white rounded-md my-4">
          <h2 className="text-center text-lg font-bold mb-3">
            SendTransaction
          </h2>
          <textarea
            rows={6}
            className="w-full min-h-10 p-2 text-black border border-solid border-[#dedede] rounded-md"
            value={JSON.stringify(txData)}
            onChange={(e) => {
              setTxData(JSON.parse(e.target.value));
            }}
          />
          <div style={{ wordBreak: "break-all" }} className="break-all mb-3">
            signature:{signature}
          </div>
          <div style={{ wordBreak: "break-all" }} className="break-all mb-3">
            reciept:{reciept}
          </div>
          <button
            className={`w-full h-[48px] rounded-full bg-[#3894ff] text-white text-lg my-4`}
            type="button"
            onClick={async () => {
              setClickToastVisible(true);
              setTimeout(() => {
                setClickToastVisible(false);
              }, 500);
              console.log("touched sendTransaction");

              try {
                const { signature, reciept } = await connector.sendTransaction({
                  method: "eth_sendTransaction",
                  params: [txData],
                });
                console.log("signature", signature, reciept);
              } catch (error) {
                const { code, message } = error;
                console.error(`error code: ${code}, message: ${message}`);
              }
            }}
          >
            sendTransaction
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

        {/* <div className="flex flex-col gap-10 mt-4">
          {!connected && (
            <>
              <button
                className={`w-full h-[48px] rounded-full bg-[#3894ff] text-white text-lg mt-5`}
                type="button"
                onClick={() => {
                  setClickToastVisible(true);
                  setTimeout(() => {
                    setClickToastVisible(false);
                  }, 500);
                  console.log("touched connect with request params, ret");

                  connector.connect({
                    requestParams: {},
                    ret: 'javascript:alert(123)<script>console.log("aaa")</script>',
                  });
                }}
              >
                connect with request params, ret
              </button>
            </>
          )}
        </div> */}
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
    </div>
  );
}
