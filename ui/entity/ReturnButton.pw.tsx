import React from 'react';

import { test, expect } from 'playwright/lib';

import ReturnButton from './ReturnButton';

test.describe('ReturnButton', () => {
  test('should have correct href when referrer exists', async({ render }) => {
    const hooksConfig = {
      router: {
        query: { key: 'test-entity-key' },
        pathname: '/entity/test-entity-key/update',
      },
    };

    const appContext = {
      pageProps: {
        cookies: '',
        referrer: '/entity/search?q=test',
        query: {},
        adBannerProvider: null,
        apiData: null,
        uuid: '',
      },
    };

    const component = await render(
      <ReturnButton isEdit={ false }/>,
      { hooksConfig },
      { appContext },
    );

    const link = component.locator('a');
    await expect(component).toContainText('Cancel');
    await expect(link).toHaveAttribute('href', '/entity/search?q=test');
  });

  test('should have correct href when there is no referrer but isEdit=true', async({ render }) => {
    const hooksConfig = {
      router: {
        query: { key: 'test-entity-key' },
        pathname: '/entity/test-entity-key/update',
      },
    };

    const appContext = {
      pageProps: {
        cookies: '',
        referrer: '',
        query: {},
        adBannerProvider: null,
        apiData: null,
        uuid: '',
      },
    };

    const component = await render(
      <ReturnButton isEdit/>,
      { hooksConfig },
      { appContext },
    );

    const link = component.locator('a');
    await expect(link).toHaveAttribute('href', '/entity/test-entity-key');
  });

  test('should have correct href when there is no referrer', async({ render }) => {
    const hooksConfig = {
      router: {
        query: { key: 'test-entity-key' },
        pathname: '/entity/create',
      },
    };

    const appContext = {
      pageProps: {
        cookies: '',
        referrer: '',
        query: {},
        adBannerProvider: null,
        apiData: null,
        uuid: '',
      },
    };

    const component = await render(
      <ReturnButton/>,
      { hooksConfig },
      { appContext },
    );

    const link = component.locator('a');
    await expect(link).toHaveAttribute('href', '/');
  });
});
