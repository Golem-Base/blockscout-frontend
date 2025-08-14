import React from 'react';

import type { EntityStatus as EntityStatusEnum } from '@golembase/l3-indexer-types';

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
    case 'ACTIVE':
      text = 'Active';
      type = 'ok';
      break;
    case 'EXPIRED':
      text = 'Expired';
      type = 'pending';
      break;
    case 'DELETED':
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
