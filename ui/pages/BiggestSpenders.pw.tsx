import React from 'react';

import { biggestSpenders, emptyBiggestSpenders } from 'mocks/leaderboards/biggestSpenders';
import { test, expect } from 'playwright/lib';

import BiggestSpenders from './BiggestSpenders';

test('base view +@mobile +@dark-mode', async({ render, mockTextAd, mockApiResponse }) => {
  await mockTextAd();
  await mockApiResponse('golemBaseIndexer:biggestSpenders', biggestSpenders, {
    queryParams: { page_size: '50' },
  });
  const component = await render(<BiggestSpenders/>);
  await expect(component).toHaveScreenshot({ timeout: 15000 });
});

test('empty view +@mobile +@dark-mode', async({ render, mockTextAd, mockApiResponse }) => {
  await mockTextAd();
  await mockApiResponse('golemBaseIndexer:biggestSpenders', emptyBiggestSpenders, {
    queryParams: { page_size: '50' },
  });
  const component = await render(<BiggestSpenders/>);
  await expect(component).toHaveScreenshot({ timeout: 15000 });
});
