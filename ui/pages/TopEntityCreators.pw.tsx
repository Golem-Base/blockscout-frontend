import React from 'react';

import { topEntityCreators, emptyTopEntityCreators } from 'mocks/leaderboards/topEntityCreators';
import { test, expect } from 'playwright/lib';

import TopEntityCreators from './TopEntityCreators';

test('base view +@mobile +@dark-mode', async({ render, mockTextAd, mockApiResponse }) => {
  await mockTextAd();
  await mockApiResponse('golemBaseIndexer:entitiesCreated', topEntityCreators, {
    queryParams: { page_size: '50' },
  });
  const component = await render(<TopEntityCreators/>);
  await expect(component).toHaveScreenshot({ timeout: 15000 });
});

test('empty view +@mobile +@dark-mode', async({ render, mockTextAd, mockApiResponse }) => {
  await mockTextAd();
  await mockApiResponse('golemBaseIndexer:entitiesCreated', emptyTopEntityCreators, {
    queryParams: { page_size: '50' },
  });
  const component = await render(<TopEntityCreators/>);
  await expect(component).toHaveScreenshot({ timeout: 15000 });
});
