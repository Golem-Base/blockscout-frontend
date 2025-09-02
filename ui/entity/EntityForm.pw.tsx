import React from 'react';

import { expect, test } from 'playwright/lib';

import EntityForm from './EntityForm';

test('default view +@dark-mode +@mobile', async({ render, mockGolemBase }) => {
  await mockGolemBase({ isConnected: true });

  const component = await render(<EntityForm/>);

  await expect(component).toHaveScreenshot();
});

test('text input view with all fields filled', async({ render, page, mockGolemBase }) => {
  await mockGolemBase({ isConnected: true });

  const initialValues = {
    dataText: 'This is comprehensive test entity data',
    btl: '50',
    stringAnnotations: [
      { id: '1', key: 'category', value: 'test' },
    ],
    numericAnnotations: [
      { id: '2', key: 'score', value: '100' },
    ],
  };

  const component = await render(<EntityForm initialValues={ initialValues }/>);

  await page.getByRole('tab', { name: /text/i }).click();

  await expect(component).toHaveScreenshot();
});

test('file input view with all fields filled', async({ render, mockGolemBase }) => {
  await mockGolemBase({ isConnected: true });

  const initialValues = {
    btl: '25',
    stringAnnotations: [
      { id: '1', key: 'type', value: 'document' },
    ],
    numericAnnotations: [
      { id: '2', key: 'size', value: '2048' },
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
