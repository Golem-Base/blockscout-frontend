import React from 'react';

import * as entityMock from 'mocks/entity';
import { expect, test } from 'playwright/lib';

import EntityResults from './EntityResults';

const entityKey = entityMock.base.key;

test('related entities view', async({ render, mockApiResponse, mockGolemBase }) => {
  const hooksConfig = {
    router: {
      pathname: '/entity?string_annotation_key=a_1&string_annotation_value=app%3Aforum',
    },
  };

  await mockGolemBase({ isConnected: true });

  await mockApiResponse('golemBaseIndexer:entity', entityMock.base, {
    pathParams: { key: entityKey },
  });

  const component = await render(<EntityResults/>, { hooksConfig });

  await expect(component).toHaveScreenshot();
});
