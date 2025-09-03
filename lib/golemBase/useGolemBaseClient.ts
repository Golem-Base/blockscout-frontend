import type { GolemBaseClient, GolemBaseROClient } from 'golem-base-sdk';
import { createClient as createSdkClient, createROClient, Tagged } from 'golem-base-sdk';
import { useCallback } from 'react';
import { useWalletClient } from 'wagmi';

import config from 'configs/app';
import { httpToWs } from 'lib/httpToWs';

function getConfig() {
  const [ rpcUrl ] = config.chain.rpcUrls;
  return { chainId: Number(config.chain.id), rpcUrl, wsUrl: httpToWs(rpcUrl) };
}

export function createPublicClient(): GolemBaseROClient {
  const { chainId, rpcUrl, wsUrl } = getConfig();
  return createROClient(chainId, rpcUrl, wsUrl);
}

export interface GolemBaseClientReturn {
  isConnected: boolean;
  isLoading: boolean;
  createClient: () => Promise<GolemBaseClient>;
}

export function useGolemBaseClient(): GolemBaseClientReturn {
  const { data: walletClient, isPending } = useWalletClient();

  const createClient = useCallback(async() => {
    if (!walletClient) {
      throw new Error('Wallet not connected');
    }

    const { chainId, rpcUrl, wsUrl } = getConfig();
    return createSdkClient(chainId, new Tagged('ethereumprovider', walletClient), rpcUrl, wsUrl);
  }, [ walletClient ]);

  return {
    isConnected: Boolean(walletClient),
    isLoading: isPending,
    createClient,
  };
}
