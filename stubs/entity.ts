import type { EntityStatus, FullEntity } from '@golembase/l3-indexer-types';

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
    },
    {
      key: 'category',
      value: 'Sample',
    },
  ],
  numeric_annotations: [
    {
      key: 'version',
      value: '1',
    },
    {
      key: 'priority',
      value: '10',
    },
  ],
  created_at_tx_hash: TX_HASH,
  created_at_operation_index: '0',
  created_at_block_number: '1234567',
  created_at_timestamp: '2024-01-15T10:30:00Z',
  expires_at_block_number: '2234567',
  expires_at_timestamp: '2024-06-15T10:30:00Z',
  owner: ADDRESS_HASH,
  gas_used: '21000',
  fees_paid: '500000000000000',
};
