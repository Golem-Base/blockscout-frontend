import React from 'react';

import { expect, test } from 'playwright/lib';

import EntityChangeOwnerActionButton from './EntityChangeOwnerActionButton';

test('default view +@dark-mode +@mobile', async({ render, mockArkiv }) => {
  await mockArkiv({ isConnected: true });

  const component = await render(<EntityChangeOwnerActionButton/>);

  await expect(component).toHaveScreenshot();
});

test('not connected to Golem Base', async({ render }) => {
  const component = await render(<EntityChangeOwnerActionButton/>);

  await expect(component.getByText('Not connected to Golem Base')).toBeVisible();
  await expect(component).toHaveScreenshot();
});
