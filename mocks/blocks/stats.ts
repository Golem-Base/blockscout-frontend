import type { BlockStatsResponse } from '@golembase/l3-indexer-types';

export const statsResponse: BlockStatsResponse = {
  counts: {
    create_count: '210',
    update_count: '12',
    expire_count: '502',
    delete_count: '8',
    extend_count: '51',
    changeowner_count: '0',
  },
  storage: {
    block_bytes: '190000',
    total_bytes: '1230000000',
  },
  consensus: {
    status: 'safe',
    expected_safe_at_timestamp: '2026-01-07T10:30:00Z',
  },
};
