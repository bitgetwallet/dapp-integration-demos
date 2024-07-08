import React, { useState } from "react";
import { useAccount, useNetwork, useSignTypedData } from "@starknet-react/core";
import { FormEvent } from "react";
import { shortString, typedData } from "starknet";
import {
  Account,
  constants,
  ec,
  json,
  stark,
  hash,
  CallData,
  cairo,
  Contract,
} from "starknet";
import { abi } from "../contracts/abi";
// import { connect as starknetkitconnect, disconnect } from "starknetkit";

const provider = window.starknet;
// const provider = window.starknet_bitkeep;

const contractAddress_1 =
  "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
const contractAddress_2 =
  "0x078f36c1d59dd29e00a0bb60aa2a9409856f4f9841c47f165aba5bab4225aa6b";

//https://www.starknetjs.com/docs/api/
//https://book.starknet.io/ch02-09-starknet-js.html
//https://github.com/subvisual/starknet-demo-dapp
//https://starknet-react.com/docs/getting-started

export default function StarkNetDApp() {
  let account = {};
  let privateKey = "";

  const [resultData, setResultData] = useState("");
  const [type, setType] = useState("");
  const [txId, setTxId] = useState("");
  const [address, setAddress] = useState("");

  provider?.on("networkChanged", (event) => {
    setResultData(
      JSON.stringify(
        {
          "event name": "networkChanged",
          event: event,
        },
        null,
        "\t",
      ),
    );
  });
  provider?.on("accountsChanged", (event) => {
    setResultData(
      JSON.stringify(
        {
          "event name": "accountsChanged",
          event: event,
        },
        null,
        "\t",
      ),
    );
  });

  async function connect() {
    const res = await provider.enable();
    account = provider.account || {};
    let address = account && account.address;

    setAddress(address);

    let { selectedAddress, starknetJsVersion, version, chainId } = provider;
    let basicInfo = {
      address,
      selectedAddress,
      starknetJsVersion,
      version,
      chainId,
    };
    setType("connect");
    setResultData(JSON.stringify({ connected: true, basicInfo }, null, "\t"));
  }

  async function addCurrency() {
    setResultData(JSON.stringify({}, null, "\t"));
    let currentcyInfo = {
      address: "0x0A4E1BdFA75292A98C15870AeF24bd94BFFe0Bd4",
      symbol: "FOTA",
      name: "FOTA",
    };
    let result = await provider.request({
      type: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: currentcyInfo,
      },
    });
    setType("addCurrency");
    setResultData(JSON.stringify({ currentcyInfo, result }, null, "\t"));
  }

  const message = {
    domain: {
      name: "Starknet demo app",
      version: "1",
      chainId: "SN_MAIN",
    },
    types: {
      StarkNetDomain: [
        { name: "name", type: "felt" },
        { name: "version", type: "felt" },
        { name: "chainId", type: "felt" },
      ],
      Message: [{ name: "message", type: "felt" }],
    },
    message: {
      message: "sign message test",
    },
    primaryType: "Message",
  };
  //https://www.starknetjs.com/docs/guides/signature/
  async function signMessage() {
    setResultData(JSON.stringify({}, null, "\t"));
    const signature = await provider.signMessage(message);
    setType("sign");
    setResultData(JSON.stringify({ signature }, null, "\t"));
  }
  async function verify() {
    if (!address) {
      alert("please connect 1st");
      return;
    }
    const contractAccount = new Contract(abi, address, provider);
    const msgHash5 = typedData.getMessageHash(message, address);
    let res;
    try {
      await contractAccount.isValidSignature(msgHash5, resultData.signature);
      res = true;
    } catch {
      res = false;
    }
    console.log("Result (boolean) =", res);
  }

  //execute(transactions, abis, transactionsDetail, sdkVersion)
  // async function execute(){
  //   setResultData(JSON.stringify({}, null, '\t'));
  //   if(!address){
  //       alert('please connect 1st');
  //       return;
  //   }
  //   let transactions = [
  //       {
  //           contractAddress: contractAddress_1,
  //           from: address,
  //           entrypoint: "approve",
  //           nonce: '1',
  //           calldata: [address, '10']
  //       }
  //     ];
  //   let abis = {};
  //   let transactionsDetail = {};

  //   // const account = new Account(
  //   //     provider,
  //   //     address,
  //   //     privateKey
  //   // );

  //   let result = await provider.execute(transactions);
  //   console.log('signTransactionBlock', { transactionsDetail, transactions });
  //   setType('execute');
  //   setTxId(result.transaction_hash)
  //   setResultData(JSON.stringify( { result, transactionsDetail, transactions }, null, '\t'));
  // }

  async function declare() {
    setResultData(JSON.stringify({}, null, "\t"));

    // const provider = new Provider({ sequencer: { baseUrl: "http://127.0.0.1:5050" } });
    // // connect your account. To adapt to your own account:
    // const privateKey0 = process.env.OZ_ACCOUNT_PRIVATE_KEY;
    // const account0Address = "0x123....789";
    // add ,"1" after privateKey0 if this account is not a Cairo 0 contract
    // Declare Test contract in devnet
    // const compiledTestSierra = json.parse(fs.readFileSync( "./compiledContracts/test.sierra").toString("ascii"));
    // const compiledTestCasm = json.parse(fs.readFileSync( "./compiledContracts/test.casm").toString("ascii"));
    // const declareResponse = await provider.declare({
    //   contract: compiledTestSierra,
    //   casm: compiledTestCasm
    // });
    // console.log('Test Contract declared with classHash =', declareResponse.class_hash);

    let params = {
      // transaction_hash: '0x0450aa91785e283e0490a1e94597801b55ce84ab6cef58f6f8bb46a5c2cbfb08',
      classHash:
        "0x0450aa91785e283e0490a1e94597801b55ce84ab6cef58f6f8bb46a5c2cbfb08",
      contract: contractAddress_1,
    };
    let result = await provider.declare(params);

    setType("declare");
    setResultData(JSON.stringify({ params, result }, null, "\t"));
  }

  function connectToAccount() {
    const privateKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"; // Use your own privateKey
    const accountAddress =
      "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";  // Use your own address
    const account = new Account(provider, accountAddress, privateKey);
  }
  async function interactWithDeployedContract() {
    setResultData(JSON.stringify({}, null, "\t"));
    if (!address) {
      alert("please connect 1st");
      return;
    }
    const transactions = {
      contractAddress:
        "0x078f36c1d59dd29e00a0bb60aa2a9409856f4f9841c47f165aba5bab4225aa6b",
      entrypoint: "transfer",
      calldata: CallData.compile({
        recipient:
          "0x024408848287e91adc4b4593b57a1e829a2951c9386cabc87d7aeba70560df2d",
        amount: cairo.uint256(1000n),
      }),
    };
    // const transactions = {
    //   "contractAddress": "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    //   "calldata": [
    //       "3055261660830722006547698919883585605584552967779072711973046411977660833095",
    //       "100000000000000",
    //       "0"
    //   ],
    //   "entrypoint": "transfer"
    // }
    const res = await provider.execute(transactions);
    // res = {
    //   transaction_hash: "0x7b7747f475fba2d76f8a576d46c5e2ad4267d0d66f4ddb5bae25d9f0bfe83b2"
    // }
    setType("execute");
    setTxId(res.transaction_hash);
    setResultData(JSON.stringify({ res, transactions }, null, "\t"));
  }

  return (
    <>
      <h2>Starknet DApp Demo</h2>
      <div className="dapp-part">
        <div>
          bitget starknet:{" "}
          <a href="https://web3.bitget.com/zh-CN/docs/provider-api/starknet.html">
            https://web3.bitget.com/zh-CN/docs/provider-api/starknet.html
          </a>
        </div>
      </div>

      <h2>{address}</h2>

      <div className="dapp-part">
        <button onClick={connect}>connect</button>
      </div>

      <div className="dapp-part">
        <button onClick={addCurrency}>addCurrency</button>
      </div>

      <div className="dapp-part">
        <button onClick={signMessage}>signMessage</button>
      </div>
      <div className="dapp-part">
        <button onClick={connectToAccount}>connectToAccount</button>
      </div>
      <div className="dapp-part">
        <button onClick={interactWithDeployedContract}>
          interactWithDeployedContract
        </button>
      </div>

      <div className="dapp-part">
        {/* <button
          onClick={async () => {
            try {
              const wallet = await starknetkitconnect()
            } catch (error) {}
          }}
        >
          starknetkitconnect
        </button> */}
      </div>

      {/* <div className="dapp-part">
      <button onClick={execute}>execute (sendTransaction)</button>
    </div> */}

      {/* <div className="dapp-part">
      <button onClick={ ()=>{
      declare();
    }}>declare</button>
    </div> */}

      <pre style={{ padding: "10px", background: "#f5f5f5" }}>{resultData}</pre>

      {type === "execute" && txId && (
        <div>
          交易记录:{" "}
          <a href={"https://starkscan.co/tx/" + txId}>
            {"https://starkscan.co/tx/" + txId}
          </a>
        </div>
      )}

      {/* { type === 'sign' && <div className="dapp-part">
      <button onClick={verify}>验证签名</button>
    </div>} */}

      <br />
      <br />
      <br />
      <br />
    </>
  );
}
