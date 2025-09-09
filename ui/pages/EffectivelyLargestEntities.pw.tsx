import React from 'react';

import type { ListLargestEntitiesResponse } from '@golembase/l3-indexer-types';

import type { PaginatedResponse } from 'lib/api/services/paginationConverter';
import { test, expect } from 'playwright/lib';

import EffectivelyLargestEntities from './EffectivelyLargestEntities';

const effectivelyLargestEntities: PaginatedResponse<ListLargestEntitiesResponse> = {
  items: Array(10).fill({
    entity_key: '0x1234567890123456789012345678901234567890',
    data_size: '151234567890',
  }),
  next_page_params: {
    page: 2,
    page_size: 5,
  },
};

const emptyResponse = {
  items: [],
  next_page_params: null,
};

test('base view +@mobile +@dark-mode', async({ render, mockTextAd, mockApiResponse }) => {
  await mockTextAd();
  await mockApiResponse('golemBaseIndexer:effectivelyLargestEntities', effectivelyLargestEntities, {
    queryParams: { page_size: '50' },
  });
  const component = await render(<EffectivelyLargestEntities/>);
  await expect(component).toHaveScreenshot({ timeout: 15000 });
});

test('empty view +@mobile +@dark-mode', async({ render, mockTextAd, mockApiResponse }) => {
  await mockTextAd();
  await mockApiResponse('golemBaseIndexer:effectivelyLargestEntities', emptyResponse, {
    queryParams: { page_size: '50' },
  });
  const component = await render(<EffectivelyLargestEntities/>);
  await expect(component).toHaveScreenshot({ timeout: 15000 });
});
