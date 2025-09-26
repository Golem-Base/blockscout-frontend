import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { Route } from 'nextjs-routes';
import { route } from 'nextjs-routes';

import useApiQuery from 'lib/api/useApiQuery';
import formatDataSize from 'lib/formatDataSize';
import { formatBigNum } from 'lib/web3/formatBigNum';
import { ADDRESS_RANKS, ADDRESS_STATS } from 'stubs/address';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import { ItemDivider } from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';

const PAGE_SIZE = 50;
type LeaderboardRoute = Extract<Route, { pathname: `/leaderboards/${ string }` }>['pathname'];

interface Props {
  addressHash: string;
  isLoading?: boolean;
}

const AddressStats = ({ addressHash, isLoading }: Props) => {
  const { data, isPlaceholderData } = useApiQuery<'golemBaseIndexer:addressStats', {
    status: number;
  }>('golemBaseIndexer:addressStats', {
    pathParams: { address: addressHash },
    queryOptions: {
      enabled: Boolean(addressHash),
      refetchOnMount: false,
      placeholderData: ADDRESS_STATS,
    },
  });

  const { data: ranksData, isPlaceholderData: isLoadingRanks } = useApiQuery('golemBaseIndexer:addressLeaderboardRanks', {
    pathParams: { address: addressHash },
    queryOptions: {
      enabled: Boolean(addressHash),
      refetchOnMount: false,
      placeholderData: ADDRESS_RANKS,
    },
  });

  if (!data) {
    return null;
  }

  const loading = isLoading || isPlaceholderData || isLoadingRanks;
  const renderItem = (label: string, hint: string, value: React.ReactNode) => (
    <>
      <DetailedInfo.ItemLabel
        hint={ hint }
        isLoading={ loading }
      >
        { label }
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ loading }>
          { value }
        </Skeleton>
      </DetailedInfo.ItemValue>
    </>
  );

  const renderRankItem = (label: string, hint: string, rank: string | undefined, pathname: LeaderboardRoute) => {
    const rankInt = rank ? parseInt(rank, 10) : 0;
    if (rankInt === 0) {
      return null;
    }

    const pageNum = rankInt / PAGE_SIZE;

    return renderItem(
      label,
      hint,
      <Link href={ route({ pathname, query: (pageNum > 1 ? { page: String(pageNum) } : {}) }) }>
        #{ formatBigNum(rank) }
      </Link>,
    );
  };

  return (
    <>
      <ItemDivider/>

      { renderItem(
        'Created entities',
        'Number of entities created by this address',
        formatBigNum(data.created_entities),
      ) }

      { renderItem(
        'Active entities',
        'Number of currently active entities owned by this address',
        formatBigNum(data.active_entities),
      ) }

      { renderItem(
        'Active entities size',
        'Total size of active entities owned by this address',
        formatDataSize(data.size_of_active_entities),
      ) }

      { renderItem(
        'Total transactions',
        'Total number of transactions',
        formatBigNum(data.total_transactions),
      ) }

      { renderItem(
        'Failed transactions',
        'Number of failed transactions',
        formatBigNum(data.failed_transactions),
      ) }

      { data.operations_counts && (
        <>
          <ItemDivider/>

          { renderItem(
            'Create operations',
            'Number of create operations',
            formatBigNum(data.operations_counts.create_count),
          ) }

          { renderItem(
            'Update operations',
            'Number of update operations',
            formatBigNum(data.operations_counts.update_count),
          ) }

          { renderItem(
            'Extend operations',
            'Number of extend operations',
            formatBigNum(data.operations_counts.extend_count),
          ) }

          { renderItem(
            'Delete operations',
            'Number of delete operations',
            formatBigNum(data.operations_counts.delete_count),
          ) }
        </>
      ) }

      { (data.first_seen_timestamp || data.first_seen_block || data.last_seen_timestamp || data.last_seen_block) && <ItemDivider/> }

      { data.first_seen_timestamp && renderItem(
        'First seen date',
        'Date of first seen address on the network',
        <Flex alignItems="center">
          <DetailedInfoTimestamp timestamp={ data.first_seen_timestamp } isLoading={ isPlaceholderData }/>
        </Flex>,
      ) }

      { data.first_seen_block && renderItem(
        'First seen block',
        'Block number of first seen address on the network',
        <BlockEntity
          number={ data.first_seen_block }
          isLoading={ isLoading }
        />,
      ) }

      { data.last_seen_timestamp && renderItem(
        'Last seen date',
        'Date of last seen address on the network',
        <Flex alignItems="center">
          <DetailedInfoTimestamp timestamp={ data.last_seen_timestamp } isLoading={ isPlaceholderData }/>
        </Flex>,
      ) }

      { data.last_seen_block && renderItem(
        'Last seen block',
        'Block number of first seen address on the network',
        <BlockEntity
          number={ data.last_seen_block }
          isLoading={ isLoading }
        />,
      ) }

      <ItemDivider/>

      { renderRankItem(
        'Biggest Spenders Rank',
        'Rank in the biggest spenders leaderboard based on total transaction fees paid',
        ranksData?.biggest_spenders,
        '/leaderboards/spenders',
      ) }

      { renderRankItem(
        'Entities Created Rank',
        'Rank in the top entity creators leaderboard based on number of entities created',
        ranksData?.entities_created,
        '/leaderboards/entity-creators',
      ) }

      { renderRankItem(
        'Entities Owned Rank',
        'Rank in the top entity owners leaderboard based on number of entities currently owned',
        '200',
        '/leaderboards/owners',
      ) }

      { renderRankItem(
        'Data Owned Rank',
        'Rank in the largest entities leaderboard based on total data size owned',
        ranksData?.data_owned,
        '/leaderboards/largest-entities',
      ) }
    </>
  );
};

export default React.memo(AddressStats);
