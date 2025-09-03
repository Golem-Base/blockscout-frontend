import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import formatDataSize from 'lib/formatDataSize';
import { BLOCK_STATS } from 'stubs/block';
import { Skeleton } from 'toolkit/chakra/skeleton';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import { ItemDivider } from 'ui/shared/DetailedInfo/DetailedInfo';

interface Props {
  blockHeight: number;
}

const BlockDetailsStats = ({ blockHeight }: Props) => {
  const { data, isPlaceholderData } = useApiQuery<'golemBaseIndexer:blockStats', {
    status: number;
  }>('golemBaseIndexer:blockStats', {
    pathParams: { block: String(blockHeight) },
    queryOptions: {
      enabled: Boolean(blockHeight),
      refetchOnMount: false,
      placeholderData: BLOCK_STATS,
    },
  });

  if (!data) {
    return null;
  }

  return (
    <>
      <ItemDivider/>

      <DetailedInfo.ItemLabel
        hint="Total size of data stored in this block"
        isLoading={ isPlaceholderData }
      >
        Data stored in block
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isPlaceholderData }>
          { formatDataSize(data.storage?.block_bytes) }
        </Skeleton>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint="Total storage used on chain at this point in time (cumulative sum up to this block)"
        isLoading={ isPlaceholderData }
      >
        Total storage used
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isPlaceholderData }>
          { formatDataSize(data.storage?.total_bytes) }
        </Skeleton>
      </DetailedInfo.ItemValue>
    </>
  );
};

export default BlockDetailsStats;
