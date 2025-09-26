import type { Transaction } from '@golembase/l3-indexer-types';

export const CUSTOM_CONTRACT_TX: Transaction = {
  hash: '0x2b824349b320cfa72f292ab26bf525adb00083ba9fa097141896c3c8c74567cc',
  from_address_hash: '0x1234567890123456789012345678901234567890',
  to_address_hash: '0x0987654321098765432109876543210987654321',
  status: 'success',
  block_hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  block_number: '9004925',
  block_consensus: true,
  index: '0',
  cumulative_gas_used: '21000',
  gas_price: '100000000000',
  block_timestamp: '2022-11-11T11:11:11.000000Z',
  error: undefined,
  value: '42000420000000000000',
  input: '0x',
  created_contract_address_hash: undefined,
  type: '0',
  l1_transaction_origin: undefined,
  l1_block_number: undefined,
};
