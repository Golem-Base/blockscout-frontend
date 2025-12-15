import type { Entity as ArkivEntity } from '@arkiv-network/sdk';
import type { Hex } from 'viem';

import type { Entity, FullEntity } from '@golembase/l3-indexer-types';
import { EntityStatus } from '@golembase/l3-indexer-types';

import { ADDRESS_HASH } from './addressParams';
import { TX_HASH } from './tx';

export const ENTITY_KEY = 'f68e9f2e8b5d6c4a2e5c8a9b1d3f7e8c2a5b8d1e4f7a9c2b5d8e1f4a7c';

export const ENTITY_BASE: FullEntity = {
  key: ENTITY_KEY,
  data: '0x48656c6c6f20576f726c64',
  data_size: '11',
  status: 'ACTIVE' as EntityStatus,
  string_annotations: [
    {
      key: 'name',
      value: 'Test Entity',
      related_entities: '1',
    },
    {
      key: 'category',
      value: 'Sample',
      related_entities: '1',
    },
  ],
  numeric_annotations: [
    {
      key: 'version',
      value: '1',
      related_entities: '1',
    },
    {
      key: 'priority',
      value: '10',
      related_entities: '0',
    },
  ],
  created_at_tx_hash: TX_HASH,
  created_at_operation_index: '0',
  created_at_block_number: '1234567',
  created_at_timestamp: '2024-01-15T10:30:00Z',
  expires_at_block_number: '2234567',
  expires_at_timestamp: '2024-06-15T10:30:00Z',
  owner: ADDRESS_HASH,
  cost: '21000',
  updated_at_tx_hash: TX_HASH,
  updated_at_operation_index: '0',
  updated_at_block_number: '1234567',
  updated_at_timestamp: '2024-01-15T10:30:00',
};

export const ENTITY_QUERY_ITEM = {
  key: ENTITY_KEY as Hex,
} as ArkivEntity;

export const ENTITY: Entity = {
  key: ENTITY_KEY,
  status: EntityStatus.ACTIVE,
  last_updated_at_tx_hash: TX_HASH,
  expires_at_block_number: '2234567',
  created_at_tx_hash: TX_HASH,
  data: '0x48656c6c6f20576f726c64',
  cost: '21000',
};
