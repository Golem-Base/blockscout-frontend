import React from 'react';

import * as entityMock from 'mocks/entity';
import { enableGolemBaseConnection } from 'playwright/helpers/golemBaseConnection';
import { expect, test } from 'playwright/lib';

import EntityExtend from './EntityExtend';

const entityKey = entityMock.base.key;

test('base entity extend view', async({ page, render, mockApiResponse }) => {
  const hooksConfig = {
    router: {
      query: { key: entityKey },
      pathname: '/entity/[key]/extend',
    },
  };

  await enableGolemBaseConnection(page);

  await mockApiResponse('golemBaseIndexer:entity', entityMock.base, {
    pathParams: { key: entityKey },
  });

  const component = await render(<EntityExtend/>, { hooksConfig });

  await expect(component).toHaveScreenshot();
});
