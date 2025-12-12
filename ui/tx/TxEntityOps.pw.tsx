import { Box } from '@chakra-ui/react';
import React from 'react';

import { OperationType } from '@golembase/l3-indexer-types';

import { createEntityOperation } from 'mocks/operations/entityOps';
import * as txMock from 'mocks/txs/tx';
import { expect, test } from 'playwright/lib';

import TxEntityOps from './TxEntityOps';
import type { TxQuery } from './useTxQuery';

const baseEntityOperation = {
  ...createEntityOperation(OperationType.CREATE),
  transaction_hash: txMock.base.hash,
};

const mockOperationsResponse = {
  items: [ baseEntityOperation ],
  next_page_params: null,
};

test('base view +@mobile', async({ render, mockApiResponse }) => {
  await mockApiResponse('golemBaseIndexer:operations', mockOperationsResponse, {
    queryParams: { operation: 'CREATE', page_size: '50', transaction_hash: txMock.base.hash },
  });
  await mockApiResponse('golemBaseIndexer:operationsCount', {
    create_count: '1',
    update_count: '2',
    extend_count: '3',
    delete_count: '0',
    changeowner_count: '0',
  }, {
    queryParams: { transaction_hash: txMock.base.hash },
  });
  const txQuery = {
    data: txMock.base,
    isPlaceholderData: false,
    isError: false,
  } as TxQuery;

  const component = await render(
    <Box pt={{ base: '134px', lg: 6 }}>
      <TxEntityOps txQuery={ txQuery }/>
    </Box>,
  );

  await component.waitFor({ timeout: 5_000 });

  await expect(component).toHaveScreenshot();
});
