import { Box } from '@chakra-ui/react';
import React from 'react';

import type { Operation } from '@golembase/l3-indexer-types';
import type { PaginationParams } from 'ui/shared/pagination/types';

import useIsMobile from 'lib/hooks/useIsMobile';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';

import OpsHeaderMobile from './EntityOpsHeaderMobile';
import EntityOpsList from './EntityOpsList';
import EntityOpsTable from './EntityOpsTable';

type Props = {
  pagination: PaginationParams;
  top?: number;
  items?: Array<Operation>;
  isPlaceholderData: boolean;
  isError: boolean;
};

const EntityOpsContent = ({
  pagination,
  top,
  items,
  isPlaceholderData,
  isError,
}: Props) => {
  const isMobile = useIsMobile();

  const content = items ? (
    <>
      <Box hideFrom="lg">
        <EntityOpsList
          isLoading={ isPlaceholderData }
          items={ items }
        />
      </Box>
      <Box hideBelow="lg">
        <EntityOpsTable
          operations={ items }
          top={ top || (pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0) }
          isLoading={ isPlaceholderData }
        />
      </Box>
    </>
  ) : null;

  const actionBar = isMobile ? (
    <OpsHeaderMobile
      mt={ -6 }
      paginationProps={ pagination }
      showPagination={ pagination.isVisible }
    />
  ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      itemsNum={ items?.length }
      emptyText="There are no operations."
      actionBar={ actionBar }
    >
      { content }
    </DataListDisplay>
  );
};

export default EntityOpsContent;
