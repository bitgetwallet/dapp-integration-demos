import React, { useState } from "react";
import { TransactionBlock } from "@mysten/sui.js/transactions";

const GlobalWallet = {
  register: (wallet) => {
    GlobalWallet["suiMainnet"] = wallet;
  },
};
const event = new CustomEvent("wallet-standard:app-ready", {
  detail: GlobalWallet,
});
window.dispatchEvent(event);

const provider = GlobalWallet.suiMainnet;

export default function SuiDApp() {
  let account = provider.account;
  let address = account && account.address;

  const [resultData, setResultData] = useState("");
  const [type, setType] = useState("");
  const [txId, setTxId] = useState("");

  provider.features["standard:events"].on("connect", (event) => {
    setResultData(
      JSON.stringify(
        {
          "event name": "connect",
          event: event,
        },
        null,
        "\t",
      ),
    );
  });
  provider.features["standard:events"].on("disconnect", (event) => {
    setResultData(
      JSON.stringify(
        {
          "event name": "disconnect",
          event: event,
        },
        null,
        "\t",
      ),
    );
  });
  provider.features["standard:events"].on("accountChanged", (event) => {
    setResultData(
      JSON.stringify(
        {
          "event name": "accountChanged",
          event: event,
        },
        null,
        "\t",
      ),
    );
  });

  async function connect() {
    await provider.features["standard:connect"].connect();
    setType("connect");
    setResultData(JSON.stringify(provider.account, null, "\t"));
  }

  async function signMessage() {
    let message = "Hello world!";
    const msgBytes = new TextEncoder().encode(message);

    // const message = ethers.utils.toUtf8Bytes('bitget');

    let signMessage = provider.features["sui:signMessage"].signMessage;
    const { signature, messageBytes } = await signMessage({
      message: msgBytes,
    });
    console.log({ message, signature });
    setType("sign");
    setResultData(JSON.stringify({ message, signature }, null, "\t"));
  }

  //https://docs.sui.io/guides/developer/sui-101/building-ptb
  //https://sdk.mystenlabs.com/typescript/sui-client
  async function signTransactionBlock() {
    await connect();
    let tx = new TransactionBlock();

    // Create a new coin with balance 100, based on the coins used as gas payment.
    // You can define any balance here.
    const [coin] = tx.splitCoins(tx.gas, [tx.pure(1)]);

    // Transfer the split coin to a specific address.
    tx.transferObjects([coin], tx.pure(address));

    /*
        官网参数说明：
        transactionBlock - either a TransactionBlock or BCS serialized transaction data bytes as a Uint8Array or as a base-64 encoded string.
        https://sdk.mystenlabs.com/typescript/sui-client#arguments
    */

    /*
        正确示例
        https://docs.martianwallet.xyz/docs/methods/sui/sign-transaction-block
    */

    // tx.moveCall({
    //     target: '0x2::devnet_nft::mint',
    //     arguments: [
    //       tx.pure('name'),
    //       tx.pure('descriotion'),
    //       tx.pure('image'),
    //     ]
    // });
    const input = {
      transactionBlockSerialized: tx.serialize(),
      options: {
        showEffects: true,
      },
    };

    let signTransactionBlock =
      provider.features["sui:signTransactionBlock"].signTransactionBlock;
    const transaction = await signTransactionBlock({ transactionBlock: tx });
    // const transaction = await signTransactionBlock(input);
    console.log("signTransactionBlock", { tx, transaction });
    setType("sign");
    setResultData(JSON.stringify({ tx, transaction }, null, "\t"));
  }

  async function signAndExecuteTransactionBlock() {
    await connect();

    let tx = new TransactionBlock();
    const [coin] = tx.splitCoins(tx.gas, [tx.pure(1)]);
    tx.transferObjects([coin], tx.pure(address));

    let signAndExecuteTransactionBlock =
      provider.features["sui:signAndExecuteTransactionBlock"]
        .signAndExecuteTransactionBlock;
    const result = await signAndExecuteTransactionBlock({
      transactionBlock: tx,
      options: { showEffects: true },
    });
    console.log("signAndExecuteTransactionBlock", { tx, result });
    setType("send");
    setTxId(result.digest);
    setResultData(JSON.stringify({ tx, result, type }, null, "\t"));
  }

  return (
    <>
      <h2>Sui DApp Demo</h2>
      <div className="dapp-part">
        <div>
          bitget sui:{" "}
          <a href="https://web3.bitget.com/zh-CN/docs/provider-api/sui.html">
            https://web3.bitget.com/zh-CN/docs/provider-api/sui.html
          </a>
        </div>
        <div>
          sui:{" "}
          <a href="https://docs.sui.io/guides/developer/sui-101/building-ptb">
            https://docs.sui.io/guides/developer/sui-101/building-ptb
          </a>
        </div>
        <div>
          sui sign:{" "}
          <a href="https://docs-zh.sui-book.com/concepts/cryptography/transaction-auth/signatures/">
            https://docs-zh.sui-book.com/concepts/cryptography/transaction-auth/signatures/
          </a>
        </div>
      </div>

      <div className="dapp-part">
        <button
          onClick={() => {
            connect();
          }}
        >
          connect
        </button>
      </div>

      <div className="dapp-part">
        <button
          onClick={() => {
            signMessage();
          }}
        >
          signMessage
        </button>
      </div>

      <div className="dapp-part">
        <button
          onClick={() => {
            signTransactionBlock();
          }}
        >
          signTransactionBlock
        </button>
      </div>

      <div className="dapp-part">
        <button
          onClick={() => {
            signAndExecuteTransactionBlock();
          }}
        >
          signAndExecuteTransactionBlock
        </button>
      </div>

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
