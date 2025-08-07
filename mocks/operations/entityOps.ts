import type { Operation } from '@golembase/l3-indexer-types';
import { OperationType } from '@golembase/l3-indexer-types';

import { ADDRESS_HASH } from 'stubs/addressParams';

export const baseEntityOperation: Operation = {
  operation: OperationType.CREATE,
  block_hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  transaction_hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  sender: ADDRESS_HASH,
  entity_key: 'f68e9f2e8b5d6c4a2e5c8a9b1d3f7e8c2a5b8d1e4f7a9c2b5d8e1f4a7c',
  index: '0',
  btl: '1',
};

export const updateEntityOperation: Operation = {
  operation: OperationType.UPDATE,
  block_hash: '0x2345678901bcdef12345678901bcdef12345678901bcdef12345678901bcdef1',
  transaction_hash: '0xbcdef12345678901bcdef12345678901bcdef12345678901bcdef12345678901',
  sender: '0x8ba1f109551bD432803012645Hac136c1',
  entity_key: 'a12b34c56d78e90f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e',
  index: '1',
  btl: '2',
};

export const extendEntityOperation: Operation = {
  operation: OperationType.EXTEND,
  block_hash: '0x3456789012cdef123456789012cdef123456789012cdef123456789012cdef12',
  transaction_hash: '0xcdef123456789012cdef123456789012cdef123456789012cdef123456789012',
  sender: '0x9ca2f210662cE543904123756Ibd247d2',
  entity_key: '12a34b56c78d90e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e',
  index: '2',
  btl: '3',
};

export const deleteEntityOperation: Operation = {
  operation: OperationType.DELETE,
  block_hash: '0x456789013def1234567890123def1234567890123def1234567890123def123',
  transaction_hash: '0xdef1234567890123def1234567890123def1234567890123def1234567890123',
  sender: '0xacb3f321773dF654015234867Jce358e3',
  entity_key: '23a45b67c89d01e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e',
  index: '3',
};
