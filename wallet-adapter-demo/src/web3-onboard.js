//3. 官方 demo https://onboard.blocknative.com/examples/connect-wallet
//4. 官方 react demo https://reactdemo.blocknative.com/

import Onboard from '@web3-onboard/core'
import { ethers } from 'ethers'


import injectedModule from '@web3-onboard/injected-wallets'

import bitgetModule from '@web3-onboard/bitget'

async function Web3OnboardDemo() {
  const MAINNET_RPC_URL = 'https://mainnet.infura.io/v3/122345'

  const onboard = Onboard({
    //固定出现 bitget，即使未安装
    wallets: [injectedModule(), bitgetModule()],
    chains: [
      {
        id: '0x1',
        token: 'ETH',
        label: 'Ethereum Mainnet',
        rpcUrl: MAINNET_RPC_URL
      },
      {
        id: '0x2105',
        token: 'ETH',
        label: 'Base',
        rpcUrl: 'https://mainnet.base.org'
      }
    ]
  })

  const wallets = await onboard.connectWallet()

  return (
    <div className="App">
      web3 onboard
    </div>
  );
}

export default Web3OnboardDemo;
