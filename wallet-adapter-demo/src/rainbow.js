import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

import { ConnectButton } from '@rainbow-me/rainbowkit';

import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  rainbowWallet,
  bitgetWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

const projectId = '300bd040f44518f10a001e8f020ffa05'


//is not install,show icon for install guide.
let customWallets = [rainbowWallet, walletConnectWallet];
if(!window.bitkeep){
  customWallets.unshift(bitgetWallet);
}
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: customWallets,
    },
  ],
  {
    appName: 'My RainbowKit App',
    projectId: projectId,
  }
);

const config = getDefaultConfig({
  connectors,
  appName: 'My RainbowKit App',
  projectId: projectId,
  chains: [mainnet, polygon, optimism, arbitrum, base, zora],
  ssr: false, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

export default function RainbowDemo() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ConnectButton />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};