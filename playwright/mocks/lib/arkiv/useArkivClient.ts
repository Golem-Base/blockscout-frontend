const DEFAULT_ENTITY_KEY = '0x0137cd898a9aaa92bbe94999d2a98241f5eabc829d9354160061789963f85995';

const DEFAULT_CONFIG = {
  isConnected: false,
  createEntityResponse: [ { entityKey: DEFAULT_ENTITY_KEY } ],
  updateEntityResponse: [ { entityKey: DEFAULT_ENTITY_KEY } ],
  queryResponse: [],
};

function getArkivConfig() {
  try {
    const stored = window.localStorage.getItem('pw_arkiv');
    return stored ? { ...DEFAULT_CONFIG, ...(JSON.parse(stored) as typeof DEFAULT_CONFIG) } : DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}

const createMockClient = () => {
  const config = getArkivConfig();
  return {
    createEntity: () => Promise.resolve(config.createEntityResponse),
    updateEntity: () => Promise.resolve(config.updateEntityResponse),
  };
};

const createMockPublicClient = () => {
  const config = getArkivConfig();
  return {
    query: () => Promise.resolve(config.queryResponse),
  };
};

export const useArkivClient = () => {
  const config = getArkivConfig();
  return {
    isConnected: config.isConnected,
    isLoading: false,
    createClient: () => Promise.resolve(createMockClient()),
  };
};

export const createPublicClient = () => createMockPublicClient();
