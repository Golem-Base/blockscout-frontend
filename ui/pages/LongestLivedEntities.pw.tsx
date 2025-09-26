import { times } from 'es-toolkit/compat';
import React from 'react';

import type { LeaderboardEntitiesByBtlResponse } from '@golembase/l3-indexer-types';
import { EntityStatus } from '@golembase/l3-indexer-types';

import type { PaginatedResponse } from 'lib/api/services/paginationConverter';
import { test, expect } from 'playwright/lib';

import LongestLivedEntities from './LongestLivedEntities';

const longestLivedEntities: PaginatedResponse<LeaderboardEntitiesByBtlResponse> = {
  items: times(10, (n) => ({
    expires_at_block_number: '1000000000000000000',
    last_updated_at_tx_hash: '0x1234567890abcdef1234567890abcdef',
    key: '0x1234567890abcdef1234567890abcdef',
    created_at_tx_hash: '0x1234567890abcdef1234567890abcdef',
    status: EntityStatus.ACTIVE,
    expires_at_timestamp: n === 0 ? undefined : '2025-09-01T19:01:00+00:00',
    data: '0x1234567890abcdef1234567890abcdef',
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
  await mockApiResponse('golemBaseIndexer:longestLivedEntities', longestLivedEntities, {
    queryParams: { page_size: '50' },
  });
  const component = await render(<LongestLivedEntities/>);
  await expect(component).toHaveScreenshot({ timeout: 15000 });
});

test('empty view +@mobile +@dark-mode', async({ render, mockTextAd, mockApiResponse }) => {
  await mockTextAd();
  await mockApiResponse('golemBaseIndexer:longestLivedEntities', emptyResponse, {
    queryParams: { page_size: '50' },
  });
  const component = await render(<LongestLivedEntities/>);
  await expect(component).toHaveScreenshot({ timeout: 15000 });
});
