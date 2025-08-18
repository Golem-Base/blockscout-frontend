import React from 'react';

import { enableGolemBaseConnection } from 'playwright/helpers/golemBaseConnection';
import { expect, test } from 'playwright/lib';

import EntityForm from './EntityForm';

test('default view +@dark-mode +@mobile', async({ render, page }) => {
  await enableGolemBaseConnection(page);

  const component = await render(<EntityForm/>);

  await expect(component).toHaveScreenshot();
});

test('text input view with all fields filled', async({ render, page }) => {
  await enableGolemBaseConnection(page);

  const initialValues = {
    dataText: 'This is comprehensive test entity data',
    btl: 50,
    stringAnnotations: [
      { key: 'category', value: 'test' },
    ],
    numericAnnotations: [
      { key: 'score', value: 100 },
    ],
  };

  const component = await render(<EntityForm initialValues={ initialValues }/>);

  await page.getByRole('tab', { name: /text/i }).click();

  await expect(component).toHaveScreenshot();
});

test('file input view with all fields filled', async({ render, page }) => {
  await enableGolemBaseConnection(page);

  const initialValues = {
    btl: 25,
    stringAnnotations: [
      { key: 'type', value: 'document' },
    ],
    numericAnnotations: [
      { key: 'size', value: 2048 },
    ],
  };

  const component = await render(<EntityForm initialValues={ initialValues } edit/>);

  await expect(component).toHaveScreenshot();
});

test('not connected to Golem Base', async({ render }) => {
  const component = await render(<EntityForm/>);

  await expect(component.getByText('Not connected to Golem Base')).toBeVisible();
  await expect(component).toHaveScreenshot();
});
