import { chakra, createListCollection, Flex } from '@chakra-ui/react';
import type { ValueChangeDetails } from '@zag-js/select';
import React, { useCallback, useMemo } from 'react';

import config from 'configs/app';
import { setRpcPreference } from 'lib/web3/rpcPreference';
import { Select } from 'toolkit/chakra/select';

function getEndpointDisplayName(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

const RpcEndpointSwitcher = () => {
  const handleValueChange = useCallback(({ value }: ValueChangeDetails<string>) => {
    setRpcPreference(value[0]);
    window.location.reload();
  }, []);

  const collection = useMemo(() => {
    const items = config.chain.rpcUrls.map((endpoint) => ({
      value: endpoint,
      label: getEndpointDisplayName(endpoint),
    }));

    return createListCollection({ items });
  }, []);

  if (!config.chain.rpcUrls || config.chain.rpcUrls.length <= 1) {
    return null;
  }

  return (
    <Flex alignItems="center" columnGap={ 2 } rowGap={ 1 }>
      <chakra.span fontWeight={ 500 } fontSize="sm">RPC:</chakra.span>
      <Select
        collection={ collection }
        defaultValue={ [ config.chain.rpcUrls[0] ] }
        onValueChange={ handleValueChange }
        placeholder="RPC"
        size="sm"
        maxW="200px"
        w="fit-content"
      />
    </Flex>
  );
};

export default React.memo(RpcEndpointSwitcher);
