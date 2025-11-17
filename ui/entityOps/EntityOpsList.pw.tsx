import React from 'react';

import * as entityOpsMock from 'mocks/operations/entityOps';
import { test, expect, devices } from 'playwright/lib';

import EntityOpsList from './EntityOpsList';

test.use({ viewport: devices['iPhone 13 Pro'].viewport });

test('base view +@dark-mode', async({ render }) => {
  const component = await render(
    <EntityOpsList
      items={ [
        entityOpsMock.baseEntityOperation,
        entityOpsMock.updateEntityOperation,
        entityOpsMock.extendEntityOperation,
        entityOpsMock.deleteEntityOperation,
        entityOpsMock.changeOwnerEntityOperation,
      ] }
    />,
  );

  await expect(component).toHaveScreenshot();
});

test('loading state +@dark-mode', async({ render }) => {
  const component = await render(
    <EntityOpsList
      items={ [
        entityOpsMock.baseEntityOperation,
        entityOpsMock.updateEntityOperation,
      ] }
      isLoading={ true }
    />,
  );

  await expect(component).toHaveScreenshot();
});

test('expanded CREATE operation details', async({ render, page, mockApiResponse }) => {
  await mockApiResponse('golemBaseIndexer:operation', entityOpsMock.createEntityHistoryEntry, {
    pathParams: {
      tx_hash: entityOpsMock.baseEntityOperation.transaction_hash,
      op_index: entityOpsMock.baseEntityOperation.index,
    },
  });

  const component = await render(
    <EntityOpsList
      items={ [ entityOpsMock.baseEntityOperation ] }
    />,
  );

  await page.getByTestId('expand-button').click();
  await expect(page.getByTestId('operation-details')).toBeVisible();
  await expect(component).toHaveScreenshot();
});

test('expanded UPDATE operation details', async({ render, page, mockApiResponse }) => {
  await mockApiResponse('golemBaseIndexer:operation', entityOpsMock.updateEntityHistoryEntry, {
    pathParams: {
      tx_hash: entityOpsMock.updateEntityOperation.transaction_hash,
      op_index: entityOpsMock.updateEntityOperation.index,
    },
  });

  const component = await render(
    <EntityOpsList
      items={ [ entityOpsMock.updateEntityOperation ] }
    />,
  );

  await page.getByTestId('expand-button').click();
  await expect(page.getByTestId('operation-details')).toBeVisible();
  await expect(component).toHaveScreenshot();
});

test('expanded EXTEND operation details', async({ render, page, mockApiResponse }) => {
  await mockApiResponse('golemBaseIndexer:operation', entityOpsMock.extendEntityHistoryEntry, {
    pathParams: {
      tx_hash: entityOpsMock.extendEntityOperation.transaction_hash,
      op_index: entityOpsMock.extendEntityOperation.index,
    },
  });

  const component = await render(
    <EntityOpsList
      items={ [ entityOpsMock.extendEntityOperation ] }
    />,
  );

  await page.getByTestId('expand-button').click();
  await expect(page.getByTestId('operation-details')).toBeVisible();
  await expect(component).toHaveScreenshot();
});

test('expanded DELETE operation details', async({ render, page, mockApiResponse }) => {
  await mockApiResponse('golemBaseIndexer:operation', entityOpsMock.deleteEntityHistoryEntry, {
    pathParams: {
      tx_hash: entityOpsMock.deleteEntityOperation.transaction_hash,
      op_index: entityOpsMock.deleteEntityOperation.index,
    },
  });

  const component = await render(
    <EntityOpsList
      items={ [ entityOpsMock.deleteEntityOperation ] }
    />,
  );

  await page.getByTestId('expand-button').click();
  await expect(page.getByTestId('operation-details')).toBeVisible();
  await expect(component).toHaveScreenshot();
});

test('expanded CHANGE OWNER operation details', async({ render, page, mockApiResponse }) => {
  await mockApiResponse('golemBaseIndexer:operation', entityOpsMock.changeOwnerEntityHistoryEntry, {
    pathParams: {
      tx_hash: entityOpsMock.changeOwnerEntityOperation.transaction_hash,
      op_index: entityOpsMock.changeOwnerEntityOperation.index,
    },
  });

  const component = await render(
    <EntityOpsList
      items={ [ entityOpsMock.changeOwnerEntityOperation ] }
    />,
  );

  await page.getByTestId('expand-button').click();
  await expect(page.getByTestId('operation-details')).toBeVisible();
  await expect(component).toHaveScreenshot();
});
