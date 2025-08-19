import type * as golemBaseIndexer from '@golembase/l3-indexer-types';

export const base: golemBaseIndexer.FullEntity = {
  key: 'f68e9f2e8b5d6c4a2e5c8a9b1d3f7e8c2a5b8d1e4f7a9c2b5d8e1f4a7c',
  data: '0x48656c6c6f20576f726c64',
  data_size: '11',
  status: 'ACTIVE' as golemBaseIndexer.EntityStatus,
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
  created_at_tx_hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  created_at_operation_index: '0',
  created_at_block_number: '1234567',
  created_at_timestamp: '2024-01-15T10:30:00Z',
  expires_at_block_number: '2234567',
  expires_at_timestamp: '2024-06-15T10:30:00Z',
  owner: '0x742d35cc6bc59fb56d41229f1e5e0d5c3f2cf9b7',
  gas_used: '21000',
  fees_paid: '500000000000000',
};

export const deleted: golemBaseIndexer.FullEntity = {
  key: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234',
  data: '0x44656c6574656420456e74697479',
  data_size: '14',
  status: 'DELETED' as golemBaseIndexer.EntityStatus,
  string_annotations: [],
  numeric_annotations: [],
  created_at_tx_hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  created_at_operation_index: '1',
  created_at_block_number: '1100000',
  created_at_timestamp: '2024-01-10T08:15:00Z',
  expires_at_block_number: '2100000',
  expires_at_timestamp: '2024-06-10T08:15:00Z',
  owner: '0x8ba1f109551bd432803012645hac136c0b1b6b7b',
  gas_used: '25000',
  fees_paid: '750000000000000',
};

export const expired: golemBaseIndexer.FullEntity = {
  key: 'z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3h2g1f0e9d8c7b6a5z4y3x2w1v0u9',
  data: '0x457870697265642045',
  data_size: '9',
  status: 'EXPIRED' as golemBaseIndexer.EntityStatus,
  string_annotations: [
    {
      key: 'note',
      value: 'This entity has expired',
    },
  ],
  numeric_annotations: [
    {
      key: 'age',
      value: '365',
    },
  ],
  created_at_tx_hash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
  created_at_operation_index: '2',
  created_at_block_number: '900000',
  created_at_timestamp: '2023-12-01T12:00:00Z',
  expires_at_block_number: '1500000',
  expires_at_timestamp: '2024-01-31T12:00:00Z',
  owner: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
  gas_used: '18500',
  fees_paid: '370000000000000',
};

export const withLargeData: golemBaseIndexer.FullEntity = {
  key: 'large123456789abcdef123456789abcdef123456789abcdef123456789abcdef12',
  data: '0x' + '48656c6c6f20576f726c642120'.repeat(100), // "Hello World! " repeated 100 times
  data_size: '1300',
  status: 'ACTIVE' as golemBaseIndexer.EntityStatus,
  string_annotations: [
    {
      key: 'type',
      value: 'Large Data Entity',
    },
    {
      key: 'description',
      value: 'This entity contains a lot of data for testing purposes',
    },
  ],
  numeric_annotations: [
    {
      key: 'size_category',
      value: '5',
    },
    {
      key: 'compression_ratio',
      value: '85',
    },
  ],
  created_at_tx_hash: '0x5555666677778888999900001111222233334444555566667777888899990000',
  created_at_operation_index: '5',
  created_at_block_number: '2000000',
  created_at_timestamp: '2024-02-01T14:20:30Z',
  expires_at_block_number: '3000000',
  expires_at_timestamp: '2024-08-01T14:20:30Z',
  owner: '0x90f79bf6eb2c4f870365e785982e1f101e93b906',
  gas_used: '85000',
  fees_paid: '1700000000000000',
};

export const noData: golemBaseIndexer.FullEntity = {
  key: 'z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3h2g1f0e9d8c7b6a5z4y3x2w1v0u9',
  data: undefined,
  data_size: undefined,
  status: 'EXPIRED' as golemBaseIndexer.EntityStatus,
  string_annotations: [],
  numeric_annotations: [],
  created_at_tx_hash: undefined,
  created_at_operation_index: undefined,
  created_at_block_number: undefined,
  created_at_timestamp: undefined,
  expires_at_block_number: '1500000',
  expires_at_timestamp: '2024-01-31T12:00:00Z',
  owner: undefined,
  gas_used: '18500',
  fees_paid: '370000000000000',
};
