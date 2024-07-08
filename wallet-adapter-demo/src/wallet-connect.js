// https://docs.walletconnect.com/web3modal/upgrade

import React, {useEffect,useState} from 'react';
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { WagmiConfig, WagmiProvider } from 'wagmi'
import { bsc, blast, arbitrum, mainnet } from 'viem/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'

import bitgetConfig from './bitget-wallet-config.json';

const chains = [arbitrum, mainnet, bsc, blast];
const projectId = '300bd040f44518f10a001e8f020ffa05'

const queryClient = new QueryClient()

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

//is not install,show icon for install guide.
let customWallets = [];
if(!window.bitkeep){
  customWallets.push(bitgetConfig);
}

createWeb3Modal({ 
  wagmiConfig, 
  projectId,
  chains,
  defaultChain: bsc,
  enableAnalytics: true,
  customWallets: customWallets
})

export default function WalletConnectDemo() {
  const { open, selectedNetworkId } = useWeb3Modal();
  // const { address, isConnecting, isDisconnected } = useAccount()

  console.log(selectedNetworkId, chains)

  useEffect(()=>{
      open();
  }, []);

  return (<>
    <div style={{ padding: '20px 0' }}>官网demo <a href="https://web3modal.com/">https://web3modal.com/</a></div>
    <WagmiConfig config={wagmiConfig}>
     <QueryClientProvider client={queryClient}>
        <button style={{ fontSize: '20px' }} onClick={() => open()}>Wallet Connect Demo</button>
     </QueryClientProvider>
    </WagmiConfig>
  </>);
}


