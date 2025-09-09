import type { AddressByEntitiesOwned, BiggestSpender, EntityDataSize } from '@golembase/l3-indexer-types';

export const TOP_SPENDER: BiggestSpender = {
  rank: '1',
  address: '0xEB0680e8fEF19f5B6490a083d5b59f6F04930B5B',
  total_fees: '12345678901234567890',
};

export const TOP_ENTITY_OWNER: AddressByEntitiesOwned = {
  address: '0xEB0680e8fEF19f5B6490a083d5b59f6F04930B5B',
  entities_count: '42',
};

export const EFFECTIVELY_LARGEST_ENTITIES: EntityDataSize = {
  entity_key: '0xEB0680e8fEF19f5B6490a083d5b59f6F04930B5B',
  data_size: '12345678901234567890',
};
