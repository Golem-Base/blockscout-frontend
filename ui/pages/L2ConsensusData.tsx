import { Grid } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { ConsensusInfoResponse } from '@golembase/l3-indexer-types';

import useApiQuery from 'lib/api/useApiQuery';
import dayjs from 'lib/date/dayjs';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import { currencyUnits } from 'lib/units';
import { emptyConsensusInfo } from 'stubs/consensusData';
import { WEI } from 'toolkit/utils/consts';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import EmptySearchResult from 'ui/shared/EmptySearchResult';
import PageTitle from 'ui/shared/Page/PageTitle';
import StatsWidget, { type Props as StatsWidgetProps } from 'ui/shared/stats/StatsWidget';

const keysToCheck: Array<keyof ConsensusInfoResponse> = [
  'finalized_block_number',
  'unsafe_block_number',
  'finalized_block_timestamp',
  'unsafe_block_timestamp',
  'rollup_gas_price',
  'rollup_gas_used',
  'rollup_transaction_fee',
];

const getStats = (consensusInfo: ConsensusInfoResponse): Array<StatsWidgetProps> => {
  return [
    {
      icon: 'block_full',
      label: 'Finalized block number',
      value: consensusInfo.finalized_block_number,
    },
    {
      icon: 'block_countdown_full',
      label: 'Finalized block timestamp',
      value: dayjs.unix(Number(consensusInfo.finalized_block_timestamp)).format('lll'),
    },
    {
      icon: 'block_full',
      label: 'Unsafe block number',
      value: consensusInfo.unsafe_block_number,
    },
    {
      icon: 'block_countdown_full',
      label: 'Unsafe block created at',
      value: dayjs.unix(Number(consensusInfo.unsafe_block_timestamp)).format('lll'),
    },
    {
      icon: 'block_full',
      label: 'Safe block number',
      value: consensusInfo.safe_block_number,
    },
    {
      icon: 'block_countdown_full',
      label: 'Safe block created at',
      value: dayjs.unix(Number(consensusInfo.safe_block_timestamp)).format('lll'),
    },
    {
      icon: 'gas',
      label: 'Rollup gas price',
      value: `${ BigNumber(consensusInfo.rollup_gas_used).dividedBy(WEI).toFixed() } ${ currencyUnits.ether }`,
    },
    {
      icon: 'gas',
      label: 'Rollup gas used',
      value: consensusInfo.rollup_gas_used,
    },
    {
      icon: 'donate',
      label: 'Rollup transaction fee',
      value: `${ BigNumber(consensusInfo.rollup_transaction_fee).dividedBy(WEI).toFixed() } ${ currencyUnits.ether }`,
    },
  ];
};

const L2ConsensusData = () => {
  const consensusInfoQuery = useApiQuery('golemBaseIndexer:consensusInfo', {
    queryOptions: {
      placeholderData: emptyConsensusInfo,
    },
  });

  const consensusInfo = consensusInfoQuery.data;
  const isLoading = Boolean(consensusInfoQuery.isPlaceholderData);

  const items: Array<StatsWidgetProps> = React.useMemo(() => {
    if (!consensusInfo) return [];

    const stats = getStats(consensusInfo);

    return stats.filter(Boolean);
  }, [ consensusInfo ]);

  if (consensusInfoQuery.isError) {
    if (isCustomAppError(consensusInfoQuery.error)) {
      throwOnResourceLoadError({
        isError: consensusInfoQuery.isError,
        error: consensusInfoQuery.error,
      });
    }

    return <DataFetchAlert/>;
  }

  if (keysToCheck.every(value => consensusInfo?.[value] === '0')) {
    return <EmptySearchResult heading="Data not found" text="No consensus data available yet"/>;
  }

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
