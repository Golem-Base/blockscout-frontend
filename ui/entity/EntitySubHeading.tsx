import { Box } from '@chakra-ui/react';
import React from 'react';

import StorageEntity from 'ui/shared/entities/entity/StorageEntity';

type Props = {
  entityKey: string;
};

const EntitySubHeading = ({ entityKey }: Props) => {
  return (
    <Box display="flex" alignItems="center" w="100%">
      <StorageEntity
        entityKey={ entityKey }
        noLink
        noCopy={ false }
        variant="subheading"
      />
    </Box>
  );
};

export default EntitySubHeading;
