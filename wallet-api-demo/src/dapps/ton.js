import React, { useState } from "react";

const provider = window.bitkeep?.ton;

export default function TonDApp() {
  const [currentInfo, setCurrentInfo] = useState({});
  const connect = async () => {
    await provider.send('ton_requestWallets');
    return await provider.send('ton_requestAccounts');
  }
  const sign = async () => {
    return await provider.send(
      'ton_rawSign',
      [{
          data: 'ABCD123456'
      }]
    );
  }
  return (
    <>
      <h2>Ton DApp Demo</h2>
      <div style={{ display: "grid", gap: 20 }}>
        {[
          connect,
          sign,
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
