import React from 'react';

import * as entityMock from 'mocks/entity';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { expect, test } from 'playwright/lib';

import Entity from './Entity';

const entityKey = entityMock.base.key;
const hooksConfig = {
  router: {
    query: { key: entityKey },
  },
};

test.beforeEach(async({ mockEnvs, mockTextAd }) => {
  await mockEnvs(ENVS_MAP.golemBaseIndexer);
  await mockTextAd();
});

test.describe('Entity page', () => {
  test('active entity - details tab', async({ render, mockApiResponse }) => {
    await mockApiResponse('golemBaseIndexer:entity', entityMock.base, {
      pathParams: { key: entityKey },
    });

    const component = await render(<Entity/>, { hooksConfig });
    await expect(component).toHaveScreenshot();
  });

  test('active entity - data tab', async({ render, mockApiResponse }) => {
    const hooksConfigWithTab = {
      router: {
        query: { key: entityKey, tab: 'data' },
      },
    };

    await mockApiResponse('golemBaseIndexer:entity', entityMock.base, {
      pathParams: { key: entityKey },
    });

    const component = await render(<Entity/>, { hooksConfig: hooksConfigWithTab });
    await expect(component).toHaveScreenshot();
  });

  test('deleted entity', async({ render, mockApiResponse }) => {
    await mockApiResponse('golemBaseIndexer:entity', entityMock.deleted, {
      pathParams: { key: entityMock.deleted.key },
    });

    const hooksConfigDeleted = {
      router: {
        query: { key: entityMock.deleted.key },
      },
    };

    const component = await render(<Entity/>, { hooksConfig: hooksConfigDeleted });
    await expect(component).toHaveScreenshot();
  });

  test('expired entity', async({ render, mockApiResponse }) => {
    await mockApiResponse('golemBaseIndexer:entity', entityMock.expired, {
      pathParams: { key: entityMock.expired.key },
    });

    const hooksConfigExpired = {
      router: {
        query: { key: entityMock.expired.key },
      },
    };

    const component = await render(<Entity/>, { hooksConfig: hooksConfigExpired });
    await expect(component).toHaveScreenshot();
  });

  test('entity with large data', async({ render, mockApiResponse }) => {
    await mockApiResponse('golemBaseIndexer:entity', entityMock.withLargeData, {
      pathParams: { key: entityMock.withLargeData.key },
    });

    const hooksConfigLarge = {
      router: {
        query: { key: entityMock.withLargeData.key },
      },
    };

    const component = await render(<Entity/>, { hooksConfig: hooksConfigLarge });
    await expect(component).toHaveScreenshot();
  });

  test('entity not found', async({ render, mockApiResponse }) => {
    const nonExistentKey = 'nonexistent123456789abcdef123456789abcdef123456789abcdef12345';

    await mockApiResponse('golemBaseIndexer:entity', null as never, {
      pathParams: { key: nonExistentKey },
      status: 404,
    });

    const hooksConfigNotFound = {
      router: {
        query: { key: nonExistentKey },
      },
    };

    const component = await render(<Entity/>, { hooksConfig: hooksConfigNotFound });
    await expect(component).toHaveScreenshot();
  });

  test('navigation between tabs', async({ render, mockApiResponse }) => {
    await mockApiResponse('golemBaseIndexer:entity', entityMock.base, {
      pathParams: { key: entityKey },
    });

    const component = await render(<Entity/>, { hooksConfig });

    // Start on details tab
    await expect(component.getByTestId('details-tab')).toBeVisible();

    // Click on data tab
    await component.getByText('Data & Annotations').click();
    await expect(component.getByTestId('entity-data')).toBeVisible();

    // Click back to details tab
    await component.getByText('Details').click();
    await expect(component.getByTestId('entity-details')).toBeVisible();
  });

  test('copy entity key functionality', async({ render, mockApiResponse, page }) => {
    await mockApiResponse('golemBaseIndexer:entity', entityMock.base, {
      pathParams: { key: entityKey },
    });

    const component = await render(<Entity/>, { hooksConfig });

    // Find and click the copy button
    const copyButton = component.getByRole('button', { name: 'Copy' }).first();
    await expect(copyButton).toBeVisible();
    await copyButton.click();

    // Verify tooltip appears (indicating copy was successful)
    await expect(page.getByText('Copied')).toBeVisible();
  });

  test('entity details display correct information', async({ render, mockApiResponse }) => {
    await mockApiResponse('golemBaseIndexer:entity', entityMock.base, {
      pathParams: { key: entityKey },
    });

    const component = await render(<Entity/>, { hooksConfig });

    // Verify key elements are displayed
    await expect(component.getByText('Entity Details')).toBeVisible();
    await expect(component.getByText('Entity Key')).toBeVisible();
    await expect(component.getByText('Status')).toBeVisible();
    await expect(component.getByText('Owner')).toBeVisible();
    await expect(component.getByText('Gas Used')).toBeVisible();
    await expect(component.getByText('Created at Block')).toBeVisible();
    await expect(component.getByText('Created at')).toBeVisible();

    // Verify status is displayed correctly
    await expect(component.getByText('Active')).toBeVisible();
  });

  test('entity data tab displays annotations', async({ render, mockApiResponse }) => {
    const hooksConfigWithTab = {
      router: {
        query: { key: entityKey, tab: 'data' },
      },
    };

    await mockApiResponse('golemBaseIndexer:entity', entityMock.base, {
      pathParams: { key: entityKey },
    });

    const component = await render(<Entity/>, { hooksConfig: hooksConfigWithTab });

    // Verify data elements are displayed
    await expect(component.getByText('Entity Data')).toBeVisible();
    await expect(component.getByText('Size')).toBeVisible();
    await expect(component.getByText('Annotations')).toBeVisible();

    // Verify string annotations
    await expect(component.getByText('name:')).toBeVisible();
    await expect(component.getByText('Test Entity')).toBeVisible();
    await expect(component.getByText('category:')).toBeVisible();
    await expect(component.getByText('Sample')).toBeVisible();

    // Verify numeric annotations
    await expect(component.getByText('version:')).toBeVisible();
    await expect(component.getByText('1')).toBeVisible();
    await expect(component.getByText('priority:')).toBeVisible();
    await expect(component.getByText('10')).toBeVisible();
  });
});
