import React from 'react';

import type { EntityStatus as EntityStatusEnum } from '@blockscout/golem-base-indexer-types';

import type { StatusTagType } from './StatusTag';
import StatusTag from './StatusTag';

export interface Props {
  status: EntityStatusEnum;
  isLoading?: boolean;
}

const EntityStatus = ({ status, isLoading }: Props) => {
  if (!status) {
    return null;
  }

  let text: string;
  let type: StatusTagType;

  switch (status) {
    case 'Active':
      text = 'Active';
      type = 'ok';
      break;
    case 'Expired':
      text = 'Expired';
      type = 'pending';
      break;
    case 'Deleted':
      text = 'Deleted';
      type = 'error';
      break;
    default:
      text = status;
      type = 'pending';
      break;
  }

  return <StatusTag type={ type } text={ text } loading={ isLoading }/>;
};

export default EntityStatus;
