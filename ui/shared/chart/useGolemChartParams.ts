import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';

import type { GolemChartId } from './useGolemChartQuery';

const paramsListByChartId: Record<GolemChartId, Array<string>> = {
  'data-usage': [],
  'storage-forecast': [],
  'operation-count': [ 'operation' ],
};

const useGolemChartParams = (id: GolemChartId) => {
  const router = useRouter();
  const routerQuery = router.query;

  const paramsList = paramsListByChartId[id];

  const params = useMemo(() => {
    return paramsList.reduce((filteredParams, param) => {
      if (!routerQuery[param]) return filteredParams;

      filteredParams[param] = routerQuery[param] as string;

      return filteredParams;
    }, {} as Record<string, string>);
  }, [ routerQuery, paramsList ]);

  const handleParamChange = useCallback((param: string, value: string) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, [param]: value },
    },
    undefined,
    { shallow: true },
    );
  }, [ router ]);

  return { params, filterableParamsList: paramsList, handleParamChange };
};

export default useGolemChartParams;
