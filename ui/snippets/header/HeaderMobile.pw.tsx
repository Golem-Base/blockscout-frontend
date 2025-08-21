import React from 'react';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { enableGolemBaseConnection } from 'playwright/helpers/golemBaseConnection';
import { test, expect, devices } from 'playwright/lib';

import HeaderMobile from './HeaderMobile';

test.use({ viewport: devices['iPhone 13 Pro'].viewport });

test.beforeEach(async({ mockEnvs }) => {
  await mockEnvs([
    ...ENVS_MAP.rewardsService,
  ]);
});

test('default view +@dark-mode', async({ render, page }) => {
  await enableGolemBaseConnection(page);

  await render(<HeaderMobile/>);
  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1500, height: 150 } });
});
