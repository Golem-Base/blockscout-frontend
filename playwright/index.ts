import './fonts.css';
import './index.css';
import '../nextjs/global.css';
import { beforeMount } from '@playwright/experimental-ct-react/hooks';
import MockDate from 'mockdate';
import * as router from 'next/router';

const NEXT_ROUTER_MOCK = {
  query: {},
  pathname: '',
  push: () => Promise.resolve(),
  replace: () => Promise.resolve(),
};

beforeMount(async({ hooksConfig }: { hooksConfig?: { router: typeof router } }) => {
  // Before mount, redefine useRouter to return mock value from test.

  // Use Object.defineProperty to work around ESM read-only import restrictions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Object.defineProperty(router as any, 'useRouter', {
    value: () => ({
      ...NEXT_ROUTER_MOCK,
      ...hooksConfig?.router,
    }),
    writable: true,
    configurable: true,
  });

  // set current date
  MockDate.set('2022-11-11T12:00:00Z');
});

export {};
