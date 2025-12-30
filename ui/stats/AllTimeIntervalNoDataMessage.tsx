import { Text } from '@chakra-ui/react';
import React from 'react';

const AllTimeIntervalNoDataMessage = () => {
  return (
    <Text
      color="text.secondary"
      fontSize="sm"
      textAlign="center"
    >
      Projection is not available for <b>All time</b> range.<br/>Please, select limited interval option.
    </Text>
  );
};

export default AllTimeIntervalNoDataMessage;
