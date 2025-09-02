import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const BiggestSpenders = dynamic(() => import('ui/pages/BiggestSpenders'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/leaderboards/spenders">
      <BiggestSpenders/>
    </PageNextJs>
  );
};

export default Page;
