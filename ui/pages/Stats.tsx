import { Box, Flex, Grid } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useEtherscanRedirects from 'lib/router/useEtherscanRedirects';
import PageTitle from 'ui/shared/Page/PageTitle';
import BlockOperationsHistogramWidget from 'ui/stats/BlockOperationsWidget';

import DataSizeHistogramWidget from '../stats/DataSizeHistogramWidget';
import NumberWidgetsList from '../stats/NumberWidgetsList';
import { StatsBlockscout } from './StatsBlockscout';
import { StatsGolem } from './StatsGolem';

const Stats = () => {
  useEtherscanRedirects();

  return (
    <>
      <PageTitle
        title={ config.meta.seo.enhancedDataEnabled ? `${ config.chain.name } statistic & data` : `${ config.chain.name } stats` }
      />

      <Box mb={{ base: 6, sm: 8 }}>
        <NumberWidgetsList/>
      </Box>

      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} mb={{ base: 6, sm: 8 }} gap={ 4 } width="100%">
        <DataSizeHistogramWidget/>
        <BlockOperationsHistogramWidget/>
      </Grid>

      <Flex flexDirection="column" gap={ 16 }>
        <StatsGolem/>

        <StatsBlockscout/>
      </Flex>
    </>
  );
};

export default Stats;
