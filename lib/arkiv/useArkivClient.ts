import type { Chain, PublicArkivClient, WalletArkivClient } from '@arkiv-network/sdk';
import { createPublicClient as createArkivPublicClient, createWalletClient as createArkivWalletClient, http } from '@arkiv-network/sdk';
import { useCallback } from 'react';
import { useWalletClient } from 'wagmi';

import config from 'configs/app';

function getChainConfig(): Chain {
  const [ rpcUrl ] = config.chain.rpcUrls;
  const currency = config.chain.currency;
  return {
    id: Number(config.chain.id),
    name: config.chain.name || 'Unknown Chain',
    nativeCurrency: {
      name: currency.name || 'Unknown',
      symbol: currency.symbol || 'UNKNOWN',
      decimals: currency.decimals,
    },
    rpcUrls: {
      'default': { http: [ rpcUrl ] },
      'public': { http: [ rpcUrl ] },
    },
  };
}

export function createPublicClient(): PublicArkivClient {
  const chain = getChainConfig();
  return createArkivPublicClient({
    chain,
    transport: http(),
  });
}

export interface ArkivClientReturn {
  isConnected: boolean;
  isLoading: boolean;
  createClient: () => Promise<WalletArkivClient>;
}

export function useArkivClient(): ArkivClientReturn {
  const { data: walletClient, isPending } = useWalletClient();

  const createClient = useCallback(async() => {
    if (!walletClient) {
      throw new Error('Wallet not connected');
    }

    const chain = getChainConfig();
    return createArkivWalletClient({
      account: walletClient.account.address,
      chain,
      transport: http(),
    });
  }, [ walletClient ]);

  return {
    isConnected: Boolean(walletClient),
    isLoading: isPending,
    createClient,
  };
}
