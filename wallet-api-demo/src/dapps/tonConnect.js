import React, { useState, useEffect, useCallback } from 'react';
import { TonConnectUI } from '@tonconnect/ui';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const tonConnectUI = new TonConnectUI({
  manifestUrl: 'https://app.ston.fi/tonconnect-manifest.json',
  walletsListConfiguration: {
    includeWallets: [
      {
        name: 'Bitget Wallet',
        appName: 'bitgetTonWallet',
        jsBridgeKey: 'bitgetTonWallet',
        imageUrl: 'https://raw.githubusercontent.com/bitkeepwallet/download/main/logo/png/bitget%20wallet_logo_iOS.png',
        aboutUrl: 'https://web3.bitget.com',
        bridgeUrl: 'https://bridge.tonapi.io/bridge',
        universalLink: 'https://bkcode.vip/ton-connect',
        deepLink: 'bitkeep://',
        platforms: ['ios', 'android', 'chrome'],
      },
    ],
  },
});

export default function EnhancedTonConnectDApp() {
  const [currentInfo, setCurrentInfo] = useState({});
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = tonConnectUI.onStatusChange((walletInfo) => {
      console.log('Wallet status changed:', walletInfo);
      setIsConnected(!!walletInfo);
    });

    return unsubscribe;
  }, []);

  const handleAction = useCallback(async (action, name) => {
    setError(null);
    try {
      const result = await action();
      setCurrentInfo({ 'function name': name, 'function returns': result });
    } catch (e) {
      console.error(e);
      setError(e.message || 'An error occurred');
    }
  }, []);

  const actions = [
    { name: 'openBitgetTonWallet', action: () => tonConnectUI.openSingleWalletModal('bitgetTonWallet') },
    { name: 'openModal', action: () => tonConnectUI.openModal() },
    { name: 'closeModal', action: () => tonConnectUI.closeModal() },
    { name: 'currentWallet', action: () => tonConnectUI.wallet },
    { name: 'currentWalletInfo', action: () => tonConnectUI.walletInfo },
    { name: 'currentAccount', action: () => tonConnectUI.account },
    { name: 'currentIsConnectedStatus', action: () => tonConnectUI.connected },
    { name: 'disconnect', action: () => tonConnectUI.disconnect() },
    { name: 'getWallets', action: () => tonConnectUI.getWallets() },
    { name: 'sendTransaction', action: async () => {
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [
          {
            address: 'EQBBJBB3HagsujBqVfqeDUPJ0kXjgTPLWPFFffuNXNiJL0aA',
            amount: '20000000',
          },
          {
            address: 'EQDmnxDMhId6v1Ofg_h5KR5coWlFG6e86Ro3pc7Tq4CA0-Jn',
            amount: '60000000',
          },
        ],
      };
      return await tonConnectUI.sendTransaction(transaction);
    }},
  ];

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Enhanced TON Connect DApp Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map(({ name, action }) => (
            <Button
              key={name}
              onClick={() => handleAction(action, name)}
              disabled={name === 'disconnect' && !isConnected}
              className="w-full"
            >
              {name}
            </Button>
          ))}
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {Object.keys(currentInfo).length > 0 && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Action Result</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.entries(currentInfo).map(([key, value]) => (
                <div key={key} className="mb-2">
                  <strong>{key}:</strong> {JSON.stringify(value, null, 2)}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
