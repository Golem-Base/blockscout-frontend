import type { useRouter } from 'next/router';

const dynamicRouteSlugRegex = /\[.+?\]/;
const slashEndOfStringRegex = /\/$/;

interface GetStaticNetworkPathAttributes {
  url: string;
  router: ReturnType<typeof useRouter>;
}

const removePageParam = (searchParams?: string) => {
  if (!searchParams) {
    return undefined;
  }

  const params = new URLSearchParams(searchParams);
  params.delete('page');
  return params.toString();
};

export const getStaticNetworkPath = ({ url, router }: GetStaticNetworkPathAttributes) => {
  const isDynamicRoute = dynamicRouteSlugRegex.test(router.pathname);
  const urlWithoutSlash = url.replace(slashEndOfStringRegex, '');
  const href = isDynamicRoute ? url : urlWithoutSlash + router.pathname;
  const searchParams = router.asPath.split('?')?.[1];
  const searchParamsWithoutPage = removePageParam(searchParams);
  const searchParamsToTransport = isDynamicRoute ? '' : searchParamsWithoutPage;
  const hrefWithSearchParams = [ href, searchParamsToTransport ].filter(Boolean).join('?');

  return hrefWithSearchParams;
};
