import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import type { Item } from 'ui/home/Stats';
import StatsList from 'ui/home/StatsList';

const L2ConsensusData = () => {
  const consensusInfoQuery = useApiQuery('golemBaseIndexer:consensusInfo', {
    queryOptions: {
      placeholderData: {
        finalized_block_number: '0',
        unsafe_block_number: '0',
        unsafe_block_timestamp: '0',
        safe_block_number: '0',
        safe_block_timestamp: '0',
        finalized_block_timestamp: '0',
        rollup_gas_price: '0',
        rollup_gas_used: '0',
        rollup_transaction_fee: '0',
      },
    },
  });

  const consensusInfo = consensusInfoQuery.data;
  const isLoading = Boolean(consensusInfoQuery.isPlaceholderData);

  const items: Array<Item> = React.useMemo(() => {
    if (!consensusInfo) {
      return [];
    }

    const stats: Array<Item> = [
      {
        id: 'finalized_block_number',
        icon: 'block',
        label: 'Finalized block number',
        value: consensusInfo.finalized_block_number,
      },
      {
        id: 'unsafe_block_number',
        icon: 'block',
        label: 'Unsafe block number',
        value: consensusInfo.unsafe_block_number,
      },
      {
        id: 'finalized_block_timestamp',
        icon: 'block_countdown',
        label: 'Finalized block timestamp',
        value: consensusInfo.finalized_block_timestamp,
      },
      {
        id: 'unsafe_block_timestamp',
        icon: 'block_countdown',
        label: 'Unsafe block timestamp',
        value: consensusInfo.unsafe_block_timestamp,
      },
      {
        id: 'rollup_gas_price',
        icon: 'gas',
        label: 'Rollup gas price',
        value: consensusInfo.rollup_gas_price,
      },
      {
        id: 'rollup_gas_used',
        icon: 'gas',
        label: 'Rollup gas used',
        value: consensusInfo.rollup_gas_used,
      },
      {
        id: 'rollup_transaction_fee',
        icon: 'donate',
        label: 'Rollup transaction fee',
        value: consensusInfo.rollup_transaction_fee,
      },
    ];

    return stats.filter(Boolean);
  }, [ consensusInfo ]);

  return (
    <StatsList items={ items } isLoading={ isLoading }/>
  );
};

export default L2ConsensusData;
