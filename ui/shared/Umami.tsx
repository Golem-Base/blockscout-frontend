import Script from 'next/script';
import React from 'react';

import config from 'configs/app';

const feature = config.features.umami;

const Umami = () => {
  // Read nonce from meta tag
  const [ nonce, setNonce ] = React.useState<string | undefined>();

  React.useEffect(() => {
    const metaTag = document.querySelector('meta[name="csp-nonce"]');
    setNonce(metaTag?.getAttribute('content') || undefined);
  }, []);

  if (!feature.isEnabled) {
    return null;
  }

  const { src, id } = feature;

  return (
    <Script strategy="lazyOnload" src={ src } data-website-id={ id } nonce={ nonce }/>
  );
};

export default React.memo(Umami);
