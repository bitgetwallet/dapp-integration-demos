import React, { useState } from "react";
import { BitgetWallet } from "@bitget-wallet/aptos-wallet-adapter";

const provider = window.bitkeep?.aptos;

export default function AptosDApp() {
  const [resultData, setResultData] = useState("");
  const [type, setType] = useState("");
  const [txId, setTxId] = useState("");

  let address = "";

  async function connect() {
    const account = await provider.connect();
    address = account.address;

    const accounts = await provider.account();

    setResultData(JSON.stringify({ account, accounts }, null, "\t"));
  }

  async function signAndSubmitTransaction() {
    await connect();

    const transaction = {
      arguments: [address, "717"],
      function: "0x1::coin::transfer",
      type: "entry_function_payload",
      type_arguments: ["0x1::aptos_coin::TestCoin"],
    };

    /** 自定义 gas fee
     *  default {
            "gas_unit_price":"100",
            "max_gas_amount":"10000"
        }
     */
    const options = {
      gas_unit_price: 100,
      max_gas_amount: 10000,
    };

    try {
      const pendingTransaction =
        await provider.signAndSubmitTransaction(transaction);
      // const pendingTransaction = await provider.signAndSubmitTransaction(transaction, options);

      // In most cases a dApp will want to wait for the transaction, in these cases you can use the typescript sdk
      // const client = new AptosClient('https://testnet.aptoslabs.com');
      // client.waitForTransaction(pendingTransaction.hash);
      setResultData(JSON.stringify(pendingTransaction, null, "\t"));
    } catch (error) {
      // see "Errors"
      setType("send error");
      setResultData(JSON.stringify({ error }, null, "\t"));
    }
  }

  return (
    <>
      <br />
      <br />
      <br />

      <button
        onClick={() => {
          connect();
        }}
      >
        connect
      </button>
      <button
        onClick={async () => {
          const bg = new BitgetWallet();
          const res = bg.deeplinkProvider({url: 'dappPageUrl'})
          console.log(res);
        }}
      >
        adapterConnect
      </button>

      <br />
      <br />
      <br />

      <button
        onClick={() => {
          signAndSubmitTransaction();
        }}
      >
        signAndSubmitTransaction
      </button>

      <br />
      <br />
      <br />
      <pre style={{ padding: "10px", background: "#f5f5f5" }}>{resultData}</pre>
      {type === "send" && txId && (
        <div>
          交易记录:{" "}
          <a
            href={
              "https://suiexplorer.com/txblock/" + txId + "?network=mainnet"
            }
          >
            https://suiexplorer.com/txblock/{txId}?network=mainnet
          </a>
        </div>
      )}

      {type === "sign" && (
        <div className="dapp-part">
          <button
            onClick={() => {
              alert("todo");
            }}
          >
            验证签名
          </button>
        </div>
      )}

      <br />
      <br />
      <br />
      <br />
    </>
  );
}
