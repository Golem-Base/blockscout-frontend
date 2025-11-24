import type { TestFixture, Page } from '@playwright/test';

interface MockArkivConfig {
  isConnected?: boolean;
  createEntityResponse?: Array<{ entityKey: string }>;
  updateEntityResponse?: Array<{ entityKey: string }>;
  queryResponse?: { entities: Array<{ key: string }>; cursor?: string };
}

export type MockArkivFixture = (config?: MockArkivConfig) => Promise<void>;

const fixture: TestFixture<MockArkivFixture, { page: Page }> = async({ page }, use) => {
  await use(async(config = {}) => {
    const defaultEntityKey = '0x0137cd898a9aaa92bbe94999d2a98241f5eabc829d9354160061789963f85995';
    const golemBaseConfig: MockArkivConfig = {
      isConnected: false,
      createEntityResponse: [ { entityKey: defaultEntityKey } ],
      updateEntityResponse: [ { entityKey: defaultEntityKey } ],
      queryResponse: { entities: [] },
      ...config,
    };

    await page.evaluate((golemBaseConfig) => {
      window.localStorage.setItem('pw_arkiv', JSON.stringify(golemBaseConfig));
    }, golemBaseConfig);
  });
};

export default fixture;
