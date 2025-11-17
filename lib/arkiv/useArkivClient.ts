import type { Chain, PublicArkivClient, WalletArkivClient } from '@arkiv-network/sdk';
import { createPublicClient as createArkivPublicClient, createWalletClient as createArkivWalletClient, http } from '@arkiv-network/sdk';
import * as chains from '@arkiv-network/sdk/chains';
import { useCallback } from 'react';
import { custom } from 'viem';
import { useAccount, useSwitchChain, useWalletClient } from 'wagmi';

import config from 'configs/app';

function getChainConfig(): Chain {
  const id = Number(config.chain.id);
  const [ rpcUrl ] = config.chain.rpcUrls;
  const currency = config.chain.currency;

  const chain = Object.values(chains).find((chain) => chain.id === id);

  return {
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
    ...(chain ? { blockExplorers: chain.blockExplorers } : {}),
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
  const chain = getChainConfig();
  const { data: walletClient, isPending } = useWalletClient({ chainId: chain.id });
  const { address, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  const createClient = useCallback(async() => {
    if (!walletClient) {
      throw new Error('Wallet not connected');
    }

    if (!address) {
      throw new Error('Account not connected');
    }

    if (chainId && chainId !== chain.id) {
      await switchChainAsync({ chainId: chain.id });
    }

    return createArkivWalletClient({
      account: address,
      chain,
      transport: custom(walletClient) as Parameters<typeof createArkivWalletClient>[0]['transport'],
    });
  }, [ walletClient, address, chainId, chain, switchChainAsync ]);

  return {
    isConnected: Boolean(walletClient),
    isLoading: isPending,
    createClient,
  };
}
