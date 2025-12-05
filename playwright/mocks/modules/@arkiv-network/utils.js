// Mock for @arkiv-network/sdk/utils
// This is a minimal mock to avoid build errors in Playwright tests

export class ExpirationTime {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static fromDate(_date) {
    return new ExpirationTime();
  }
}
