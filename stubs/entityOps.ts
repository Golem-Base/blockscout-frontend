import type { EntityHistoryEntry, Operation } from '@golembase/l3-indexer-types';
import { EntityStatus, OperationType } from '@golembase/l3-indexer-types';

import { ADDRESS_HASH } from './addressParams';

export const ENTITY_OPERATION: Operation = {
  operation: OperationType.CREATE,
  block_hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  block_number: '12345678',
  transaction_hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  sender: ADDRESS_HASH,
  entity_key: 'f68e9f2e8b5d6c4a2e5c8a9b1d3f7e8c2a5b8d1e4f7a9c2b5d8e1f4a7c',
  index: '0',
  cost: '10',
  fees_paid: '100',
};

export const ENTITY_HISTORY_ENTRY: EntityHistoryEntry = {
  entity_key: 'f68e9f2e8b5d6c4a2e5c8a9b1d3f7e8c2a5b8d1e4f7a9c2b5d8e1f4a7c',
  block_number: '12345678',
  block_hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  transaction_hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  tx_index: '0',
  op_index: '0',
  block_timestamp: '2024-01-01T00:00:00.000Z',
  sender: ADDRESS_HASH,
  operation: OperationType.CREATE,
  btl: '1000',
  data: '0x48656c6c6f20576f726c64', // "Hello World" in hex
  prev_data: undefined,
  status: EntityStatus.ACTIVE,
  prev_status: undefined,
  expires_at_block_number: '12345690',
  prev_expires_at_block_number: undefined,
  cost: '100000',
  total_cost: '100000',
  expires_at_timestamp: '2024-12-31T23:59:59.000Z',
  prev_expires_at_timestamp: undefined,
  prev_owner: undefined,
  owner: undefined,
};
