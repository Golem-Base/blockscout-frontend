import React from 'react';

import { EntityStatus } from '@golembase/l3-indexer-types';

import * as entityMock from 'mocks/entity';
import { expect, test } from 'playwright/lib';

import EntityResults from './EntityResults';

const queryParams = {
  string_annotation_key: 'a_1',
  string_annotation_value: 'appforum',
  status: EntityStatus.ACTIVE,
};

const hooksConfig = {
  router: {
    query: queryParams,
  },
};

test('related entities view', async({
  render,
  mockApiResponse,
  mockArkiv,
}) => {

  await mockArkiv({ isConnected: true });

  await mockApiResponse('golemBaseIndexer:entities', { items: entityMock.entityResult.items, next_page_params: { page: 1, page_size: 10 } }, {
    queryParams,
  });

  const component = await render(<EntityResults/>, { hooksConfig });

  await expect(component).toHaveScreenshot();
});

test('related entities view +@dark-mode +@mobile', async({
  render,
  mockApiResponse,
  mockArkiv,
}) => {
  await mockArkiv({ isConnected: true });

  await mockApiResponse('golemBaseIndexer:entities', { items: entityMock.entityResult.items, next_page_params: { page: 1, page_size: 10 } }, {
    queryParams,
  });

  const component = await render(<EntityResults/>, { hooksConfig });

  await expect(component).toHaveScreenshot();
});
