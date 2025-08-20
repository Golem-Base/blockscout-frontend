import { EntityStatus, OperationType, type EntityHistoryEntry } from '@golembase/l3-indexer-types';

import { ADDRESS_HASH } from './addressParams';
import { BLOCK_HASH } from './block';
import { ENTITY_KEY } from './entity';
import { TX_HASH } from './tx';

export const OPERATION_BASE: EntityHistoryEntry = {
  entity_key: ENTITY_KEY,
  block_number: '123',
  block_hash: BLOCK_HASH,
  transaction_hash: TX_HASH,
  tx_index: '1',
  op_index: '123',
  block_timestamp: '2023-05-12T19:29:12.000000Z',
  sender: ADDRESS_HASH,
  operation: OperationType.CREATE,
  status: EntityStatus.ACTIVE,
  expires_at_block_number: '321',
  expires_at_timestamp: '2023-05-12T19:29:12.000000Z',
  gas_used: '123',
  fees_paid: '123',
};
