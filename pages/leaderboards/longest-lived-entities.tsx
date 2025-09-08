import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const LongestLivedEntities = dynamic(() => import('ui/pages/LongestLivedEntities'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/leaderboards/longest-lived-entities">
      <LongestLivedEntities/>
    </PageNextJs>
  );
};

export default Page;
