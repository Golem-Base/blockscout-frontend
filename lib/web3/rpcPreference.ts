const RPC_PREFERENCE_KEY = 'rpc_endpoint_preference';

function wrap<T>(fn: () => T): T | void {
  if (typeof window === 'undefined') return;
  try {
    return fn();
  } catch {}
}

export function getRpcPreference(): string | null {
  return wrap(() => localStorage.getItem(RPC_PREFERENCE_KEY)) ?? null;
}

export function setRpcPreference(rpc: string): void {
  wrap(() => localStorage.setItem(RPC_PREFERENCE_KEY, rpc));
}

export function clearRpcPreference(): void {
  wrap(() => localStorage.removeItem(RPC_PREFERENCE_KEY));
}

export function getPrioritizedRpcUrls(originalUrls: Array<string>): Array<string> {
  const preferredEndpoint = getRpcPreference();
  if (originalUrls.length <= 1 || !preferredEndpoint) {
    return originalUrls;
  }

  if (!originalUrls.includes(preferredEndpoint)) {
    return originalUrls;
  }

  const filteredUrls = originalUrls.filter(url => url !== preferredEndpoint);
  return [ preferredEndpoint, ...filteredUrls ];
}
