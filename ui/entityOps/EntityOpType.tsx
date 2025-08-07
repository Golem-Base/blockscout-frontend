import React from 'react';

import { OperationType } from '@golembase/l3-indexer-types';

import type { BadgeProps } from 'toolkit/chakra/badge';
import { Badge } from 'toolkit/chakra/badge';

interface Props {
  operation: OperationType;
  isLoading?: boolean;
}

const EntityOpType = ({ operation, isLoading }: Props) => {
  let label: string;
  let colorPalette: BadgeProps['colorPalette'];

  switch (operation) {
    case OperationType.CREATE:
      label = 'Create';
      colorPalette = 'green';
      break;
    case OperationType.UPDATE:
      label = 'Update';
      colorPalette = 'blue';
      break;
    case OperationType.EXTEND:
      label = 'Extend';
      colorPalette = 'purple';
      break;
    case OperationType.DELETE:
      label = 'Delete';
      colorPalette = 'red';
      break;
    case OperationType.UNRECOGNIZED:
    default:
      label = 'Unrecognized';
      colorPalette = 'gray';
      break;
  }

  return (
    <Badge colorPalette={ colorPalette } loading={ isLoading }>
      { label }
    </Badge>
  );
};

export default EntityOpType;
