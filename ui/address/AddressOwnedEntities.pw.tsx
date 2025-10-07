import React from 'react';

import { EntityStatus } from '@golembase/l3-indexer-types';

import * as entityMock from 'mocks/entity';
import { expect, test } from 'playwright/lib';

import AddressOwnedEntities from './AddressOwnedEntities';

const ADDRESS_HASH = '0x1234567890abcdef1234567890abcdef12345678';

const queryParams = {
  status: EntityStatus.ALL,
  hash: ADDRESS_HASH,
};

const hooksConfig = { router: { query: queryParams } };

test('base view +@mobile', async({ render, mockApiResponse, mockGolemBase }) => {
  await mockGolemBase({ isConnected: true });

  await mockApiResponse('golemBaseIndexer:entities', { items: entityMock.entityResult.items, next_page_params: { page: 1, page_size: 10 } },
    {
      queryParams,
    },
  );

  const component = await render(<AddressOwnedEntities/>, { hooksConfig });

  await expect(component).toHaveScreenshot({ timeout: 15000 });
});
