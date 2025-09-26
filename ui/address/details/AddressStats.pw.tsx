import React from 'react';

import * as ranksMock from 'mocks/address/ranks';
import * as statsMock from 'mocks/address/stats';
import { test, expect } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import AddressStats from './AddressStats';

const ADDRESS_HASH = '0x1234567890123456789012345678901234567890';

test('renders all the data +@mobile', async({ render, mockApiResponse, page }) => {
  await mockApiResponse('golemBaseIndexer:addressStats', statsMock.statsResponse, {
    pathParams: { address: ADDRESS_HASH },
  });

  await mockApiResponse('golemBaseIndexer:addressLeaderboardRanks', ranksMock.ranksResponse, {
    pathParams: { address: ADDRESS_HASH },
  });

  const component = await render(
    <AddressStats addressHash={ ADDRESS_HASH }/>,
  );

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});

test('asserts correct links', async({ render, mockApiResponse }) => {
  await mockApiResponse('golemBaseIndexer:addressStats', statsMock.statsResponse, {
    pathParams: { address: ADDRESS_HASH },
  });

  await mockApiResponse('golemBaseIndexer:addressLeaderboardRanks', ranksMock.ranksResponse, {
    pathParams: { address: ADDRESS_HASH },
  });

  const component = await render(
    <AddressStats addressHash={ ADDRESS_HASH }/>,
  );

  const biggestSpendersLink = component.locator('a[href*="/leaderboards/spenders"]');
  await expect(biggestSpendersLink).toHaveAttribute('href', '/leaderboards/spenders');

  const entitiesCreatedLink = component.locator('a[href*="/leaderboards/entity-creators"]');
  await expect(entitiesCreatedLink).toHaveAttribute('href', '/leaderboards/entity-creators?page=3');

  const entitiesOwnedLink = component.locator('a[href*="/leaderboards/owners"]');
  await expect(entitiesOwnedLink).toHaveAttribute('href', '/leaderboards/owners');

  const dataOwnedLink = component.locator('a[href*="/leaderboards/largest-entities"]');
  await expect(dataOwnedLink).toHaveAttribute('href', '/leaderboards/largest-entities?page=100');
});
