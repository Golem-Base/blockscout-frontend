import type { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Route } from 'nextjs-routes';
import type { Props } from 'nextjs/getServerSideProps/handlers';
import * as gSSP from 'nextjs/getServerSideProps/main';
import PageNextJs from 'nextjs/PageNextJs';
import detectBotRequest from 'nextjs/utils/detectBotRequest';
import fetchApi from 'nextjs/utils/fetchApi';

import config from 'configs/app';
import { MultichainProvider } from 'lib/contexts/multichain';
import dayjs from 'lib/date/dayjs';
import type { ApiData } from 'lib/metadata';
import getQueryParamString from 'lib/router/getQueryParamString';
import type { GolemChartId } from 'ui/shared/chart/useGolemChartQuery';
import { getChartResourceName, golemChartIds } from 'ui/shared/chart/useGolemChartQuery';

const GolemChart = dynamic(() => import('ui/pages/GolemChart'), { ssr: false });
const StandardChart = dynamic(() => import('ui/pages/Chart'), { ssr: false });

const pathname: Route['pathname'] = '/stats/[id]';

interface PageProps extends Props<typeof pathname> {
  isGolemBaseChart?: boolean;
}

const Page: NextPage<PageProps> = (props) => {
  const ChartComponent = props.isGolemBaseChart ? GolemChart : StandardChart;

  return (
    <PageNextJs pathname={ pathname } query={ props.query } apiData={ props.apiData }>
      { config.features.opSuperchain.isEnabled ? (
        <MultichainProvider chainId={ getQueryParamString(props.query?.chain_id) }>
          <ChartComponent/>
        </MultichainProvider>
      ) : (
        <ChartComponent/>
      ) }
    </PageNextJs>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps<PageProps> = async(ctx) => {
  const baseResponse = await gSSP.base<typeof pathname>(ctx);

  if ('props' in baseResponse) {
    if (
      config.meta.seo.enhancedDataEnabled ||
      (config.meta.og.enhancedDataEnabled && detectBotRequest(ctx.req)?.type === 'social_preview')
    ) {
      const chartId = getQueryParamString(ctx.query.id);
      const isGolemBaseChart = golemChartIds.includes(chartId);

      const chartData = isGolemBaseChart ?
        await fetchApi({
          resource: getChartResourceName(chartId as GolemChartId)!,
          queryParams: { from: dayjs().format('YYYY-MM-DD'), to: dayjs().format('YYYY-MM-DD'), resolution: 'DAY' },
          timeout: 1000,
        }) :
        await fetchApi({
          resource: 'stats:line',
          pathParams: { id: chartId },
          queryParams: { from: dayjs().format('YYYY-MM-DD'), to: dayjs().format('YYYY-MM-DD') },
          timeout: 1000,
        });

      const props = await baseResponse.props;

      return {
        props: {
          ...props,
          apiData: chartData?.info as ApiData<typeof pathname> ?? null,
          isGolemBaseChart,
        },
      };
    }
  }

  return baseResponse;
};
