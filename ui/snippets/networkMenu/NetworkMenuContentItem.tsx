import { VStack } from '@chakra-ui/react';
import React from 'react';

import type { FeaturedNetwork, NetworkGroup } from 'types/networks';

import NetworkMenuLink from './NetworkMenuLink';

interface Props {
  tab: NetworkGroup;
  items: Array<FeaturedNetwork>;
}

const NetworkMenuContentItem = ({ items, tab }: Props) => {
  return (
    <VStack as="ul" gap={ 1 } alignItems="stretch" maxH="516px" overflowY="scroll">
      { items
        .filter((network) => network.group === tab)
        .map((network) => (
          <NetworkMenuLink
            key={ network.title }
            { ...network }
          />
        )) }
    </VStack>
  );
};

export default NetworkMenuContentItem;
