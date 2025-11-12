import type { Chain, PublicArkivClient, WalletArkivClient } from '@arkiv-network/sdk';
import { createPublicClient as createArkivPublicClient, createWalletClient as createArkivWalletClient, http } from '@arkiv-network/sdk';
import { kaolin, localhost, marketplace } from '@arkiv-network/sdk/chains';
import { useCallback } from 'react';
import { custom } from 'viem';
import { useWalletClient } from 'wagmi';

import config from 'configs/app';

function getChainConfig(): Chain {
  const id = Number(config.chain.id);
  const [ rpcUrl ] = config.chain.rpcUrls;
  const currency = config.chain.currency;

  const chain = [ kaolin, localhost, marketplace ].find(chain => chain.id === id);

  return {
    // Set block explorers url
    ...(chain ?? {}),
    id,
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

    const chain = (walletClient.chain ? {
      ...walletClient.chain,
      id: walletClient.chain.id,
      name: walletClient.chain.name,
      nativeCurrency: walletClient.chain.nativeCurrency,
      rpcUrls: walletClient.chain.rpcUrls,
    } : getChainConfig()) as unknown as Chain;

    return createArkivWalletClient({
      account: walletClient.account.address,
      chain,
      // @ts-expect-error - viem version mismatch between SDK's bundled viem and project's viem
      transport: custom({
        request: walletClient.request,
      }),
    });
  }, [ walletClient ]);

  return {
    isConnected: Boolean(walletClient),
    isLoading: isPending,
    createClient,
  };
}
