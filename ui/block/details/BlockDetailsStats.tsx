import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import formatDataSize from 'lib/formatDataSize';
import { formatBigNum } from 'lib/web3/formatBigNum';
import { BLOCK_STATS } from 'stubs/block';
import { Skeleton } from 'toolkit/chakra/skeleton';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import { ItemDivider } from 'ui/shared/DetailedInfo/DetailedInfo';

interface Props {
  blockHeight: number;
  isLoading?: boolean;
}

const BlockDetailsStats = ({ blockHeight, isLoading }: Props) => {
  const { data, isPlaceholderData } = useApiQuery<'golemBaseIndexer:blockStats', {
    status: number;
  }>('golemBaseIndexer:blockStats', {
    pathParams: { block: String(blockHeight) },
    queryOptions: {
      refetchOnMount: false,
      placeholderData: BLOCK_STATS,
    },
  });

  if (!data) {
    return null;
  }

  const loading = isLoading || isPlaceholderData;
  const renderItem = (label: string, hint: string, value: string) => (
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

  return (
    <>
      { data.storage && (
        <>
          <ItemDivider/>

          { renderItem(
            'Data stored in block',
            'Total size of data stored in this block',
            formatDataSize(data.storage?.block_bytes),
          ) }

          { renderItem(
            'Total storage used',
            'Total storage used on chain at this point in time (cumulative sum up to this block)',
            formatDataSize(data.storage?.total_bytes),
          ) }
        </>
      ) }

      { data.consensus && (
        <>
          <ItemDivider/>

          { renderItem(
            'Consensus status',
            'Consensus status for this block',
            `${ data.consensus.status } ${
              data.consensus.status === 'unsafe' &&
              data.consensus.expected_safe_at_block ?
                `(expected safe at block ${ data.consensus.expected_safe_at_block })` :
                ''
            }`,
          ) }
        </>
      ) }

      { data.counts && (
        <>
          <ItemDivider/>

          { renderItem(
            'Created entities',
            'Number of created entities',
            formatBigNum(data.counts.create_count),
          ) }

          { renderItem(
            'Updated entities',
            'Number of updated entities',
            formatBigNum(data.counts.update_count),
          ) }

          { renderItem(
            'Expired entities',
            'Number of expired entities',
            formatBigNum(data.counts.expire_count),
          ) }

          { renderItem(
            'Deleted entities',
            'Number of deleted operations',
            formatBigNum(data.counts.delete_count),
          ) }

          { renderItem(
            'Extended entities',
            'Number of extended entities',
            formatBigNum(data.counts.extend_count),
          ) }
        </>
      ) }
    </>
  );
};

export default BlockDetailsStats;
