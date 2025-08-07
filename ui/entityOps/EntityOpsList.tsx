import React from 'react';

import type { Operation } from '@golembase/l3-indexer-types';

import EntityOpsListItem from './EntityOpsListItem';

type Props = {
  items: Array<Operation>;
  isLoading?: boolean;
};

const EntityOpsList = ({ items, isLoading }: Props) => {
  return (
    <>
      { items.map((item, index) => (
        <EntityOpsListItem
          key={ item.entity_key + item.index + (isLoading ? index : '') }
          item={ item }
          isLoading={ isLoading }
        />
      )) }
    </>
  );
};

export default EntityOpsList;
