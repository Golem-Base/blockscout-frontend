import { times } from 'es-toolkit/compat';
import React from 'react';

import type { LeaderboardLargestEntitiesResponse } from '@golembase/l3-indexer-types';

import type { PaginatedResponse } from 'lib/api/services/paginationConverter';
import { test, expect } from 'playwright/lib';

import LargestEntities from './LargestEntities';

const largestEntities: PaginatedResponse<LeaderboardLargestEntitiesResponse> = {
  items: times(10, n => ({
    rank: String(n + 1),
    entity_key: '0x1234567890123456789012345678901234567890',
    data_size: '151234567890',
  })),
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
  await mockApiResponse('golemBaseIndexer:largestEntities', largestEntities, {
    queryParams: { page_size: '50' },
  });
  const component = await render(<LargestEntities/>);
  await expect(component).toHaveScreenshot({ timeout: 15000 });
});

test('empty view +@mobile +@dark-mode', async({ render, mockTextAd, mockApiResponse }) => {
  await mockTextAd();
  await mockApiResponse('golemBaseIndexer:largestEntities', emptyResponse, {
    queryParams: { page_size: '50' },
  });
  const component = await render(<LargestEntities/>);
  await expect(component).toHaveScreenshot({ timeout: 15000 });
});
