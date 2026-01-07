import React from 'react';

import * as statsLineMock from 'mocks/stats/line';
import { test, expect } from 'playwright/lib';

import Chart from './Chart';

const CHART_ID = 'averageGasPrice';

test.beforeEach(async({ mockTextAd }) => {
  await mockTextAd();
});

const hooksConfig = {
  router: {
    query: { id: CHART_ID },
  },
};

test('base view +@dark-mode +@mobile', async({ render, page }) => {
  const urlPattern = new RegExp(`.*/api/v1/lines/${ CHART_ID }.*resolution=DAY`);

  await page.route(urlPattern, (route) => route.fulfill({
    status: 200,
    json: statsLineMock.averageGasPrice,
  }));

  const component = await render(<Chart/>, { hooksConfig });

  await page.waitForResponse((response) => {
    return response.url().includes(`/api/v1/lines/${ CHART_ID }`) &&
           response.url().includes('resolution=DAY');
  });

  await page.waitForFunction(() => {
    return document.querySelector('path[data-name="chart-Charttitle-fullscreen"]')?.getAttribute('opacity') === '1';
  });
  await expect(component).toHaveScreenshot();
});
