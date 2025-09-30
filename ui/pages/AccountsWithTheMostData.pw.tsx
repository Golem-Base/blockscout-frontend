import { times } from 'es-toolkit/compat';
import React from 'react';

import type { LeaderboardDataOwnedResponse } from '@golembase/l3-indexer-types';

import type { PaginatedResponse } from 'lib/api/services/paginationConverter';
import { test, expect } from 'playwright/lib';

import AccountsWithTheMostData from './AccountsWithTheMostData';

const accountsWithTheMostData: PaginatedResponse<LeaderboardDataOwnedResponse> = {
  items: times(10, (n) => ({
    rank: String(n + 1),
    address: '0x1234567890abcdef1234567890abcdef',
    data_size: String(100 + (n * 10)),
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
  await mockApiResponse('golemBaseIndexer:addressByDataOwned', accountsWithTheMostData, {
    queryParams: { page_size: '50' },
  });
  const component = await render(<AccountsWithTheMostData/>);
  await expect(component).toHaveScreenshot({ timeout: 15000 });
});

test('empty view +@mobile +@dark-mode', async({ render, mockTextAd, mockApiResponse }) => {
  await mockTextAd();
  await mockApiResponse('golemBaseIndexer:addressByDataOwned', emptyResponse, {
    queryParams: { page_size: '50' },
  });
  const component = await render(<AccountsWithTheMostData/>);
  await expect(component).toHaveScreenshot({ timeout: 15000 });
});
