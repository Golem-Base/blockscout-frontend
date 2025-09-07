import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import { Tag } from 'toolkit/chakra/tag';

interface Props {
  name: string;
  value: string | Array<string> | undefined;
}

const EntityAnnotation = ({ name, value }: Props) => {

  return (
    <Tag size="lg">
      <Flex alignItems="center" gap={ 1 }>
        <Text fontWeight="normal" fontSize="xs">{ name }:</Text>
        <Text fontWeight="bold" fontSize="xs">{ value }</Text>
      </Flex>
    </Tag>
  );
};

export default EntityAnnotation;
