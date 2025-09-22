import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import EntityOps from 'ui/entityOps/EntityOps';
import useEntityOpsQuery from 'ui/entityOps/useEntityOpsQuery';

type Props = {
  shouldRender?: boolean;
  isQueryEnabled?: boolean;
};

const EntityEntityOps = ({ shouldRender = true, isQueryEnabled = true }: Props) => {
  const router = useRouter();
  const currentEntityKey = getQueryParamString(router.query.key);
  const queryParams = { entity_key: currentEntityKey };

  const opsCountQuery = useApiQuery('golemBaseIndexer:operationsCount', {
    queryOptions: {
      enabled: isQueryEnabled,
    },
    queryParams,
  });

  const opsQuery = useEntityOpsQuery({ filters: queryParams, enabled: isQueryEnabled });

  if (!shouldRender) {
    return null;
  }

  return (
    <EntityOps
      opsQuery={ opsQuery }
      opsCountQuery={ opsCountQuery }
    />
  );
};

export default EntityEntityOps;
