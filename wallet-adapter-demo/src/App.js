import WalletConnectDemo from './wallet-connect'
import WalletConnectQrcodeDemo from './wallet-connect-qrcode'

import Web3OnboardDemo from './web3-onboard'

import RainbowDemo from './rainbow'

import WalletSelectorDemo from './wallet-selector'

import Web3ReactDemo from './web3-react'

// import StarknetkitDemo from './starknetkit'

export default function App() {
  let docLink = 'https://web3.bitget.com/zh-CN/docs';

  return (<>
    <h2>Wallet Adapter Demo</h2>

    <div>
      1. 在（安装 + 未安装）两种情况均出现 Bitget Wallet <br />
      2. Bitget Wallet API Docs <a href={ docLink }>{ docLink }</a>
    </div>

    <div style={{ height: '60px' }}></div>

    <WalletConnectDemo />
  </>)
}