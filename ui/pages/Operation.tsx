import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import throwOnAbsentParamError from 'lib/errors/throwOnAbsentParamError';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getQueryParamString from 'lib/router/getQueryParamString';
import { OPERATION_BASE } from 'stubs/operation';
import OperationDetails from 'ui/golemOperation/OperationDetails';
import OperationSubHeading from 'ui/golemOperation/OperationSubHeading';
import TextAd from 'ui/shared/ad/TextAd';
import PageTitle from 'ui/shared/Page/PageTitle';

const OperationPageContent = () => {
  const router = useRouter();
  const txHash = getQueryParamString(router.query.hash);
  const opIndex = getQueryParamString(router.query.idx);

  const operationQuery = useApiQuery('golemBaseIndexer:operation', {
    pathParams: { txHash, opIndex },
    queryOptions: {
      enabled: Boolean(txHash) && Boolean(opIndex),
      placeholderData: OPERATION_BASE,
    },
  });

  throwOnAbsentParamError(txHash);
  throwOnAbsentParamError(opIndex);
  throwOnResourceLoadError(operationQuery);

  const titleSecondRow = <OperationSubHeading txHash={ txHash } opIndex={ opIndex }/>;

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title="Operation Details"
        secondRow={ titleSecondRow }
      />
      <OperationDetails operationQuery={ operationQuery }/>
    </>
  );
};

export default OperationPageContent;
