import { chakra, Flex } from '@chakra-ui/react';
import React from 'react';

import type { EntityWithExpTimestamp } from '@golembase/l3-indexer-types';

import { route } from 'nextjs-routes';

import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TruncatedTextTooltip } from 'toolkit/components/truncation/TruncatedTextTooltip';
import IconSvg from 'ui/shared/IconSvg';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

import DetailedInfoTimestamp from './LongestLivedEntitiesExpirationTime';

type Props = {
  item: EntityWithExpTimestamp;
  isLoading?: boolean;
  rank: number;
};

const LongestLivedEntitiesListItem = ({
  item,
  isLoading,
  rank,
}: Props) => {

  return (
    <ListItemMobile>
      <Flex justifyContent="space-between" w="100%" gap={ 6 }>
        <Flex width="100%" alignItems="center" minWidth={ 0 }>
          <Skeleton
            loading={ isLoading }
            borderRadius="full"
            boxSize={ 5 }
            mr={ 2 }
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={ 0 }
          >
            <IconSvg name="docs" boxSize={ 5 } color="text.secondary"/>
          </Skeleton>

          <Skeleton loading={ isLoading } flex="1" minWidth={ 0 }>
            <Link
              href={ route({ pathname: '/entity/[key]', query: { key: item.key } }) }
              display="block"
              minWidth={ 0 }
              maxWidth="100%"
              overflow="hidden"
              whiteSpace="nowrap"
            >
              <TruncatedTextTooltip
                label={ item.key }
                interactive={ true }
              >
                <chakra.span
                  display="block"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  { item.key }
                </chakra.span>
              </TruncatedTextTooltip>
            </Link>
          </Skeleton>
        </Flex>

        <Skeleton loading={ isLoading } fontSize="sm" ml="auto" minW={ 6 } color="text.secondary">{ rank }</Skeleton>
      </Flex>

      <Skeleton loading={ isLoading } display="inline-block" maxW="100%">
        <DetailedInfoTimestamp
          iconDirection="left"
          timestamp={ item.expires_at_timestamp }
          isLoading={ isLoading }
        />
      </Skeleton>
    </ListItemMobile>
  );
};

export default React.memo(LongestLivedEntitiesListItem);
