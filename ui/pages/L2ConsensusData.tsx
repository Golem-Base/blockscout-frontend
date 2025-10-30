import { Grid } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import PageTitle from 'ui/shared/Page/PageTitle';
import StatsWidget, { type Props as StatsWidgetProps } from 'ui/shared/stats/StatsWidget';

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

  const items: Array<StatsWidgetProps> = React.useMemo(() => {
    if (!consensusInfo) {
      return [];
    }

    const stats: Array<StatsWidgetProps> = [
      {
        icon: 'block_full',
        label: 'Finalized block number',
        value: consensusInfo.finalized_block_number,
      },
      {
        icon: 'block_full',
        label: 'Unsafe block number',
        value: consensusInfo.unsafe_block_number,
      },
      {
        icon: 'block_countdown_full',
        label: 'Finalized block timestamp',
        value: consensusInfo.finalized_block_timestamp,
      },
      {
        icon: 'block_countdown_full',
        label: 'Unsafe block timestamp',
        value: consensusInfo.unsafe_block_timestamp,
      },
      {
        icon: 'gas',
        label: 'Rollup gas price',
        value: consensusInfo.rollup_gas_price,
      },
      {
        icon: 'gas',
        label: 'Rollup gas used',
        value: consensusInfo.rollup_gas_used,
      },
      {
        icon: 'donate',
        label: 'Rollup transaction fee',
        value: consensusInfo.rollup_transaction_fee,
      },
    ];

    return stats.filter(Boolean);
  }, [ consensusInfo ]);

  return (
    <>
      <PageTitle title="L2 Consensus & Performance" withTextAd/>

      <Grid gridGap={ 2 } gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))">
        { items.map((item) => <StatsWidget key={ item.label } { ...item } isLoading={ isLoading }/>) }
      </Grid>
    </>
  );
};

export default L2ConsensusData;
