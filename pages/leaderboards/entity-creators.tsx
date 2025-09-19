import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const TopEntityCreators = dynamic(() => import('ui/pages/TopEntityCreators'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/leaderboards/entity-creators">
      <TopEntityCreators/>
    </PageNextJs>
  );
};

export default Page;
