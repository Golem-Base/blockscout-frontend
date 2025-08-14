const MOCK_KEY = '0x0137cd898a9aaa92bbe94999d2a98241f5eabc829d9354160061789963f85995';

const mockClient = {
  createEntities: () => Promise.resolve([ { key: MOCK_KEY } ]),
};

// Allow controlling the connection state
declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  var __GOLEM_BASE_CONNECTED__: boolean;
}

export const useGolemBaseClient = () => ({
  isConnected: globalThis.__GOLEM_BASE_CONNECTED__ !== false, // Default to true unless explicitly set to false
  createClient: () => Promise.resolve(mockClient),
});
