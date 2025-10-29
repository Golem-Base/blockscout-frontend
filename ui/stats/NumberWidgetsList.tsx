import { Grid } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { HOMEPAGE_STATS, STATS_COUNTER } from 'stubs/stats';
import StatsWidget from 'ui/shared/stats/StatsWidget';

import DataFetchAlert from '../shared/DataFetchAlert';

const UNITS_WITHOUT_SPACE = [ 's' ];

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

  const isPlaceholderData = countersQuery.isPlaceholderData || statsQuery.isPlaceholderData;
  const isError = countersQuery.isError || statsQuery.isError;

  if (isError) {
    return <DataFetchAlert/>;
  }

  return (
    <Grid
      gridTemplateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
      gridGap={{ base: 1, lg: 2 }}
    >
      {
        countersQuery.data?.counters?.map(({ id, title, value, units, description }, index) => {

          let unitsStr = '';
          if (units && UNITS_WITHOUT_SPACE.includes(units)) {
            unitsStr = units;
          } else if (units) {
            unitsStr = ' ' + units;
          }

          return (
            <StatsWidget
              key={ id + (isPlaceholderData ? index : '') }
              label={ title }
              value={ `${ Number(value).toLocaleString(undefined, { maximumFractionDigits: 3, notation: 'compact' }) }${ unitsStr }` }
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

      { statsQuery.data?.golembase_entities_deleted && (
        <StatsWidget
          label="Entities deleted"
          value={ BigNumber(statsQuery.data.golembase_entities_deleted).toFormat() }
          isLoading={ isPlaceholderData }
          hint="Total number of entities deleted"
        />
      ) }

      { statsQuery.data?.golembase_entities_expired && (
        <StatsWidget
          label="Entities expired"
          value={ BigNumber(statsQuery.data.golembase_entities_expired).toFormat() }
          isLoading={ isPlaceholderData }
          hint="Total number of entities expired"
        />
      ) }
    </Grid>
  );
};

export default NumberWidgetsList;
