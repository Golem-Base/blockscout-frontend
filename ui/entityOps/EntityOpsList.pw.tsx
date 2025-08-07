import React from 'react';

import * as entityOpsMock from 'mocks/operations/entityOps';
import { test, expect, devices } from 'playwright/lib';

import EntityOpsList from './EntityOpsList';

test.use({ viewport: devices['iPhone 13 Pro'].viewport });

test('base view +@dark-mode', async({ render }) => {
  const component = await render(
    <EntityOpsList
      items={ [
        entityOpsMock.baseEntityOperation,
        entityOpsMock.updateEntityOperation,
        entityOpsMock.extendEntityOperation,
        entityOpsMock.deleteEntityOperation,
      ] }
    />,
  );

  await expect(component).toHaveScreenshot();
});

test('loading state +@dark-mode', async({ render }) => {
  const component = await render(
    <EntityOpsList
      items={ [
        entityOpsMock.baseEntityOperation,
        entityOpsMock.updateEntityOperation,
      ] }
      isLoading={ true }
    />,
  );

  await expect(component).toHaveScreenshot();
});
