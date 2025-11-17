import { Box } from '@chakra-ui/react';
import React from 'react';

import { baseEntityOperation } from 'mocks/operations/entityOps';
import { expect, test } from 'playwright/lib';
import { ENTITY_KEY } from 'stubs/entity';

import EntityEntityOps from './EntityEntityOps';

const hooksConfig = {
  router: {
    query: { key: ENTITY_KEY, tab: 'entity_ops_all' },
  },
};

const mockOperationsResponse = {
  items: [ baseEntityOperation ],
  next_page_params: null,
};

test('base view +@mobile', async({ render, mockApiResponse }) => {

  await mockApiResponse('golemBaseIndexer:operations', mockOperationsResponse, {
    queryParams: { operation: 'ALL', page_size: '50', entity_key: ENTITY_KEY },
  });
  await mockApiResponse('golemBaseIndexer:operationsCount', {
    create_count: '1',
    update_count: '2',
    extend_count: '3',
    delete_count: '0',
    changeowner_count: '1',
  }, {
    queryParams: { entity_key: ENTITY_KEY },
  });

  const component = await render(
    <Box pt={{ base: '134px', lg: 6 }}>
      <EntityEntityOps/>
    </Box>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});
