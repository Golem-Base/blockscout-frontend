import dynamic from 'next/dynamic';
import React from 'react';

import type { NextPageWithLayout } from 'nextjs/types';

import type { Props } from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';

import LayoutSearchResults from 'ui/shared/layout/LayoutSearchResults';

const EntitySearchResults = dynamic(() => import('ui/pages/SearchResultsEntity'), { ssr: false });

const Page: NextPageWithLayout<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/entity/search-results" query={ props.query }>
      <EntitySearchResults/>
    </PageNextJs>
  );
};

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <LayoutSearchResults>
      { page }
    </LayoutSearchResults>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps';
