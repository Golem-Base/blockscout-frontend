import type CspDev from 'csp-dev';

import config from 'configs/app';

const feature = config.features.umami;

export function umami(nonce?: string): CspDev.DirectiveDescriptor {
  if (!feature.isEnabled) {
    return {};
  }

  const { origin: scriptOrigin } = new URL(feature.src);
  const apiOrigin = feature.apiSrc;

  return {
    'connect-src': [
      scriptOrigin,
      apiOrigin,
    ],
    'script-src': [
      scriptOrigin,
      ...(nonce ? [ `'nonce-${ nonce }'` ] : []),
    ],
  };
}
