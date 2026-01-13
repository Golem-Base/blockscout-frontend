import type { AddressCounters } from 'types/api/address';

export const forAddress: AddressCounters = {
  gas_usage_count: '319340525',
  token_transfers_count: '420',
  transactions_count: '5462',
  validations_count: '0',
};

export const forContract: AddressCounters = {
  gas_usage_count: '319340525',
  token_transfers_count: '0',
  transactions_count: '5462',
  validations_count: '0',
  amount_spent_count: '345789248390',
};

export const forToken: AddressCounters = {
  gas_usage_count: '247479698',
  token_transfers_count: '1',
  transactions_count: '8474',
  validations_count: '0',
  amount_spent_count: '92938478890432890234',
};

export const forValidator: AddressCounters = {
  gas_usage_count: '91675762951',
  token_transfers_count: '0',
  transactions_count: '820802',
  validations_count: '1726416',
  amount_spent_count: '4567899834508903593209234123',
};
