import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";

import { bitgetWalletLite } from "@bitget-wallet/omni-connect-rainbowkit-adaptor";

const projectId = "YOUR_PROJECT_ID";
const appName = "OmniConnect RainbowKit demo";

const bitgetWalletLiteConnector = () =>
  bitgetWalletLite({
    metadata: {
      name: appName,
      iconUrl:
        "https://raw.githubusercontent.com/bitgetwallet/download/refs/heads/main/logo/jpeg/omni-connect-demo.jpeg",
      url: "https://web3.bitget.com",
      privacyPolicyUrl: "",
      termsOfUseUrl: "",
    },
  });

const connectors = connectorsForWallets(
  [
    {
      groupName: "Popular",
      wallets: [ bitgetWalletLiteConnector],
    },
  ],
  {
    projectId,
    appName,
  }
);

export const config = createConfig({
  connectors: [
    ...connectors,
  ],
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
  multiInjectedProviderDiscovery: false,
  ssr: true,
});
