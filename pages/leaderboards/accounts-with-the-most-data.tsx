import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const AccountsWithTheMostData = dynamic(() => import('ui/pages/AccountsWithTheMostData'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/leaderboards/accounts-with-the-most-data">
      <AccountsWithTheMostData/>
    </PageNextJs>
  );
};

export default Page;
