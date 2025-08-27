import React from 'react';

import * as entityMock from 'mocks/operations/entityOps';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { expect, test } from 'playwright/lib';

import Operation from './Operation';

const pathParams = {
  tx_hash: entityMock.createEntityHistoryEntry.transaction_hash,
  op_index: entityMock.createEntityHistoryEntry.op_index,
};
const hooksConfig = {
  router: {
    query: {
      hash: pathParams.tx_hash,
      idx: pathParams.op_index,
    },
  },
};

test.beforeEach(async({ mockEnvs, mockTextAd }) => {
  await mockEnvs(ENVS_MAP.golemBaseIndexer);
  await mockTextAd();
});

test.describe('Operation page', () => {
  test('create operation', async({ render, mockApiResponse }) => {
    await mockApiResponse('golemBaseIndexer:operation', entityMock.createEntityHistoryEntry, {
      pathParams,
    });

    const component = await render(<Operation/>, { hooksConfig });
    await expect(component).toHaveScreenshot();
  });
  test('update operation', async({ render, mockApiResponse }) => {
    await mockApiResponse('golemBaseIndexer:operation', entityMock.updateEntityHistoryEntry, {
      pathParams,
    });

    const component = await render(<Operation/>, { hooksConfig });
    await expect(component).toHaveScreenshot();
  });
  test('extend operation', async({ render, mockApiResponse }) => {
    await mockApiResponse('golemBaseIndexer:operation', entityMock.extendEntityHistoryEntry, {
      pathParams,
    });

    const component = await render(<Operation/>, { hooksConfig });
    await expect(component).toHaveScreenshot();
  });
  test('delete operation', async({ render, mockApiResponse }) => {
    await mockApiResponse('golemBaseIndexer:operation', entityMock.deleteEntityHistoryEntry, {
      pathParams,
    });

    const component = await render(<Operation/>, { hooksConfig });
    await expect(component).toHaveScreenshot();
  });
});
