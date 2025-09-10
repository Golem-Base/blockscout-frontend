import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const EffectivelyLargestEntities = dynamic(() => import('ui/pages/EffectivelyLargestEntities'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/leaderboards/effectively-largest-entities">
      <EffectivelyLargestEntities/>
    </PageNextJs>
  );
};

export default Page;
