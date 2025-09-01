import dynamic from 'next/dynamic';
import React from 'react';

import type { NextPageWithLayout } from 'nextjs/types';

import type { Props } from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';

import LayoutSearchResults from 'ui/shared/layout/LayoutSearchResults';

const SearchEntity = dynamic(() => import('ui/pages/SearchEntity'), { ssr: false });

const Page: NextPageWithLayout<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/entity/search" query={ props.query }>
      <SearchEntity/>
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
