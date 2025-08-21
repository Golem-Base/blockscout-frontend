import type { Feature } from './types';

import { getEnvValue } from '../utils';

const notice = getEnvValue('NEXT_PUBLIC_TOP_NOTICE_HTML');

const title = 'Top Notice';

const config: Feature<{ notice: string }> = (() => {
  if (notice) {
    return Object.freeze({
      title,
      isEnabled: true,
      notice,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
