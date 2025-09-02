import { useAccount } from 'wagmi';

import type { FullEntity } from '@golembase/l3-indexer-types';

export function useCanEditEntity(entity?: Pick<FullEntity, 'key' | 'owner' | 'status'> | null): boolean {
  const { address } = useAccount();

  const isActive = entity && entity.status === 'ACTIVE';
  const isOwner = entity && entity.owner === address;

  return Boolean(isActive && isOwner);
}
