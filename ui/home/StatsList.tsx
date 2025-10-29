import { Grid } from '@chakra-ui/react';
import React from 'react';

import StatsWidget from 'ui/shared/stats/StatsWidget';

import type { Item } from './Stats';

interface Props {
  items: Array<Item>;
  isLoading: boolean;
}

const StatsList = ({ items, isLoading }: Props) => {
  return (
    <Grid
      gridTemplateColumns="1fr 1fr"
      gridGap={{ base: 1, lg: 2 }}
      flexBasis="50%"
      flexGrow={ 1 }
    >
      { items.map((item, index) => (
        <StatsWidget
          key={ item.id }
          { ...item }
          isLoading={ isLoading }
          _last={ items.length % 2 === 1 && index === items.length - 1 ? { gridColumn: 'span 2' } : undefined }/>
      ),
      ) }
    </Grid>
  );
};

export default StatsList;
