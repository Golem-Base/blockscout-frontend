import React from 'react';

import { enableGolemBaseConnection } from 'playwright/helpers/golemBaseConnection';
import { expect, test } from 'playwright/lib';

import ExtendEntityForm from './ExtendEntityForm';

test('default view +@dark-mode +@mobile', async({ render, page }) => {
  await enableGolemBaseConnection(page);

  const component = await render(<ExtendEntityForm/>);

  await expect(component).toHaveScreenshot();
});

test('not connected to Golem Base', async({ render }) => {
  const component = await render(<ExtendEntityForm/>);

  await expect(component.getByText('Not connected to Golem Base')).toBeVisible();
  await expect(component).toHaveScreenshot();
});
