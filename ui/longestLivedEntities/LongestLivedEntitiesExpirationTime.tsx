import { chakra, defineRecipe, useRecipe } from '@chakra-ui/react';
import React from 'react';

import dayjs from 'lib/date/dayjs';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  timestamp: string | number;
  isLoading?: boolean;
  iconDirection: 'right' | 'left';
};

const iconWrapperRecipe = defineRecipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '2',
  },
  variants: {
    iconDirection: {
      right: { flexDirection: 'row' },
      left: { flexDirection: 'row-reverse' },
    },
  },
});

const DetailedInfoTimestamp = ({ timestamp, isLoading, iconDirection }: Props) => {
  const recipe = useRecipe({ recipe: iconWrapperRecipe });
  const styles = recipe({ iconDirection });

  return (
    <Skeleton loading={ isLoading } cursor="pointer">
      <Tooltip content={ dayjs(timestamp).format('llll') }>
        <chakra.span css={ styles }>
          { dayjs(timestamp).fromNow() }
          <IconSvg name="clock" boxSize={ 4 } color="gray.500" isLoading={ isLoading }/>
        </chakra.span>
      </Tooltip>
    </Skeleton>
  );
};

export default DetailedInfoTimestamp;
