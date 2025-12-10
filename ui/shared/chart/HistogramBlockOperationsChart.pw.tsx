import React from 'react';

import { test, expect } from 'playwright/lib';

import type { Item } from './BlockOperationsChart';
import BlockOperationsChart from './BlockOperationsChart';
import type { OperationTypeCount } from './BlockOperationsChartBar';

const testData: Array<Item> = [
  {
    label: '1245524',
    value: 5,
    block_number: '1245524',
    create_count: '35',
    update_count: '13',
    delete_count: '5',
    extend_count: '9',
    changeowner_count: '0',
  },
  {
    label: '1245528',
    value: 4,
    block_number: '1245528',
    create_count: '0',
    update_count: '0',
    delete_count: '4',
    extend_count: '0',
    changeowner_count: '0',
  },
  {
    label: '1245532',
    value: 31,
    block_number: '1245532',
    create_count: '0',
    update_count: '20',
    delete_count: '31',
    extend_count: '0',
    changeowner_count: '0',
  },
  {
    label: '1245536',
    value: 2,
    block_number: '1245536',
    create_count: '1',
    update_count: '40',
    delete_count: '2',
    extend_count: '23',
    changeowner_count: '0',
  },
  {
    label: '1245538',
    value: 3,
    block_number: '1245538',
    create_count: '4',
    update_count: '14',
    delete_count: '3',
    extend_count: '25',
    changeowner_count: '0',
  },
  {
    label: '1245540',
    value: 4,
    block_number: '1245540',
    create_count: '2',
    update_count: '10',
    delete_count: '4',
    extend_count: '30',
    changeowner_count: '0',
  },
];

test('histogram with block operations +@dark-mode +@mobile', async({ render }) => {
  const visibleOperations: Array<OperationTypeCount> = [ 'create_count', 'delete_count', 'extend_count', 'update_count', 'changeowner_count' ];
  const component = await render(<BlockOperationsChart items={ testData } height={ 350 } visibleOperations={ visibleOperations }/>);

  await expect(component).toHaveScreenshot();
});

test('filtered histogram with block operations (create and delete only)', async({ render }) => {
  const visibleOperations: Array<OperationTypeCount> = [ 'create_count', 'delete_count', 'changeowner_count' ];
  const component = await render(<BlockOperationsChart items={ testData } height={ 350 } visibleOperations={ visibleOperations }/>);

  await expect(component).toHaveScreenshot();
});

test('histogram with block operations tooltip', async({ render, page }) => {
  const visibleOperations: Array<OperationTypeCount> = [ 'create_count', 'delete_count', 'extend_count', 'update_count', 'changeowner_count' ];
  const component = await render(<BlockOperationsChart items={ testData } height={ 350 } visibleOperations={ visibleOperations }/>);

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
