import { useRouter } from 'next/router';
import React from 'react';

import getQueryParamString from 'lib/router/getQueryParamString';
import EntityOps from 'ui/entityOps/EntityOps';

type Props = {
  shouldRender?: boolean;
  isQueryEnabled?: boolean;
};

const AddressEntityOps = ({ shouldRender = true, isQueryEnabled = true }: Props) => {
  const router = useRouter();
  const currentAddress = getQueryParamString(router.query.hash);

  if (!shouldRender) {
    return null;
  }

  return (
    <EntityOps
      isQueryEnabled={ isQueryEnabled && Boolean(currentAddress) }
      queryParams={{ sender: currentAddress }}
    />
  );
};

export default AddressEntityOps;
