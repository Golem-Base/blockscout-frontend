import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const TopEntityOwners = dynamic(() => import('ui/pages/TopEntityOwners'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/leaderboards/owners">
      <TopEntityOwners/>
    </PageNextJs>
  );
};

export default Page;
