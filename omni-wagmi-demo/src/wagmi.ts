import { http, cookieStorage, createConfig, createStorage } from 'wagmi'
import { mainnet, optimism, sepolia } from 'wagmi/chains'

import {
  omniConnect,
} from '@bitget-wallet/omni-connect-wagmi-adaptor'

export function getConfig() {
  return createConfig({
    chains: [
      mainnet,
      //  sepolia,
      optimism,
    ],
    connectors: [
      omniConnect({
        metadata: {
          name: 'OmniConnect Wagmi Demo',
          iconUrl:
            'https://raw.githubusercontent.com/bitgetwallet/download/refs/heads/main/logo/jpeg/omni-connect-demo.jpeg',
          url: 'https://web3.bitget.com',
          privacyPolicyUrl: '',
          termsOfUseUrl: '',
        },
      }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [optimism.id]: http(),
    },
  })
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>
  }
}
