import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const L2ConsensusData = dynamic(() => import('ui/pages/L2ConsensusData'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/consensus-data">
      <L2ConsensusData/>
    </PageNextJs>
  );
};

export default Page;
