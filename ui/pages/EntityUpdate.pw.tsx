import React from 'react';

import * as entityMock from 'mocks/entity';
import { enableGolemBaseConnection } from 'playwright/helpers/golemBaseConnection';
import { expect, test } from 'playwright/lib';

import EntityUpdate from './EntityUpdate';

const entityKey = entityMock.base.key;

test('base view with entity data', async({ page, render, mockApiResponse }) => {
  const hooksConfig = {
    router: {
      query: { key: entityKey },
      pathname: '/entity/[key]/update',
    },
  };

  await enableGolemBaseConnection(page);

  await mockApiResponse('golemBaseIndexer:entity', entityMock.base, {
    pathParams: { key: entityKey },
  });

  const component = await render(<EntityUpdate/>, { hooksConfig });

  await expect(component).toHaveScreenshot();
});
