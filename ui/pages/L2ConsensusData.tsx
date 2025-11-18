import { Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { ConsensusInfoResponse } from '@golembase/l3-indexer-types';
import { getFeaturePayload } from 'configs/app/features/types';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import dayjs from 'lib/date/dayjs';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import { emptyConsensusInfo } from 'stubs/consensusData';
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

const rollupPayload = getFeaturePayload(config.features.rollup);
const parentChainCurrencySymbol = rollupPayload?.parentChain.currency?.symbol;
const parentChainCurrencyDecimals = rollupPayload?.parentChain.currency?.decimals ?? 18;

const getStats = (consensusInfo: ConsensusInfoResponse): Record<keyof ConsensusInfoResponse, StatsWidgetProps> => {
  const decimalsDivisor = BigNumber(10 ** parentChainCurrencyDecimals);

  return {
    finalized_block_number: {
      icon: 'block_full',
      label: 'Finalized block number',
      value: consensusInfo.finalized_block_number,
    },
    finalized_block_timestamp: {
      icon: 'block_countdown_full',
      label: 'Finalized block timestamp',
      value: dayjs.unix(Number(consensusInfo.finalized_block_timestamp)).format('lll'),
    },
    unsafe_block_number: {
      icon: 'block_full',
      label: 'Unsafe block number',
      value: consensusInfo.unsafe_block_number,
    },
    unsafe_block_timestamp: {
      icon: 'block_countdown_full',
      label: 'Unsafe block created at',
      value: dayjs.unix(Number(consensusInfo.unsafe_block_timestamp)).format('lll'),
    },
    safe_block_number: {
      icon: 'block_full',
      label: 'Safe block number',
      value: consensusInfo.safe_block_number,
    },
    safe_block_timestamp: {
      icon: 'block_countdown_full',
      label: 'Safe block created at',
      value: dayjs.unix(Number(consensusInfo.safe_block_timestamp)).format('lll'),
    },
    rollup_gas_price: {
      icon: 'gas',
      label: 'Rollup gas price',
      value: `${ BigNumber(consensusInfo.rollup_gas_price).div(decimalsDivisor).toFixed() } ${ parentChainCurrencySymbol }`,
    },
    rollup_gas_used: {
      icon: 'gas',
      label: 'Rollup gas used',
      value: consensusInfo.rollup_gas_used,
    },
    rollup_transaction_fee: {
      icon: 'donate',
      label: 'Rollup transaction fee',
      value: `${ BigNumber(consensusInfo.rollup_transaction_fee).div(decimalsDivisor).toFixed() } ${ parentChainCurrencySymbol }`,
    },
  };
};

const L2ConsensusData = () => {
  const consensusInfoQuery = useApiQuery('golemBaseIndexer:consensusInfo', {
    queryOptions: {
      placeholderData: emptyConsensusInfo,
    },
  });

  const consensusInfo = consensusInfoQuery.data;
  const isLoading = Boolean(consensusInfoQuery.isPlaceholderData);

  const items = React.useMemo(() => {
    if (!consensusInfo) return undefined;

    return getStats(consensusInfo);
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

  if (keysToCheck.every(value => consensusInfo?.[value] === '0') || !items || !parentChainCurrencySymbol) {
    return <EmptySearchResult heading="Data not found" text="No consensus data available yet"/>;
  }

  return (
    <>
      <PageTitle title="L2 Consensus & Performance" withTextAd/>

      <Flex flexDir="column" gridGap={{ base: 5, lg: 2 }}>
        <Flex flexDir={{ base: 'column', md: 'row' }} gridGap={ 2 }>
          <StatsWidget { ...items.unsafe_block_number } isLoading={ isLoading }/>
          <StatsWidget { ...items.unsafe_block_timestamp } isLoading={ isLoading }/>
        </Flex>

        <Flex flexDir={{ base: 'column', md: 'row' }} gridGap={ 2 } >
          <StatsWidget { ...items.safe_block_number } isLoading={ isLoading }/>
          <StatsWidget { ...items.safe_block_timestamp } isLoading={ isLoading }/>
        </Flex>

        <Flex flexDir={{ base: 'column', md: 'row' }} gridGap={ 2 } >
          <StatsWidget { ...items.finalized_block_number } isLoading={ isLoading }/>
          <StatsWidget { ...items.finalized_block_timestamp } isLoading={ isLoading }/>
        </Flex>

        <Flex flexDir={{ base: 'column', md: 'row' }} gridGap={ 2 } >
          <StatsWidget { ...items.rollup_gas_price } isLoading={ isLoading }/>
          <StatsWidget { ...items.rollup_gas_used } isLoading={ isLoading }/>
          <StatsWidget { ...items.rollup_transaction_fee } isLoading={ isLoading }/>
        </Flex>
      </Flex>
    </>
  );
};

export default L2ConsensusData;
