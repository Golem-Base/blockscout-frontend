import React from 'react';

import * as entityMock from 'mocks/entity';
import { expect, test } from 'playwright/lib';

import EntityExtend from './EntityExtend';

const entityKey = entityMock.base.key;

test('base entity extend view', async({ render, mockApiResponse, mockGolemBase }) => {
  const hooksConfig = {
    router: {
      query: { key: entityKey },
      pathname: '/entity/[key]/extend',
    },
  };

  await mockGolemBase({ isConnected: true });

  await mockApiResponse('golemBaseIndexer:entity', entityMock.base, {
    pathParams: { key: entityKey },
  });

  const component = await render(<EntityExtend/>, { hooksConfig });

  await expect(component).toHaveScreenshot();
});
