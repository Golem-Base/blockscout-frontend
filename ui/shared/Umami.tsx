import Script from 'next/script';
import React from 'react';

import config from 'configs/app';

const feature = config.features.umami;

const Umami = () => {
  if (!feature.isEnabled) {
    return null;
  }

  const { src, id } = feature;

  return (
    <Script strategy="lazyOnload" src={ src } data-website-id={ id }/>
  );
};

export default React.memo(Umami);
