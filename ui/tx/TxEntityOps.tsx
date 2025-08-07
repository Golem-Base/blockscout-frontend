import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import EntityOps from 'ui/entityOps/EntityOps';
import useEntityOpsQuery from 'ui/entityOps/useEntityOpsQuery';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import TxPendingAlert from 'ui/tx/TxPendingAlert';
import TxSocketAlert from 'ui/tx/TxSocketAlert';

import type { TxQuery } from './useTxQuery';

interface Props {
  txQuery: TxQuery;
}

const TxEntityOps = ({ txQuery }: Props) => {
  const hash = txQuery.data?.hash.toString();

  const queryParams = { transaction_hash: hash };
  const enabled = !txQuery.isPlaceholderData && Boolean(txQuery.data?.status && txQuery.data?.hash);
  const opsQuery = useEntityOpsQuery({
    filters: queryParams,
    enabled,
  });
  const opsCountQuery = useApiQuery('golemBaseIndexer:operationsCount', {
    queryOptions: { enabled },
    queryParams,
  });

  if (!txQuery.isPending && !txQuery.isPlaceholderData && !txQuery.isError && !txQuery.data.status) {
    return txQuery.socketStatus ? <TxSocketAlert status={ txQuery.socketStatus }/> : <TxPendingAlert/>;
  }

  if (txQuery.isError || opsQuery.isError || opsCountQuery.isError) {
    return <DataFetchAlert/>;
  }

  return (
    <EntityOps
      opsQuery={ opsQuery }
      opsCountQuery={ opsCountQuery }
    />
  );
};

export default TxEntityOps;
