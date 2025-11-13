import type { TestFixture, Page } from '@playwright/test';

interface MockArkivConfig {
  isConnected?: boolean;
  createEntitiesResponse?: Array<{ entityKey: string }>;
  updateEntitiesResponse?: Array<{ entityKey: string }>;
  queryResponse?: Array<{ key: string; storageValue: Uint8Array }>;
}

export type MockArkivFixture = (config?: MockArkivConfig) => Promise<void>;

const fixture: TestFixture<MockArkivFixture, { page: Page }> = async({ page }, use) => {
  await use(async(config = {}) => {
    const defaultEntityKey = '0x0137cd898a9aaa92bbe94999d2a98241f5eabc829d9354160061789963f85995';
    const golemBaseConfig = {
      isConnected: false,
      createEntityResponse: [ { entityKey: defaultEntityKey } ],
      updateEntityResponse: [ { entityKey: defaultEntityKey } ],
      queryEntitiesResponse: [],
      ...config,
    };

    await page.evaluate((golemBaseConfig) => {
      window.localStorage.setItem('pw_arkiv', JSON.stringify(golemBaseConfig));
    }, golemBaseConfig);
  });
};

export default fixture;
