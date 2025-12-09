import { times } from 'es-toolkit/compat';
import React from 'react';

import { test, expect } from 'playwright/lib';

import BlockTransactionsChart from './BlockTransactionsChart';
import type { HistogramItem } from './BlockTransactionsChart';

const testData: Array<HistogramItem> = times(100, (i) => (
  {
    label: String(1245520 + i),
    value: (i > 32 && i < 73) ? 48 : 100,
  }
));

test('histogram with block transactions +@dark-mode +@mobile', async({ render }) => {
  const component = await render(<BlockTransactionsChart items={ testData } height={ 350 }/>);

  await expect(component).toHaveScreenshot();
});

test('histogram with block transactions tooltip', async({ render, page }) => {
  const component = await render(<BlockTransactionsChart items={ testData } height={ 350 }/>);

  const svg = component.locator('svg');
  const svgBox = await svg.boundingBox();

  const barIndex = 2;
  const totalBars = 6;
  const chartLeft = svgBox?.x! + 50;
  const chartWidth = svgBox?.width! - 60;
  const barSpacing = chartWidth / totalBars;
  const xPos = chartLeft + (barIndex + 0.5) * barSpacing;
  const yPos = svgBox?.y! + svgBox?.height! / 2;

  await page.mouse.move(xPos, yPos);

  await expect(component).toHaveScreenshot();
});
