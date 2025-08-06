import React from 'react';
import type { AddEthereumChainParameter } from 'viem';

import config from 'configs/app';
import getErrorObj from 'lib/errors/getErrorObj';
import { SECOND } from 'toolkit/utils/consts';

import useRewardsActivity from '../hooks/useRewardsActivity';
import useProvider from './useProvider';
import { getHexadecimalChainId } from './utils';

function getParams(): AddEthereumChainParameter {
  if (!config.chain.id) {
    throw new Error('Missing required chain config');
  }

  return {
    chainId: getHexadecimalChainId(Number(config.chain.id)),
    chainName: config.chain.name ?? '',
    nativeCurrency: {
      name: config.chain.currency.name ?? '',
      symbol: config.chain.currency.symbol ?? '',
      decimals: config.chain.currency.decimals ?? 18,
    },
    rpcUrls: config.chain.rpcUrls,
    blockExplorerUrls: [ config.app.baseUrl ],
  };
}

export default function useAddChain() {
  const { wallet, provider } = useProvider();
  const { trackUsage } = useRewardsActivity();

  return React.useCallback(async() => {
    if (!wallet || !provider) {
      throw new Error('Wallet or provider not found');
    }

    const start = Date.now();

    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [ getParams() ],
      });
    } catch (error) {
      const errorObj = getErrorObj(error) as { code?: number; message?: string };

      // Suppress MetaMask error occurring on Firefox
      if (errorObj.code === -32603 && errorObj.message === 'f is not a function') {
        return;
      }

      throw error;
    }

    // if network is already added, the promise resolves immediately
    if (Date.now() - start > SECOND) {
      await trackUsage('add_network');
    }
  }, [ wallet, provider, trackUsage ]);
}
