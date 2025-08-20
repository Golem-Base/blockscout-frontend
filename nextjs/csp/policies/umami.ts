import type CspDev from 'csp-dev';

import config from 'configs/app';

const feature = config.features.umami;

export function umami(): CspDev.DirectiveDescriptor {
  if (!feature.isEnabled) {
    return {};
  }

  const { origin } = new URL(feature.src);

  return {
    'connect-src': [
      origin,
    ],
    'script-src': [
      origin,
    ],
  };
}
