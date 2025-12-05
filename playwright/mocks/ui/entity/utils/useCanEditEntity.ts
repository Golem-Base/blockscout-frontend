import type { FullEntity } from '@golembase/l3-indexer-types';

const TEST_WALLET_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

export function useCanEditEntity(entity?: Pick<FullEntity, 'key' | 'owner' | 'status'> | null): boolean {
  const isActive = entity && entity.status === 'ACTIVE';
  const isOwner = entity && entity.owner === TEST_WALLET_ADDRESS;

  return Boolean(isActive && isOwner);
}
