import { pascalCase } from 'es-toolkit';
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

  const pascalCaseStatus = pascalCase(status); // @FIXME: update once returned type is fixed

  let text: string;
  let type: StatusTagType;

  switch (pascalCaseStatus) {
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
