import React from 'react';

import { enableGolemBaseConnection } from 'playwright/helpers/golemBaseConnection';
import { expect, test } from 'playwright/lib';

import EntityCreate from './EntityCreate';

test('base view', async({ page, render }) => {
  await enableGolemBaseConnection(page);

  const component = await render(<EntityCreate/>);

  await expect(component).toHaveScreenshot();
});
