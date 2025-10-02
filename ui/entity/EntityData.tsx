import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import type { EntityQuery } from './utils/types';

import { route } from 'nextjs-routes';

import formatDataSize from 'lib/formatDataSize';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Container, ItemDivider, ItemLabel, ItemValue } from 'ui/shared/DetailedInfo/DetailedInfo';
import RawInputData from 'ui/shared/RawInputData';

import EntityAnnotation from './EntityAnnotation';

interface Props {
  entityQuery: EntityQuery;
}

interface OptionalLinkProps {
  clickable: boolean;
  href: string;
  children: React.ReactNode;
}

const OptionalLink = ({ clickable, href, children }: OptionalLinkProps) => {
  if (!clickable) return children;

  return <Link href={ href }>{ children }</Link>;
};

const EntityData = ({ entityQuery }: Props) => {
  const { data, isPlaceholderData: isLoading } = entityQuery;

  if (!data) {
    return null;
  }

  const annotations = [
    ...data.string_annotations.map((annotation) => ({ ...annotation, type: 'string' })),
    ...data.numeric_annotations.map((annotation) => ({ ...annotation, type: 'numeric' })),
  ];

  return (
    <Container data-testid="entity-data">
      <ItemLabel hint="Raw data content of this entity">Entity Data</ItemLabel>
      <ItemValue>
        {
          data.data ? (
            <RawInputData
              hex={ data.data }
              isLoading={ isLoading }
              defaultDataType="UTF-8"
              rich
            />
          ) :
            'No data'
        }
      </ItemValue>

      <ItemLabel hint="Size of the stored data">Size</ItemLabel>
      <ItemValue>
        <Skeleton loading={ isLoading }>
          <Text>
            { data.data_size ? formatDataSize(data.data_size) : '0 B' }
          </Text>
        </Skeleton>
      </ItemValue>

      { annotations.length > 0 && (
        <>
          <ItemDivider/>
          <ItemLabel hint="Key-Value annotations attached to this entity">Annotations</ItemLabel>
          <ItemValue>
            <Skeleton loading={ isLoading }>
              <Flex flexWrap="wrap" gap={ 2 }>
                { annotations.map((annotation, index) => {
                  const keyQueryName = `${ annotation.type }_annotation_key`;
                  const valueQueryName = `${ annotation.type }_annotation_value`;
                  const relatedEntitiesNumber = Number(annotation.related_entities);

                  return (
                    <OptionalLink
                      key={ index }
                      clickable={ relatedEntitiesNumber !== 0 }
                      href={ route({ pathname: '/entity', query: { [keyQueryName]: annotation.key, [valueQueryName]: annotation.value } }) }
                    >
                      <Flex alignItems="center" gap={ 1 }>
                        <EntityAnnotation key={ index } name={ annotation.key } value={ annotation.value }/>

                        { Boolean(relatedEntitiesNumber) && <Text fontWeight="normal" fontSize="xs">(related: { relatedEntitiesNumber })</Text> }
                      </Flex>
                    </OptionalLink>
                  );
                }) }
              </Flex>
            </Skeleton>
          </ItemValue>
        </>
      ) }
    </Container>
  );
};

export default EntityData;
