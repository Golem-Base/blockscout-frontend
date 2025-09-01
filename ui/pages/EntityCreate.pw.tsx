import React from 'react';

import { expect, test } from 'playwright/lib';

import EntityCreate from './EntityCreate';

test('base view', async({ render, mockGolemBase }) => {
  await mockGolemBase({ isConnected: true });

  const component = await render(<EntityCreate/>);

  await expect(component).toHaveScreenshot();
});
