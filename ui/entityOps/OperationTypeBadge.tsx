import React from 'react';

import type { BadgeProps } from 'toolkit/chakra/badge';
import { Badge } from 'toolkit/chakra/badge';
import { Skeleton } from 'toolkit/chakra/skeleton';

type Props = {
  operation: string;
  isLoading?: boolean;
};

const getOperationColor = (operation: string): BadgeProps['colorPalette'] => {
  switch (operation) {
    case 'CREATE':
      return 'green';
    case 'UPDATE':
      return 'blue';
    case 'DELETE':
      return 'red';
    case 'EXTEND':
      return 'purple';
    default:
      return 'gray';
  }
};

const OperationTypeBadge = ({ operation, isLoading }: Props) => {
  return (
    <Skeleton loading={ isLoading }>
      <Badge colorPalette={ getOperationColor(operation) } fontSize="xs">
        { operation }
      </Badge>
    </Skeleton>
  );
};

export default OperationTypeBadge;
