import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { PaginationParams } from 'ui/shared/pagination/types';

import ActionBar from 'ui/shared/ActionBar';
import Pagination from 'ui/shared/pagination/Pagination';

interface Props {
  paginationProps: PaginationParams;
  showPagination: boolean;
}

const EntityOpsHeaderMobile = ({
  paginationProps,
  showPagination,
}: Props) => {
  return (
    <ActionBar>
      { showPagination && (
        <Pagination { ...paginationProps }/>
      ) }
    </ActionBar>
  );
};

export default chakra(EntityOpsHeaderMobile);
