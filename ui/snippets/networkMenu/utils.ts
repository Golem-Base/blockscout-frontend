import type { useRouter } from 'next/router';

const dynamicRouteSlugRegex = /\[.+?\]/;
const slashEndOfStringRegex = /\/$/;

interface GetStaticNetworkPathAttributes {
  url: string;
  router: ReturnType<typeof useRouter>;
}

export const getStaticNetworkPath = ({ url, router }: GetStaticNetworkPathAttributes) => {
  const isDynamicRoute = dynamicRouteSlugRegex.test(router.pathname);
  const urlWithoutSlash = url.replace(slashEndOfStringRegex, '');
  const href = isDynamicRoute ? url : urlWithoutSlash + router.pathname;
  const searchParams = router.asPath.split('?')?.[1];
  const hrefWithSearchParams = [ href, searchParams ].filter(Boolean).join('?');

  return hrefWithSearchParams;
};
