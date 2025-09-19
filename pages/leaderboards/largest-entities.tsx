import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const LargestEntities = dynamic(() => import('ui/pages/LargestEntities'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/leaderboards/largest-entities">
      <LargestEntities/>
    </PageNextJs>
  );
};

export default Page;
