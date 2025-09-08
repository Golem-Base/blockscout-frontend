import { EntityStatus, type AddressByEntitiesOwned, type BiggestSpender, type EntityDataSize, type EntityWithExpTimestamp } from '@golembase/l3-indexer-types';

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

export const LONGEST_LIVED_ENTITIES: EntityWithExpTimestamp = {
  key: '0xEB0680e8fEF19f5B6490a083d5b59f6F04930B5B',
  data: '12345678901234567890',
  status: EntityStatus.ACTIVE,
  created_at_tx_hash: '0xEB0680e8fEF19f5B6490a083d5b59f6F04930B5B',
  last_updated_at_tx_hash: '0xEB0680e8fEF19f5B6490a083d5b59f6F04930B5B',
  expires_at_block_number: '12345678901234567890',
  expires_at_timestamp: '2026-01-01T00:00:00.000Z',
};
