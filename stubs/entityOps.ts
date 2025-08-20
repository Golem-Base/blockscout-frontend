import type { Operation } from '@golembase/l3-indexer-types';
import { OperationType } from '@golembase/l3-indexer-types';

import { ADDRESS_HASH } from './addressParams';

export const ENTITY_OPERATION: Operation = {
  operation: OperationType.CREATE,
  block_hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  transaction_hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  sender: ADDRESS_HASH,
  entity_key: 'f68e9f2e8b5d6c4a2e5c8a9b1d3f7e8c2a5b8d1e4f7a9c2b5d8e1f4a7c',
  index: '0',
  gas_used: '10',
  fees_paid: '100',
};
