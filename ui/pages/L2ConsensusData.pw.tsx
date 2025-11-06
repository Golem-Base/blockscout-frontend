import React from 'react';

import type { ConsensusInfoResponse } from '@golembase/l3-indexer-types';

import { test, expect } from 'playwright/lib';

import L2ConsensusData from './L2ConsensusData';

const consensusInfo: ConsensusInfoResponse = {
  finalized_block_number: '1273866',
  unsafe_block_number: '1331663',
  finalized_block_timestamp: '1761703404',
  unsafe_block_timestamp: '1761818998',
  rollup_gas_price: '1000000251',
  rollup_gas_used: '216190',
  rollup_transaction_fee: '216190054263690',
  safe_block_number: '100',
  safe_block_timestamp: '100',
};

const emptyConsensusInfo: ConsensusInfoResponse = {
  finalized_block_number: '0',
  unsafe_block_number: '0',
  finalized_block_timestamp: '0',
  unsafe_block_timestamp: '0',
  rollup_gas_price: '0',
  rollup_gas_used: '0',
  rollup_transaction_fee: '0',
  safe_block_number: '0',
  safe_block_timestamp: '0',
};

test('base view +@mobile +@dark-mode', async({ render, mockTextAd, mockApiResponse }) => {
  await mockTextAd();
  await mockApiResponse('golemBaseIndexer:consensusInfo', consensusInfo);
  const component = await render(<L2ConsensusData/>);
  await expect(component).toHaveScreenshot({ timeout: 15000 });
});

test('empty view +@mobile +@dark-mode', async({ render, mockTextAd, mockApiResponse }) => {
  await mockTextAd();
  await mockApiResponse('golemBaseIndexer:consensusInfo', emptyConsensusInfo);
  const component = await render(<L2ConsensusData/>);
  await expect(component).toHaveScreenshot({ timeout: 15000 });
});
