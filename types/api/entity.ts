export interface EntityAnnotation {
  key: string;
  value: string;
}

export interface EntityNumericAnnotation {
  key: string;
  value: string;
}

export interface Entity {
  key: string;
  data: string;
  data_size: string;
  status: 'ACTIVE' | 'EXPIRED' | 'DELETED';
  string_annotations: Array<EntityAnnotation>;
  numeric_annotations: Array<EntityNumericAnnotation>;
  created_at_tx_hash: string;
  created_at_operation_index: string;
  created_at_block_number: string;
  created_at_timestamp: string;
  expires_at_block_number: string;
  expires_at_timestamp: string;
  owner: string;
  gas_used: string;
  fees_paid: string;
}
