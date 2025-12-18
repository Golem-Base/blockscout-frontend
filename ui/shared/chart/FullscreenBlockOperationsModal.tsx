import { Grid, Text } from '@chakra-ui/react';
import React from 'react';

import { Button } from 'toolkit/chakra/button';
import { DialogBody, DialogContent, DialogHeader, DialogRoot } from 'toolkit/chakra/dialog';
import { Heading } from 'toolkit/chakra/heading';
import IconSvg from 'ui/shared/IconSvg';

import type { Item } from './BlockOperationsChart';
import BlockOperationsChart from './BlockOperationsChart';
import type { OperationTypeCount } from './BlockOperationsChartBar';

type Props = {
  open: boolean;
  onOpenChange: ({ open }: { open: boolean }) => void;
  title: string;
  description?: string;
  items: Array<Item>;
  visibleOperations: Array<OperationTypeCount>;
  zoomRange?: [ Date, Date ];
  handleZoomReset: () => void;
};

const FullscreenBlockOperationsModal = ({
  open,
  onOpenChange,
  title,
  description,
  items,
  visibleOperations,
  zoomRange,
  handleZoomReset,
}: Props) => {
  return (
    <DialogRoot
      open={ open }
      onOpenChange={ onOpenChange }
      size="cover"
    >
      <DialogContent>
        <DialogHeader/>
        <DialogBody pt={ 6 } display="flex" flexDir="column">
          <Grid gridColumnGap={ 2 } mb={ 4 }>
            <Heading mb={ 1 } level="2">
              { title }
            </Heading>

            { description && (
              <Text
                gridColumn={ 1 }
                color="text.secondary"
                textStyle="sm"
              >
                { description }
              </Text>
            ) }

            { Boolean(zoomRange) && (
              <Button
                gridColumn={ 2 }
                justifySelf="end"
                alignSelf="top"
                gridRow="1/3"
                size="sm"
                variant="outline"
                onClick={ handleZoomReset }
              >
                <IconSvg name="repeat" w={ 4 } h={ 4 }/>
                Reset zoom
              </Button>
            ) }
          </Grid>
          <BlockOperationsChart items={ items } visibleOperations={ visibleOperations } height={ 500 }/>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default FullscreenBlockOperationsModal;
