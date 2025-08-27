import React from 'react';

import { test, expect } from 'playwright/lib';

import BiggestSpenders from './BiggestSpenders';

const biggestSpenders = {
  items: [
    {
      rank: '1',
      address: '0xebC636b87B86218bE0657b928EEd42A1D573b20c',
      total_fees: '78345169982575750',
    },
  ],
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
  await mockApiResponse('golemBaseIndexer:biggestSpenders', biggestSpenders, {
    queryParams: { page_size: '50' },
  });
  const component = await render(<BiggestSpenders/>);
  await expect(component).toHaveScreenshot({ timeout: 15000 });
});

test('empty view +@mobile +@dark-mode', async({ render, mockTextAd, mockApiResponse }) => {
  await mockTextAd();
  await mockApiResponse('golemBaseIndexer:biggestSpenders', emptyResponse, {
    queryParams: { page_size: '50' },
  });
  const component = await render(<BiggestSpenders/>);
  await expect(component).toHaveScreenshot({ timeout: 15000 });
});
