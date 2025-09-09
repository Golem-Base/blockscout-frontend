import type { useRouter } from 'next/router';

import { getStaticNetworkPath } from './utils';

const mockRouter = (pathname: string, asPath: string) => ({
  pathname,
  asPath,
} as ReturnType<typeof useRouter>);

describe('function getStaticNetworkPath()', () => {
  describe('static routes', () => {
    it('should return URL with pathname and search params for static route', () => {
      const url = 'https://example.com';
      const router = mockRouter('/blocks', '/blocks?param=1');

      const result = getStaticNetworkPath({ url, router });

      expect(result).toBe('https://example.com/blocks?param=1');
    });

    it('should return URL with pathname without search params for static route', () => {
      const url = 'https://example.com';
      const router = mockRouter('/blocks', '/blocks');

      const result = getStaticNetworkPath({ url, router });

      expect(result).toBe('https://example.com/blocks');
    });

    it('should handle URL with trailing slash for static route', () => {
      const url = 'https://example.com/';
      const router = mockRouter('/blocks', '/blocks?param=1');

      const result = getStaticNetworkPath({ url, router });

      expect(result).toBe('https://example.com/blocks?param=1');
    });
  });

  describe('dynamic routes', () => {
    it('should return original URL with search params for dynamic route', () => {
      const url = 'https://example.com';
      const router = mockRouter('/blocks/[hash]', '/blocks/0x123?param=1');

      const result = getStaticNetworkPath({ url, router });

      expect(result).toBe('https://example.com');
    });

    it('should return original URL without search params for dynamic route', () => {
      const url = 'https://example.com';
      const router = mockRouter('/blocks/[hash]', '/blocks/0x123');

      const result = getStaticNetworkPath({ url, router });

      expect(result).toBe('https://example.com');
    });

    it('should handle URL with trailing slash for dynamic route', () => {
      const url = 'https://example.com/';
      const router = mockRouter('/blocks/[hash]', '/blocks/0x123?param=1');

      const result = getStaticNetworkPath({ url, router });

      expect(result).toBe('https://example.com/');
    });

    it('should handle multiple dynamic segments', () => {
      const url = 'https://example.com';
      const router = mockRouter('/blocks/[hash]/[tab]', '/blocks/0x123/details?param=1');

      const result = getStaticNetworkPath({ url, router });

      expect(result).toBe('https://example.com');
    });

    it('should handle catch-all dynamic routes', () => {
      const url = 'https://example.com';
      const router = mockRouter('/blocks/[...slug]', '/blocks/0x123/details?param=1');

      const result = getStaticNetworkPath({ url, router });

      expect(result).toBe('https://example.com');
    });

    it('should handle optional catch-all dynamic routes', () => {
      const url = 'https://example.com';
      const router = mockRouter('/blocks/[[...slug]]', '/blocks?param=1');

      const result = getStaticNetworkPath({ url, router });

      expect(result).toBe('https://example.com');
    });
  });

  describe('edge cases', () => {
    it('should handle empty search params', () => {
      const url = 'https://example.com';
      const router = mockRouter('/blocks', '/blocks?');

      const result = getStaticNetworkPath({ url, router });

      expect(result).toBe('https://example.com/blocks');
    });

    it('should handle complex search params', () => {
      const url = 'https://example.com';
      const router = mockRouter('/blocks', '/blocks?param=1&filter=active&sort=date');

      const result = getStaticNetworkPath({ url, router });

      expect(result).toBe('https://example.com/blocks?param=1&filter=active&sort=date');
    });

    it('should handle URL with query parameters', () => {
      const url = 'https://example.com?existing=param';
      const router = mockRouter('/blocks', '/blocks?param=1');

      const result = getStaticNetworkPath({ url, router });

      expect(result).toBe('https://example.com?existing=param/blocks?param=1');
    });

    it('should handle root pathname', () => {
      const url = 'https://example.com';
      const router = mockRouter('/', '/?param=1');

      const result = getStaticNetworkPath({ url, router });

      expect(result).toBe('https://example.com/?param=1');
    });

    it('should handle empty pathname', () => {
      const url = 'https://example.com';
      const router = mockRouter('', '/?param=1');

      const result = getStaticNetworkPath({ url, router });

      expect(result).toBe('https://example.com?param=1');
    });
  });

  describe('regex patterns', () => {
    it('should correctly identify dynamic routes with single bracket', () => {
      const url = 'https://example.com';
      const router = mockRouter('/blocks/[hash]', '/blocks/0x123');

      const result = getStaticNetworkPath({ url, router });

      expect(result).toBe('https://example.com');
    });

    it('should correctly identify dynamic routes with multiple brackets', () => {
      const url = 'https://example.com';
      const router = mockRouter('/blocks/[hash]/[tab]', '/blocks/0x123/details');

      const result = getStaticNetworkPath({ url, router });

      expect(result).toBe('https://example.com');
    });

    it('should not treat static routes as dynamic', () => {
      const url = 'https://example.com';
      const router = mockRouter('/blocks/hash', '/blocks/hash?param=1');

      const result = getStaticNetworkPath({ url, router });

      expect(result).toBe('https://example.com/blocks/hash?param=1');
    });
  });

  describe('page param', () => {
    it('should remove page param from search params', () => {
      const url = 'https://example.com';
      const router = mockRouter('/blocks', '/blocks?page=1');

      const result = getStaticNetworkPath({ url, router });

      expect(result).toBe('https://example.com/blocks');
    });

    it('should not remove page param from search params for dynamic route', () => {
      const url = 'https://example.com';
      const router = mockRouter('/blocks/[hash]', '/blocks/0x123?page=1');

      const result = getStaticNetworkPath({ url, router });

      expect(result).toBe('https://example.com');
    });
  });
});
