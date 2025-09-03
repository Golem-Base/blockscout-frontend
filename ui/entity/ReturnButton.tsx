import { useRouter } from 'next/router';
import React from 'react';

import { route } from 'nextjs-routes';

import { useAppContext } from 'lib/contexts/app';
import getQueryParamString from 'lib/router/getQueryParamString';

import ButtonLink from '../shared/ButtonLink';

interface Props {
  isEdit?: boolean;
  disabled?: boolean;
}

const ReturnButton = ({ isEdit = false, disabled = false }: Props) => {
  const router = useRouter();
  const appProps = useAppContext();
  const key = getQueryParamString(router.query.key);

  const returnUrl = React.useMemo(() => {
    if (appProps.referrer) {
      return appProps.referrer;
    }

    if (isEdit && key) {
      return route({ pathname: '/entity/[key]' as const, query: { key } });
    }

    return '/';
  }, [ isEdit, key, appProps.referrer ]);

  return (
    <ButtonLink href={ returnUrl } disabled={ disabled } variant="outline" size="lg">
      Cancel
    </ButtonLink>
  );
};

export default ReturnButton;
