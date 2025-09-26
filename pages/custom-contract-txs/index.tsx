import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const CustomContractTxs = dynamic(() => import('ui/pages/CustomContractTxs'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/custom-contract-txs">
      <CustomContractTxs/>
    </PageNextJs>
  );
};

export default Page;
