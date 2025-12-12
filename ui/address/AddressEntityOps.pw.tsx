import { Box } from '@chakra-ui/react';
import React from 'react';

import { baseEntityOperation } from 'mocks/operations/entityOps';
import { expect, test } from 'playwright/lib';

import AddressEntityOps from './AddressEntityOps';

const ADDRESS_HASH = '0x1234567890abcdef1234567890abcdef12345678';
const hooksConfig = {
  router: {
    query: { hash: ADDRESS_HASH },
  },
};

const mockOperationsResponse = {
  items: [ baseEntityOperation ],
  next_page_params: null,
};

test('base view +@mobile', async({ render, mockApiResponse }) => {

  await mockApiResponse('golemBaseIndexer:operations', mockOperationsResponse, {
    queryParams: { operation: 'CREATE', page_size: '50', sender: ADDRESS_HASH },
  });
  await mockApiResponse('golemBaseIndexer:operationsCount', {
    create_count: '1',
    update_count: '2',
    extend_count: '3',
    delete_count: '0',
    changeowner_count: '0',
  }, {
    queryParams: { sender: ADDRESS_HASH },
  });

  const component = await render(
    <Box pt={{ base: '134px', lg: 6 }}>
      <AddressEntityOps/>
    </Box>,
    { hooksConfig },
  );

  await component.waitFor({ timeout: 5_000 });

  await expect(component).toHaveScreenshot();
});
