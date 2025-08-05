const RPC_PREFERENCE_KEY = 'rpc_endpoint_preference';

export function getRpcPreference(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(RPC_PREFERENCE_KEY);
  } catch {
    return null;
  }
}

export function setRpcPreference(rpc: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(RPC_PREFERENCE_KEY, rpc);
  } catch {}
}

export function getPrioritizedRpcUrls(originalUrls: Array<string>): Array<string> {
  const preferredEndpoint = getRpcPreference();
  if (originalUrls.length <= 1 || !preferredEndpoint || !originalUrls.includes(preferredEndpoint)) {
    return originalUrls;
  }

  const filteredUrls = originalUrls.filter(url => url !== preferredEndpoint);
  return [ preferredEndpoint, ...filteredUrls ];
}
