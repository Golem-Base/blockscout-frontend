import React from 'react';

import * as entityMock from 'mocks/entity';
import { baseEntityOperation } from 'mocks/operations/entityOps';
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
    await expect(component.getByText('Created at', { exact: true })).toBeVisible();

    // Verify status is displayed correctly
    await expect(component.getByText('Active', { exact: true })).toBeVisible();
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
    await expect(component.getByText('Annotations', { exact: true })).toBeVisible();

    // Verify string annotations
    await expect(component.getByText('name:', { exact: true })).toBeVisible();
    await expect(component.getByText('Test Entity')).toBeVisible();
    await expect(component.getByText('category:', { exact: true })).toBeVisible();
    await expect(component.getByText('Sample')).toBeVisible();

    // Verify numeric annotations
    await expect(component.getByText('version:', { exact: true })).toBeVisible();
    await expect(component.getByText('1', { exact: true })).toBeVisible();
    await expect(component.getByText('priority:', { exact: true })).toBeVisible();
    await expect(component.getByText('10', { exact: true })).toBeVisible();
  });

  test('noData entity - details tab', async({ render, mockApiResponse }) => {
    await mockApiResponse('golemBaseIndexer:entity', entityMock.noData, {
      pathParams: { key: entityKey },
    });

    const component = await render(<Entity/>, { hooksConfig });
    await expect(component).toHaveScreenshot();
  });

  test('noData entity - data tab', async({ render, mockApiResponse }) => {
    const hooksConfigWithTab = {
      router: {
        query: { key: entityKey, tab: 'data' },
      },
    };

    await mockApiResponse('golemBaseIndexer:entity', entityMock.noData, {
      pathParams: { key: entityKey },
    });

    const component = await render(<Entity/>, { hooksConfig: hooksConfigWithTab });
    await expect(component).toHaveScreenshot();
  });

  test('active entity - entity operations tab', async({ render, mockApiResponse }) => {
    const hooksConfigWithTab = {
      router: {
        query: { key: entityKey, tab: 'entity_ops_all' },
      },
    };

    await mockApiResponse('golemBaseIndexer:entity', entityMock.base, {
      pathParams: { key: entityKey },
    });

    const mockOperationsResponse = {
      items: [ baseEntityOperation ],
      next_page_params: null,
    };

    await mockApiResponse('golemBaseIndexer:operations', mockOperationsResponse, {
      queryParams: { operation: 'ALL', page_size: '50', entity_key: entityKey },
    });

    await mockApiResponse('golemBaseIndexer:operationsCount', {
      create_count: '1',
      update_count: '2',
      extend_count: '3',
      delete_count: '0',
      changeowner_count: '1',
    }, {
      queryParams: { entity_key: entityKey },
    });

    const component = await render(<Entity/>, { hooksConfig: hooksConfigWithTab });
    await expect(component).toHaveScreenshot();
  });

  test('entity with JSON data +@dark-mode', async({ render, mockApiResponse, page }) => {
    const hooksConfigWithTab = {
      router: {
        query: { key: entityMock.withJsonData.key, tab: 'data' },
      },
    };

    await mockApiResponse('golemBaseIndexer:entity', entityMock.withJsonData, {
      pathParams: { key: entityMock.withJsonData.key },
    });

    const component = await render(<Entity/>, { hooksConfig: hooksConfigWithTab });

    await component.getByRole('combobox').click();
    await page.getByRole('option', { name: 'Rich' }).click();

    await expect(component).toHaveScreenshot();
  });

  test('entity with YAML data +@dark-mode', async({ render, mockApiResponse, page }) => {
    const hooksConfigWithTab = {
      router: {
        query: { key: entityMock.withYamlData.key, tab: 'data' },
      },
    };

    await mockApiResponse('golemBaseIndexer:entity', entityMock.withYamlData, {
      pathParams: { key: entityMock.withYamlData.key },
    });

    const component = await render(<Entity/>, { hooksConfig: hooksConfigWithTab });

    await component.getByRole('combobox').click();
    await page.getByRole('option', { name: 'Rich' }).click();

    await expect(component).toHaveScreenshot();
  });
});
