import React from 'react';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import EntitySearch from './EntitySearch';

test.beforeEach(async({ mockEnvs, mockTextAd }) => {
  await mockEnvs(ENVS_MAP.golemBaseIndexer);
  await mockTextAd();
});

test('empty state - default', async({ render, mockGolemBase }) => {
  const hooksConfig = {
    router: {
      query: {},
    },
  };

  await mockGolemBase();

  const component = await render(<EntitySearch/>, { hooksConfig });
  await expect(component).toHaveScreenshot();
});

test('with search results +@dark-mode +@mobile', async({ render, mockGolemBase }) => {
  const searchTerm = 'name = "test entity" && !(age > 18 || age <= 65) && category ~ "inactive" && $owner != "0x1234567890123456789012345678901234567890"';
  const hooksConfig = {
    router: {
      query: { q: searchTerm },
    },
  };

  const mockEntities = [
    {
      entityKey: '0x0137cd898a9aaa92bbe94999d2a98241f5eabc829d9354160061789963f85995',
      storageValue: new Uint8Array([
        0x7b, 0x22, 0x6e, 0x61, 0x6d, 0x65, 0x22, 0x3a, 0x20, 0x22, 0x54, 0x65, 0x73, 0x74, 0x20,
        0x45, 0x6e, 0x74, 0x69, 0x74, 0x79, 0x20, 0x31, 0x22, 0x7d,
      ]),
    },
    {
      entityKey: '0x742d35cc6bc59fb56d41229f1e5e0d5c3f2cf9b8e1a9c2d3f4e5f6a7b8c9d0e1f2',
      storageValue: new Uint8Array([
        0x7b, 0x22, 0x6e, 0x61, 0x6d, 0x65, 0x22, 0x3a, 0x20, 0x22, 0x53, 0x61, 0x6d, 0x70, 0x6c,
        0x65, 0x20, 0x45, 0x6e, 0x74, 0x69, 0x74, 0x79, 0x22, 0x7d,
      ]),
    },
    {
      entityKey: '0x8ba1f109551bd432803012645hac136c0b1b6b7c2d8e3f9a1b4c5d6e7f8a9b0c',
      storageValue: new Uint8Array([
        0x7b, 0x22, 0x64, 0x65, 0x73, 0x63, 0x72, 0x69, 0x70, 0x74, 0x69, 0x6f, 0x6e, 0x22, 0x3a,
        0x20, 0x22, 0x41, 0x6e, 0x6f, 0x74, 0x68, 0x65, 0x72, 0x20, 0x65, 0x6e, 0x74, 0x69, 0x74,
        0x79, 0x22, 0x7d,
      ]),
    },
  ];

  await mockGolemBase({
    queryEntitiesResponse: mockEntities,
  });

  const component = await render(<EntitySearch/>, { hooksConfig });
  await expect(component).toHaveScreenshot();
});
