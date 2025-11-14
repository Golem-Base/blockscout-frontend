import { Box } from '@chakra-ui/react';
import React from 'react';

import { baseEntityOperation } from 'mocks/operations/entityOps';
import { expect, test } from 'playwright/lib';

import BlockEntityOps from './BlockEntityOps';

const BLOCK_HASH = '0x1234567890abcdef1234567890abcdef12345678';

const mockOperationsResponse = {
  items: [ baseEntityOperation ],
  next_page_params: null,
};

// FIXME: test is flaky, horizontal scroll positioning is unstable
test.fixme('base view +@mobile', async({ render, mockApiResponse }) => {
  await mockApiResponse('golemBaseIndexer:operations', mockOperationsResponse, {
    queryParams: { operation: 'CREATE', page_size: '50', block_number_or_hash: BLOCK_HASH },
  });
  await mockApiResponse('golemBaseIndexer:operationsCount', {
    create_count: '1',
    update_count: '2',
    extend_count: '3',
    delete_count: '0',
  }, {
    queryParams: { block_number_or_hash: BLOCK_HASH },
  });

  const component = await render(
    <Box pt={{ base: '134px', lg: 6 }}>
      <BlockEntityOps heightOrHash={ BLOCK_HASH }/>
    </Box>,
  );

  await expect(component).toHaveScreenshot();
});
