import React from 'react';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import EntitySearch from './EntitySearch';

test.beforeEach(async({ mockEnvs, mockTextAd }) => {
  await mockEnvs(ENVS_MAP.golemBaseIndexer);
  await mockTextAd();
});

test('empty state - default', async({ render, mockArkiv }) => {
  const hooksConfig = {
    router: {
      query: {},
    },
  };

  await mockArkiv();

  const component = await render(<EntitySearch/>, { hooksConfig });
  await expect(component).toHaveScreenshot();
});

test('with search results +@dark-mode +@mobile', async({ render, mockArkiv }) => {
  const searchTerm = 'name = "test entity" && !(age > 18 || age <= 65) && category ~ "inactive" && $owner != "0x1234567890123456789012345678901234567890"';
  const hooksConfig = {
    router: {
      query: { q: searchTerm },
    },
  };

  const mockEntities = [
    { key: '0x0137cd898a9aaa92bbe94999d2a98241f5eabc829d9354160061789963f85995' },
    { key: '0x742d35cc6bc59fb56d41229f1e5e0d5c3f2cf9b8e1a9c2d3f4e5f6a7b8c9d0e1f2' },
    { key: '0x8ba1f109551bd432803012645hac136c0b1b6b7c2d8e3f9a1b4c5d6e7f8a9b0c' },
  ];

  await mockArkiv({ queryResponse: mockEntities });

  const component = await render(<EntitySearch/>, { hooksConfig });
  await expect(component).toHaveScreenshot();
});
