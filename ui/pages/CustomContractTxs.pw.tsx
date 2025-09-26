import React from 'react';

import { list as customContractTxsList } from 'mocks/customContractTxs/customContractTxs';
import { test, expect } from 'playwright/lib';

import CustomContractTxs from './CustomContractTxs';

test('base view +@mobile', async({ render, mockTextAd, mockApiResponse }) => {
  await mockTextAd();
  await mockApiResponse('golemBaseIndexer:customContractTransactions', customContractTxsList);

  const component = await render(<CustomContractTxs/>);

  await expect(component).toHaveScreenshot({ timeout: 10_000 });
});
