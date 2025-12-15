import { EntityStatus } from '@golembase/l3-indexer-types';
import type {
  LeaderboardEntitiesOwnedItem,
  LeaderboardEntitiesCreatedItem,
  LeaderboardBiggestSpendersItem,
  LeaderboardLargestEntitiesItem,
  EntityWithExpTimestamp,
  LeaderboardEffectivelyLargestEntitiesItem,
} from '@golembase/l3-indexer-types';

export const TOP_SPENDER: LeaderboardBiggestSpendersItem = {
  rank: '1',
  address: '0xEB0680e8fEF19f5B6490a083d5b59f6F04930B5B',
  total_fees: '12345678901234567890',
};

export const TOP_ENTITY_OWNER: LeaderboardEntitiesOwnedItem = {
  address: '0xEB0680e8fEF19f5B6490a083d5b59f6F04930B5B',
  entities_count: '42',
  rank: '1',
};

export const TOP_ENTITY_CREATOR: LeaderboardEntitiesCreatedItem = {
  rank: '1',
  address: '0xEB0680e8fEF19f5B6490a083d5b59f6F04930B5B',
  entities_created_count: '25',
};

export const LARGEST_ENTITIES: LeaderboardLargestEntitiesItem = {
  rank: '1',
  entity_key: '0xEB0680e8fEF19f5B6490a083d5b59f6F04930B5B',
  data_size: '12345678901234567890',
};

export const EFFECTIVELY_LARGEST_ENTITIES: LeaderboardEffectivelyLargestEntitiesItem = {
  rank: '1',
  entity_key: '0xEB0680e8fEF19f5B6490a083d5b59f6F04930B5B',
  data_size: '12345678901234567890',
  lifespan: '123456789',
};

export const LONGEST_LIVED_ENTITIES: EntityWithExpTimestamp = {
  key: '0xEB0680e8fEF19f5B6490a083d5b59f6F04930B5B',
  data: '12345678901234567890',
  status: EntityStatus.ACTIVE,
  created_at_tx_hash: '0xEB0680e8fEF19f5B6490a083d5b59f6F04930B5B',
  last_updated_at_tx_hash: '0xEB0680e8fEF19f5B6490a083d5b59f6F04930B5B',
  expires_at_block_number: '12345678901234567890',
  expires_at_timestamp: '2025-09-01T19:01:00+00:00',
  cost: '21000',
};
