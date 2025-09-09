import React from 'react';

import { topEntityOwners, emptyTopEntityOwners } from 'mocks/leaderboards/topEntityOwners';
import { test, expect } from 'playwright/lib';

import TopEntityOwners from './TopEntityOwners';

test('base view +@mobile +@dark-mode', async({ render, mockTextAd, mockApiResponse }) => {
  await mockTextAd();
  await mockApiResponse('golemBaseIndexer:entitiesOwned', topEntityOwners, {
    queryParams: { page_size: '50' },
  });
  const component = await render(<TopEntityOwners/>);
  await expect(component).toHaveScreenshot({ timeout: 15000 });
});

test('empty view +@mobile +@dark-mode', async({ render, mockTextAd, mockApiResponse }) => {
  await mockTextAd();
  await mockApiResponse('golemBaseIndexer:entitiesOwned', emptyTopEntityOwners, {
    queryParams: { page_size: '50' },
  });
  const component = await render(<TopEntityOwners/>);
  await expect(component).toHaveScreenshot({ timeout: 15000 });
});
