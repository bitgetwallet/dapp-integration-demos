import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupBitgetWallet } from "@near-wallet-selector/bitget-wallet";

import "@near-wallet-selector/modal-ui/styles.css"


const projectId = '300bd040f44518f10a001e8f020ffa05'

//modules 固定显示 bitget
const selector = await setupWalletSelector({
  network: "testnet",
  modules: [setupNearWallet(), setupBitgetWallet()],
});

const modal = setupModal(selector, {
  contractId: "test.testnet",
});

export default function WalletSelectorDemo() {
  modal.show();
};