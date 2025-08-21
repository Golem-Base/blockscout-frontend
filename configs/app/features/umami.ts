import type { Feature } from './types';

import { getEnvValue } from '../utils';

const src = getEnvValue('NEXT_PUBLIC_UMAMI_SCRIPT_SRC');
const id = getEnvValue('NEXT_PUBLIC_UMAMI_WEBSITE_ID');

const title = 'Umami analytics';

const config: Feature<{ src: string; id: string }> = (() => {
  if (id && src) {
    return Object.freeze({
      title,
      isEnabled: true,
      id,
      src,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
