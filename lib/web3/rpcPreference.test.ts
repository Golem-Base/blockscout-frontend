import { describe, it, expect, vitest, beforeEach } from 'vitest';

import { getPrioritizedRpcUrls, getRpcPreference, setRpcPreference } from './rpcPreference';

const localStorageMock = {
  getItem: vitest.fn(),
  setItem: vitest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('rpcPreference', () => {
  beforeEach(() => {
    vitest.clearAllMocks();
  });

  describe('getRpcPreference', () => {
    it('should return null when window is undefined (SSR)', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const result = getRpcPreference();

      expect(result).toBeNull();
      global.window = originalWindow;
    });

    it('should return stored preference from localStorage', () => {
      const mockPreference = 'https://example.com/rpc';
      localStorageMock.getItem.mockReturnValue(mockPreference);

      const result = getRpcPreference();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('rpc_endpoint_preference');
      expect(result).toBe(mockPreference);
    });

    it('should return null when localStorage.getItem throws an error', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });

      const result = getRpcPreference();

      expect(result).toBeNull();
    });

    it('should return null when no preference is stored', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = getRpcPreference();

      expect(result).toBeNull();
    });
  });

  describe('setRpcPreference', () => {
    it('should store preference in localStorage', () => {
      const rpcUrl = 'https://example.com/rpc';

      setRpcPreference(rpcUrl);

      expect(localStorageMock.setItem).toHaveBeenCalledWith('rpc_endpoint_preference', rpcUrl);
    });

    it('should do nothing when window is undefined (SSR)', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      setRpcPreference('https://example.com/rpc');

      expect(localStorageMock.setItem).not.toHaveBeenCalled();
      global.window = originalWindow;
    });

    it('should handle localStorage.setItem throwing an error', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });

      expect(() => {
        setRpcPreference('https://example.com/rpc');
      }).not.toThrow();
    });
  });

  describe('getPrioritizedRpcUrls', () => {
    it('should return original URLs when no preference is set', () => {
      localStorageMock.getItem.mockReturnValue(null);
      const originalUrls = [ 'https://rpc1.com', 'https://rpc2.com', 'https://rpc3.com' ];

      const result = getPrioritizedRpcUrls(originalUrls);

      expect(result).toEqual(originalUrls);
    });

    it('should return original URLs when preference is not in the list', () => {
      localStorageMock.getItem.mockReturnValue('https://preferred.com');
      const originalUrls = [ 'https://rpc1.com', 'https://rpc2.com', 'https://rpc3.com' ];

      const result = getPrioritizedRpcUrls(originalUrls);

      expect(result).toEqual(originalUrls);
    });

    it('should prioritize preferred URL when it exists in the list', () => {
      localStorageMock.getItem.mockReturnValue('https://rpc2.com');
      const originalUrls = [ 'https://rpc1.com', 'https://rpc2.com', 'https://rpc3.com' ];

      const result = getPrioritizedRpcUrls(originalUrls);

      expect(result).toEqual([ 'https://rpc2.com', 'https://rpc1.com', 'https://rpc3.com' ]);
    });

    it('should handle empty array', () => {
      localStorageMock.getItem.mockReturnValue('https://rpc1.com');
      const originalUrls: Array<string> = [];

      const result = getPrioritizedRpcUrls(originalUrls);

      expect(result).toEqual([]);
    });
  });
});
