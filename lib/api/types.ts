export type ApiName = 'general' | 'admin' | 'bens' | 'contractInfo' | 'golemBaseIndexer' |
  'metadata' | 'multichain' | 'rewards' | 'stats' | 'tac' | 'visualize';

export interface ApiResource {
  path: string;
  pathParams?: Array<string>;
  filterFields?: Array<string>;
  paginated?: boolean;
  headers?: RequestInit['headers'];
}
