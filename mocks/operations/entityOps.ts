import type { Operation, EntityHistoryEntry, CountOperationsResponse } from '@golembase/l3-indexer-types';
import { OperationType, EntityStatus } from '@golembase/l3-indexer-types';

import { ADDRESS_HASH } from 'stubs/addressParams';

export const createEntityOperation = (operationType: OperationType): Operation => ({
  operation: operationType,
  block_hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  block_number: '12345678',
  transaction_hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  sender: ADDRESS_HASH,
  entity_key: 'f68e9f2e8b5d6c4a2e5c8a9b1d3f7e8c2a5b8d1e4f7a9c2b5d8e1f4a7c',
  index: '0',
  btl: '1',
  gas_used: '10',
  fees_paid: '100',
});

export const createEntityHistoryEntryMock = (operationType: OperationType): EntityHistoryEntry => ({
  entity_key: 'f68e9f2e8b5d6c4a2e5c8a9b1d3f7e8c2a5b8d1e4f7a9c2b5d8e1f4a7c',
  block_number: '12345678',
  block_hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  transaction_hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  tx_index: '0',
  op_index: '0',
  block_timestamp: '2024-01-01T00:00:00.000Z',
  sender: ADDRESS_HASH,
  operation: operationType,
  btl: '1000',
  data: '0x48656c6c6f20576f726c64',
  prev_data: operationType === OperationType.CREATE ? undefined : '0x50726576696f757320576f726c64',
  status: operationType === OperationType.DELETE ? EntityStatus.DELETED : EntityStatus.ACTIVE,
  prev_status: operationType === OperationType.CREATE ? undefined : EntityStatus.ACTIVE,
  expires_at_block_number: '12345690',
  prev_expires_at_block_number: operationType === OperationType.CREATE ? undefined : '12345680',
  gas_used: '100000',
  fees_paid: '1000000',
  expires_at_timestamp: '2024-12-31T23:59:59.000Z',
  prev_expires_at_timestamp: operationType === OperationType.CREATE ? undefined : '2024-12-31T23:59:50.000Z',
});

export const baseEntityOperation = createEntityOperation(OperationType.CREATE);
export const updateEntityOperation = createEntityOperation(OperationType.UPDATE);
export const extendEntityOperation = createEntityOperation(OperationType.EXTEND);
export const deleteEntityOperation = createEntityOperation(OperationType.DELETE);

export const createEntityHistoryEntry = createEntityHistoryEntryMock(OperationType.CREATE);
export const updateEntityHistoryEntry = createEntityHistoryEntryMock(OperationType.UPDATE);
export const extendEntityHistoryEntry = createEntityHistoryEntryMock(OperationType.EXTEND);
export const deleteEntityHistoryEntry = createEntityHistoryEntryMock(OperationType.DELETE);
export const operationCounts: CountOperationsResponse = {
  create_count: '1',
  update_count: '2',
  delete_count: '3',
  extend_count: '4',
};
