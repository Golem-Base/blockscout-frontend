import { Grid } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { isNil } from 'es-toolkit/compat';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import formatDataSize from 'lib/formatDataSize';
import { HOMEPAGE_STATS, HOMEPAGE_STATS_MICROSERVICE, STATS_COUNTER } from 'stubs/stats';
import StatsWidget from 'ui/shared/stats/StatsWidget';

import DataFetchAlert from '../shared/DataFetchAlert';

const UNITS_WITHOUT_SPACE = [ 's' ];

const isStatsFeatureEnabled = config.features.stats.isEnabled;

const NumberWidgetsList = () => {
  const countersQuery = useApiQuery('stats:counters', {
    queryOptions: {
      placeholderData: { counters: Array(10).fill(STATS_COUNTER) },
    },
  });

  const statsQuery = useApiQuery('general:stats', {
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
    },
  });

  const statsMicroserviceQuery = useApiQuery('stats:pages_main', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: isStatsFeatureEnabled ? HOMEPAGE_STATS_MICROSERVICE : undefined,
      enabled: isStatsFeatureEnabled,
    },
  });

  const isPlaceholderData = countersQuery.isPlaceholderData || statsQuery.isPlaceholderData || statsMicroserviceQuery.isPlaceholderData;
  const isError = countersQuery.isError || statsQuery.isError || statsMicroserviceQuery.isError;

  if (isError) {
    return <DataFetchAlert/>;
  }

  return (
    <Grid
      gridTemplateColumns={{ base: 'repeat(2, 50%)', lg: 'repeat(4, 25%)' }}
      gridGap={{ base: 1, lg: 2 }}
    >
      <StatsWidget
        label="Chain ID"
        value={ config.chain.id }
        isLoading={ isPlaceholderData }
      />

      {
        countersQuery.data?.counters?.map(({ id, title, value, units, description }, index) => {

          let unitsStr = '';
          if (units && UNITS_WITHOUT_SPACE.includes(units)) {
            unitsStr = units;
          } else if (units) {
            unitsStr = ' ' + units;
          }

          const valueNum = Number(value);
          const maximumFractionDigits = valueNum < 10 ** -3 ? undefined : 3;

          return (
            <StatsWidget
              key={ id + (isPlaceholderData ? index : '') }
              label={ title }
              value={ Number(value).toLocaleString(undefined, { maximumFractionDigits, notation: 'compact' }) }
              valuePostfix={ unitsStr }
              isLoading={ isPlaceholderData }
              hint={ description }
            />
          );
        })
      }

      { statsQuery.data?.golembase_total_operations && (
        <StatsWidget
          label="Total operations"
          value={ BigNumber(statsQuery.data.golembase_total_operations).toFormat() }
          isLoading={ isPlaceholderData }
          hint="Total number of operations, including Created, Updated, Deleted, and Extended"
        />
      ) }

      { statsQuery.data?.golembase_unique_active_addresses && (
        <StatsWidget
          label="Unique active addresses"
          value={ BigNumber(statsQuery.data.golembase_unique_active_addresses).toFormat() }
          isLoading={ isPlaceholderData }
          hint="Represents the number of distinct addresses that currently own at least one active entity."
        />
      ) }

      { statsQuery.data?.golembase_total_entities_created && (
        <StatsWidget
          label="Total entities created"
          value={ BigNumber(statsQuery.data.golembase_total_entities_created).toFormat() }
          isLoading={ isPlaceholderData }
          hint="Total number of entities created"
        />
      ) }

      { !isNil(statsQuery.data?.golembase_entities_deleted) && (
        <StatsWidget
          label="Entities deleted"
          value={ BigNumber(statsQuery.data.golembase_entities_deleted).toFormat() }
          isLoading={ isPlaceholderData }
          hint="Total number of entities deleted"
        />
      ) }

      { !isNil(statsQuery.data?.golembase_entities_expired) && (
        <StatsWidget
          label="Entities expired"
          value={ BigNumber(statsQuery.data.golembase_entities_expired).toFormat() }
          isLoading={ isPlaceholderData }
          hint="Total number of entities expired"
        />
      ) }

      { statsQuery.data?.golembase_storage_limit && (
        <StatsWidget
          label="Storage limit"
          value={ formatDataSize(statsQuery.data?.golembase_storage_limit) }
          isLoading={ isPlaceholderData }
          hint="Total storage limit of the network"
        />
      ) }

      { (statsMicroserviceQuery.data?.average_block_time || statsQuery.data?.average_block_time) && (
        <StatsWidget
          label={ statsMicroserviceQuery.data?.average_block_time?.title || 'Average block time' }
          value={ `${
            statsMicroserviceQuery.data?.average_block_time ?
              Number(statsMicroserviceQuery.data.average_block_time.value).toFixed(1) :
              (statsQuery.data!.average_block_time / 1000).toFixed(1)
          }s` }
          isLoading={ isPlaceholderData }
        />
      ) }
    </Grid>
  );
};

export default NumberWidgetsList;
