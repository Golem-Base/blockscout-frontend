import type { Feature } from './types';

import { getEnvValue } from '../utils';

const src = getEnvValue('NEXT_PUBLIC_UMAMI_SCRIPT_SRC');
const apiSrc = getEnvValue('NEXT_PUBLIC_UMAMI_API_SRC');
const id = getEnvValue('NEXT_PUBLIC_UMAMI_WEBSITE_ID');

const title = 'Umami analytics';

const config: Feature<{ src: string; id: string; apiSrc: string }> = (() => {
  if (id && src && apiSrc) {
    return Object.freeze({
      title,
      isEnabled: true,
      id,
      src,
      apiSrc,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
