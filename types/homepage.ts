export const CHAIN_INDICATOR_IDS = [
  'daily_txs',
  'daily_operational_txs',
  'coin_price',
  'secondary_coin_price',
  'market_cap',
  'tvl',
  'data_usage',
  'operation_trends',
  'block_transactions',
] as const;

export type ChainIndicatorId = typeof CHAIN_INDICATOR_IDS[number];
export type ChainIndicatorIdWithNoBlockTransactions = Exclude<ChainIndicatorId, 'block_transactions'>;

export const HOME_STATS_WIDGET_IDS = [
  'latest_batch',
  'total_blocks',
  'average_block_time',
  'total_txs',
  'total_operational_txs',
  'latest_l1_state_batch',
  'wallet_addresses',
  'gas_tracker',
  'btc_locked',
  'current_epoch',
  'chain_id',
  'total_gas_used',
  'golembase_storage_limit',
  'golembase_used_slots',
  'golembase_active_entities_size',
  'golembase_active_entities_count',
  'golembase_total_operations',
  'golembase_unique_active_addresses',
  'golembase_total_entities_created',
  'golembase_entities_deleted',
  'golembase_entities_expired',
  'average_entity_size',
  'average_entity_btl',
  'unique_active_addresses',
] as const;
export type HomeStatsWidgetId = typeof HOME_STATS_WIDGET_IDS[number];

export interface HeroBannerButtonState {
  background?: Array<string | undefined>;
  text_color?: Array<string | undefined>;
}

export interface HeroBannerConfig {
  background?: Array<string | undefined>;
  text_color?: Array<string | undefined>;
  border?: Array<string | undefined>;
  button?: {
    _default?: HeroBannerButtonState;
    _hover?: HeroBannerButtonState;
    _selected?: HeroBannerButtonState;
  };
}
