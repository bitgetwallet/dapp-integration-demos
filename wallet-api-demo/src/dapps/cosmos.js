import React, { useState } from "react";

export default function CosmosDApp() {
  const [resultData, setResultData] = useState("");

  return (
    <>
      <h2>Cosmos Demo</h2>
      <div className="dapp-part">
        <button
          onClick={() => {
            alert("todo");
          }}
        >
          connect
        </button>
      </div>

      <div className="dapp-part">
        <button
          onClick={() => {
            alert("todo");
          }}
        >
          signMessage
        </button>
      </div>

      <pre style={{ padding: "10px", background: "#f5f5f5" }}>{resultData}</pre>

      <div className="dapp-part">
        <button
          onClick={() => {
            alert("todo");
          }}
        >
          验证签名
        </button>
      </div>

      <br />
      <br />
      <br />
      <br />
    </>
  );
}
