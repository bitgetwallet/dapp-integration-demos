import React, { useEffect, useState } from "react";
import { getAptosWallets } from "@aptos-labs/wallet-standard";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const provider = window.bitkeep?.aptos || window.aptos;

export default function Aptos62DApp() {
  const {
    connect,
    account,
    network,
    connected,
    disconnect,
    wallet,
    wallets,
    signAndSubmitTransaction,
    signAndSubmitBCSTransaction,
    signTransaction,
    signMessage,
    signMessageAndVerify,
    changeNetwork,
  } = useWallet();
  const [currentInfo, setCurrentInfo] = useState({});
  const [params, setParams] = useState("");
  // useEffect(() => {
  //     const removeRegisterListener = on("register", function () {
  //       // The dapp can add new aptos wallets to its own state context as they are registered
  //       let { aptosWallets } = getAptosWallets();
  //       console.log('aptosWallets', aptosWallets);
  //     });
  //     return () => {
  //       const removeUnregisterListener = on("unregister", function () {
  //         let { aptosWallets } = getAptosWallets();
  //       });
  //     }
  // }, []);
  const getWallets = () => wallets;
  const changeNet = (args = ["devnet"]) => changeNetwork("devnet");
  const providerSwitchNet = async (args = ["devnet"]) =>
    await provider.changeNetwork("devnet");
  const getNetwork = () => network;

  const signMsg = async (
    args = ["The message to be signed and displayed to the user", "1"],
  ) => {
    if (!connected) return;
    return await signMessage({
      message: args[0],
      nonce: args[1],
    });
  };
  const signTx = async (
    args = [
      '{"arguments":["10000","32539"],"function":"0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::router::swap_exact_input_doublehop","type":"entry_function_payload","type_arguments":["0x1::aptos_coin::AptosCoin","0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T","0x159df6b7689437016108a019fd5bef736bac692b6d4a1f10c941f6fbb9a74ca6::oft::CakeOFT"]}'
    ]
  ) => {
    // if (!connected) return;
    return await signTransaction(JSON.parse(args?.[0]));
  };
  const providerSignTx = async (
    args = [
      '{"arguments":["10000","32539"],"function":"0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::router::swap_exact_input_doublehop","type":"entry_function_payload","type_arguments":["0x1::aptos_coin::AptosCoin","0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T","0x159df6b7689437016108a019fd5bef736bac692b6d4a1f10c941f6fbb9a74ca6::oft::CakeOFT"]}'
    ]
  ) => {
    await provider.connect();
    await provider.account();
    return await provider.signTransaction(JSON.parse(args?.[0]));
  };
  const signAndSubmitTx = async (
    args = [
      '{"functionArguments":["10000","32539"],"function":"0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::router::swap_exact_input_doublehop","type":"entry_function_payload","typeArguments":["0x1::aptos_coin::AptosCoin","0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T","0x159df6b7689437016108a019fd5bef736bac692b6d4a1f10c941f6fbb9a74ca6::oft::CakeOFT"]}'
    ]
  ) => {
    if (!connected) return;
    return await signAndSubmitTransaction({
      data: JSON.parse(args?.[0]),
      options: {},
    });
  };
  const providerSignAndSubmitTx = async (
    args = [
      '{"functionArguments":["10000","32539"],"function":"0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::router::swap_exact_input_doublehop","type":"entry_function_payload","typeArguments":["0x1::aptos_coin::AptosCoin","0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T","0x159df6b7689437016108a019fd5bef736bac692b6d4a1f10c941f6fbb9a74ca6::oft::CakeOFT"]}'
    ]
  ) => {
    if (!connected) return;
    // {
    //   "type": "entry_function_payload",
    //   "type_arguments": [
    //     "0x1::aptos_coin::AptosCoin",
    //     "0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T",
    //     "0x159df6b7689437016108a019fd5bef736bac692b6d4a1f10c941f6fbb9a74ca6::oft::CakeOFT"
    //   ],
    //   "arguments": [
    //     "10000",
    //     "32539"
    //   ],
    //   "function": "0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::router::swap_exact_input_doublehop"
    // }
    return await provider.signAndSubmitTransaction(JSON.parse(args?.[0]));
  };

  const funcArr = [
    getWallets,
    getNetwork,
    providerSwitchNet,
    changeNet,
    disconnect,
    signMsg,
    signTx,
    providerSignTx,
    signAndSubmitTx,
    providerSignAndSubmitTx,
  ]
  // 防止name丢失
  const funcNameArr = [
    'getWallets',
    'getNetwork',
    'providerSwitchNet',
    'changeNet',
    'disconnect',
    'signMsg',
    'signTx',
    'providerSignTx',
    'signAndSubmitTx',
    'providerSignAndSubmitTx',
  ]
  return (
    <>
      {wallets.map((it, i) => (
        <button
          key={it.name}
          onClick={async () => await connect(it?.name)}
          className="walletContent"
        >
          <img src={it?.icon} alt="" className="connectIcon" />
          <div>{it?.name}</div>
          <b>{wallet?.name === it?.name && "Connected"}</b>
        </button>
      ))}
      {!!connected && (
        <div>
          address:{account?.address} <br />
          publicKey:{account?.publicKey}
        </div>
      )}
      <textarea
        type="text"
        value={params}
        onChange={(e) => setParams(e.target.value)}
        placeholder={`multi params divide by:';;'`}
      />
      <div style={{ display: "grid", gap: 20 }}>
        {funcArr.map((func, index) => (
          <div key={index}>
            <button
              onClick={async () => {
                try {
                  setCurrentInfo({
                    "function name": func.name,
                    "function params": params.split(";;"),
                    "function returns": await func(
                      params ? params.split(";;") : undefined,
                    ),
                  });
                } catch (e) {
                  console.error(e);
                }
              }}
            >
              {func?.name || funcNameArr[index]}
            </button>
          </div>
        ))}
        {Object.keys(currentInfo).map((k) => (
          <div key={k} style={{ wordWrap: "break-word" }}>
            {k}: {JSON.stringify(currentInfo[k])}
          </div>
        ))}
      </div>
    </>
  );
}
