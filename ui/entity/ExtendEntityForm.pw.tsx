import React from 'react';

import dayjs from 'lib/date/dayjs';
import { expect, test } from 'playwright/lib';

import ExtendEntityForm from './ExtendEntityForm';

test('default view +@dark-mode +@mobile', async({ render, mockArkiv }) => {
  await mockArkiv({ isConnected: true });

  const component = await render(<ExtendEntityForm initialExpiresAtTimestamp={ dayjs().toJSON() }/>);

  await expect(component).toHaveScreenshot();
});

test('not connected to Golem Base', async({ render }) => {
  const component = await render(<ExtendEntityForm initialExpiresAtTimestamp={ dayjs().toJSON() }/>);

  await expect(component.getByText('Not connected to Golem Base')).toBeVisible();
  await expect(component).toHaveScreenshot();
});
