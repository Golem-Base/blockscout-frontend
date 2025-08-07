import React from 'react';

import * as entityOpsMock from 'mocks/operations/entityOps';
import { expect, test } from 'playwright/lib';

import EntityOpsTable from './EntityOpsTable';

test('base view +@dark-mode', async({ render }) => {
  const component = await render(
    <EntityOpsTable
      operations={ [
        entityOpsMock.baseEntityOperation,
        entityOpsMock.updateEntityOperation,
        entityOpsMock.extendEntityOperation,
        entityOpsMock.deleteEntityOperation,
      ] }
    />,
  );

  await expect(component).toHaveScreenshot();
});

test('loading state +@dark-mode', async({ render }) => {
  const component = await render(
    <EntityOpsTable
      operations={ [
        entityOpsMock.baseEntityOperation,
        entityOpsMock.updateEntityOperation,
      ] }
      isLoading={ true }
    />,
  );

  await expect(component).toHaveScreenshot();
});
