import { Flex } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import { Alert } from 'toolkit/chakra/alert';

const feature = config.features.topNotice;

const TopNotice = () => {
  if (!feature.isEnabled) {
    return null;
  }

  return (
    <Flex flexDir={{ base: 'column', lg: 'row' }} columnGap={ 2 } rowGap={ 1 } mt={ 3 } _empty={{ mt: 0 }}>
      <Alert showIcon={ true } title={
        <div dangerouslySetInnerHTML={{ __html: feature.notice }}></div>
      }/>
    </Flex>
  );
};

export default React.memo(TopNotice);
