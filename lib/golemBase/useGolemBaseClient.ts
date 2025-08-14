import type { GolemBaseClient } from 'golem-base-sdk';
import { createClient as createGolemBaseClient, Tagged } from 'golem-base-sdk';
import { useCallback } from 'react';
import { useAccount, useWalletClient } from 'wagmi';

import config from 'configs/app';
import { httpToWs } from 'lib/httpToWs';

export interface GolemBaseClientReturn {
  isConnected: boolean;
  createClient: () => Promise<GolemBaseClient>;
}

export function useGolemBaseClient(): GolemBaseClientReturn {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const createClient = useCallback(async() => {
    if (!address || !walletClient) {
      throw new Error('Wallet not connected');
    }

    const httpRpcUrl = config.chain.rpcUrls[0];
    const wsRpcUrl = httpToWs(httpRpcUrl);

    return createGolemBaseClient(
      Number(config.chain.id),
      new Tagged('ethereumprovider', walletClient),
      httpRpcUrl,
      wsRpcUrl,
    );
  }, [ address, walletClient ]);

  return {
    isConnected: Boolean(address && walletClient),
    createClient,
  };
}
