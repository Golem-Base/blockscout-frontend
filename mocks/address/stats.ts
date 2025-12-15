import type { AddressStatsResponse } from '@golembase/l3-indexer-types';

export const statsResponse: AddressStatsResponse = {
  created_entities: '120',
  active_entities: '50',
  size_of_active_entities: '100234',
  total_transactions: '156',
  failed_transactions: '5',
  operations_counts: {
    create_count: '120',
    update_count: '21',
    delete_count: '9',
    extend_count: '1',
    changeowner_count: '0',
  },
  first_seen_block: '12',
  first_seen_timestamp: '2024-01-11T10:30:00Z',
  last_seen_block: '32',
  last_seen_timestamp: '2024-01-14T10:30:00Z',
  owned_entities: '3',
};
