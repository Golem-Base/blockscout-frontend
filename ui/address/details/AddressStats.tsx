import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import formatDataSize from 'lib/formatDataSize';
import { formatBigNum } from 'lib/web3/formatBigNum';
import { ADDRESS_STATS } from 'stubs/address';
import { Skeleton } from 'toolkit/chakra/skeleton';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import { ItemDivider } from 'ui/shared/DetailedInfo/DetailedInfo';

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
    </>
  );
};

export default React.memo(AddressStats);
