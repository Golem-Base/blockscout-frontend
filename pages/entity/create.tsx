import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';

const EntityCreate = dynamic(() => import('ui/pages/EntityCreate'), { ssr: false });

const Page: NextPage<Props> = () => {
  return (
    <PageNextJs pathname="/entity/create">
      <EntityCreate/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps';
