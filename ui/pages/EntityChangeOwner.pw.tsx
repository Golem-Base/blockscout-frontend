import React from 'react';

import * as entityMock from 'mocks/entity';
import { expect, test } from 'playwright/lib';

import EntityChangeOwner from './EntityChangeOwner';

const entityKey = entityMock.base.key;

test('base entity extend view', async({ render, mockApiResponse, mockArkiv }) => {
  const hooksConfig = {
    router: {
      query: { key: entityKey },
      pathname: '/entity/[key]/change-owner',
    },
  };

  await mockArkiv({ isConnected: true });

  await mockApiResponse('golemBaseIndexer:entity', entityMock.base, {
    pathParams: { key: entityKey },
  });

  const component = await render(<EntityChangeOwner/>, { hooksConfig });

  await expect(component).toHaveScreenshot();
});
