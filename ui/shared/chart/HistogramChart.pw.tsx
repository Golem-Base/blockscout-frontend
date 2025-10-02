import React from 'react';

import { test, expect } from 'playwright/lib';

import type { HistogramItem } from './HistogramChart';
import HistogramChart from './HistogramChart';

const testData: Array<HistogramItem> = [
  { label: '0-1 KB', value: 1250 },
  { label: '1-10 KB', value: 3420 },
  { label: '10-50 KB', value: 5890 },
  { label: '50-100 KB', value: 4320 },
  { label: '100-250 KB', value: 6750 },
  { label: '250-500 KB', value: 3890 },
  { label: '500 KB-1 MB', value: 2340 },
  { label: '1-5 MB', value: 1780 },
  { label: '5-10 MB', value: 980 },
  { label: '10+ MB', value: 450 },
];

test('histogram with size distribution +@dark-mode', async({ render }) => {
  const component = await render(<HistogramChart items={ testData } height={ 350 }/>);

  await expect(component).toHaveScreenshot();
});
