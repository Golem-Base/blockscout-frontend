import type { Page } from '@playwright/test';

export async function enableGolemBaseConnection(page: Page, enabled = true): Promise<void> {
  await page.evaluate((enabledValue) => {
    (globalThis as { __GOLEM_BASE_CONNECTED__?: boolean }).__GOLEM_BASE_CONNECTED__ = enabledValue;
  }, enabled);
}
