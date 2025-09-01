import type { TestFixture, Page } from '@playwright/test';

interface MockGolemBaseConfig {
  isConnected?: boolean;
  createEntitiesResponse?: Array<{ entityKey: string }>;
  updateEntitiesResponse?: Array<{ entityKey: string }>;
  queryEntitiesResponse?: Array<{ entityKey: string; storageValue: Uint8Array }>;
}

export type MockGolemBaseFixture = (config?: MockGolemBaseConfig) => Promise<void>;

const fixture: TestFixture<MockGolemBaseFixture, { page: Page }> = async({ page }, use) => {
  await use(async(config = {}) => {
    const defaultEntityKey = '0x0137cd898a9aaa92bbe94999d2a98241f5eabc829d9354160061789963f85995';
    const golemBaseConfig = {
      isConnected: false,
      createEntitiesResponse: [ { entityKey: defaultEntityKey } ],
      updateEntitiesResponse: [ { entityKey: defaultEntityKey } ],
      queryEntitiesResponse: [],
      ...config,
    };

    await page.evaluate((golemBaseConfig) => {
      window.localStorage.setItem('pw_golem_base', JSON.stringify(golemBaseConfig));
    }, golemBaseConfig);
  });
};

export default fixture;
