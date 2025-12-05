// Mock for @arkiv-network/sdk
// This is a minimal mock to avoid build errors in Playwright tests

export function createPublicClient() {
  return {};
}

export function createWalletClient() {
  return {};
}

export const http = () => ({});

export const chains = {};
