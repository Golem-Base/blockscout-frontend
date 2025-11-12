const DEFAULT_ENTITY_KEY = '0x0137cd898a9aaa92bbe94999d2a98241f5eabc829d9354160061789963f85995';

const DEFAULT_CONFIG = {
  isConnected: false,
  createEntitiesResponse: [ { entityKey: DEFAULT_ENTITY_KEY } ],
  updateEntitiesResponse: [ { entityKey: DEFAULT_ENTITY_KEY } ],
  queryEntitiesResponse: [],
};

function getGolemBaseConfig() {
  try {
    const stored = window.localStorage.getItem('pw_golem_base');
    return stored ? { ...DEFAULT_CONFIG, ...(JSON.parse(stored) as typeof DEFAULT_CONFIG) } : DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}

const createMockClient = () => {
  const config = getGolemBaseConfig();
  return {
    createEntities: () => Promise.resolve(config.createEntitiesResponse),
    updateEntities: () => Promise.resolve(config.updateEntitiesResponse),
  };
};

const createMockPublicClient = () => {
  const config = getGolemBaseConfig();
  return {
    queryEntities: () => Promise.resolve(config.queryEntitiesResponse),
  };
};

export const useArkivClient = () => {
  const config = getGolemBaseConfig();
  return {
    isConnected: config.isConnected,
    isLoading: false,
    createClient: () => Promise.resolve(createMockClient()),
  };
};

export const createPublicClient = () => createMockPublicClient();
