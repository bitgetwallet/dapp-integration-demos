//https://github.com/BitgetWalletTeam/starknetkit
import React, {useEffect,useState} from 'react';

import { connect, disconnect } from "starknetkit"
import { InjectedConnector } from "starknetkit/injected"

const connectors = [
  new InjectedConnector({ options: { id: "argentX" } }),
  new InjectedConnector({ options: { 
    id: "bitkeep",
    // provider: window.starknet_bitkeep
  } }),
  new InjectedConnector({ options: { id: "braavos" } })
];


export default function StarknetkitDemo() {
  const [walletName, setWalletName] = useState("")
  const [account, setAccount] = useState("")

  const disconnectWallet = async() => {
    const result = await disconnect();

    setWalletName('')
    setAccount('')
    console.log('disconnectWallet', result);
    localStorage.clear();
  }


  const connectWallet = async() => {
    let options = {};
    // options.connectors = connectors;
    const { wallet } = await connect(options);

    console.log(wallet);
   
    // if(wallet && wallet.isConnected) {
      setWalletName(wallet.name)
      setAccount(wallet.selectedAddress)
    // }
  }

  return (
    <div className="App">
      Starknetkit Demo:  &nbsp;&nbsp;

      {(account == '') ?
        <>
        { walletName }, account { account }
        <button onClick={ ()=>{ disconnectWallet(); } }>disconnect Wallet</button>        
        </>
        : <button onClick={ ()=>{ connectWallet(); } }>connect Wallet</button>
      }
    </div>
  );
}
