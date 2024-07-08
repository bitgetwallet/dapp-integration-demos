import React, { useState } from "react";
import {
  TransactionMessage,
  VersionedTransaction,
  SystemProgram,
  Connection,
  Transaction,
} from "@solana/web3.js";

const provider = window.bitkeep?.solana;

// https://web3.bitget.com/zh-CN/docs/provider-api/solana.html

export default function SolanaDApp() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [signature, setSignature] = useState("");
  const [transaction, setTransaction] = useState("");
  const [signedTransaction, setSignedTransaction] = useState("");

  const connection = new Connection("https://api.devnet.solana.com/");

  const connect = async () => {
    if (!provider) return;
    try {
      await provider.connect();
      const contractAddress = await provider.getAccount();
      //  provider.publicKey.toString(); // Once the web application is connected to Bitkeep,
      setConnected(true);
      setAddress(contractAddress);
    } catch {
      setConnected(false);
      alert("connected error");
    }
  };

  const signMessage = async () => {
    if (!connected) return;
    try {
      // uint8Array
      const message = `You can use uint8array to verify`;
      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await provider.signMessage(encodedMessage);
      const signature = signedMessage?.signature;
      setSignature(signature);
    } catch (e) {
      alert(e);
    }
  };

  const signVersionedTransaction = async () => {
    if (!provider) return;

    let minRent = await connection.getMinimumBalanceForRentExemption(0);

    // create array of instructions
    const instructions = [
      SystemProgram.transfer({
        fromPubkey: provider.publicKey,
        toPubkey: provider.publicKey,
        lamports: minRent,
      }),
    ];

    let blockhash = await connection
      .getLatestBlockhash()
      .then((res) => res.blockhash);

    // create v0 compatible message
    const messageV0 = new TransactionMessage({
      payerKey: provider.publicKey,
      recentBlockhash: blockhash,
      instructions,
    }).compileToV0Message();

    // make a versioned transaction
    const transactionV0 = new VersionedTransaction(messageV0);

    const signedTransaction = await provider.signTransaction(transactionV0);
    setTransaction(JSON.stringify(signedTransaction));
  };

  const signLegacyTransaction = async () => {
    if (!provider) return;

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: provider.publicKey, //payer
        toPubkey: provider.publicKey, //toAccount
        lamports: 100,
      }),
    );
    transaction.feePayer = provider.publicKey;

    const anyTransaction = transaction;
    anyTransaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    const signedTransaction = await provider.signTransaction(transaction);
    setSignedTransaction(JSON.stringify(signedTransaction));
  };

  return (
    <>
      <h2>Solana Dapp Demo</h2>

      <br />
      <button onClick={connect}>connect</button>
      <p>{connected ? "连接成功" : "请连接"}</p>
      {address && <p>地址：{address}</p>}
      <br />

      <br />
      <button onClick={signMessage}>signMessage</button>
      {signature && (
        <p style={{ width: "80%", wordBreak: "break-all" }}>
          签名： {signature}
        </p>
      )}
      <br />

      <br />
      <button onClick={signVersionedTransaction}>
        signVersionedTransaction
      </button>
      {transaction && <p>Versioned Transaction:{transaction}</p>}
      <br />

      <br />
      <button onClick={signLegacyTransaction}>signLegacyTransaction</button>
      {signedTransaction && <p>Legacy Transaction:{signedTransaction}</p>}
      <br />
      <br />
    </>
  );
}
