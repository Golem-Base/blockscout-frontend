import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import type { EntityQuery } from './utils/types';
import { type NumericAnnotation, type StringAnnotation } from '@golembase/l3-indexer-types';

import formatDataSize from 'lib/formatDataSize';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tag } from 'toolkit/chakra/tag';
import { Container, ItemDivider, ItemLabel, ItemValue } from 'ui/shared/DetailedInfo/DetailedInfo';
import RawInputData from 'ui/shared/RawInputData';

import useEntityRelatedCountQuery from './useEntityRelatedCountQuery';

interface Props {
  entityQuery: EntityQuery;
}

const EntityData = ({ entityQuery }: Props) => {
  const { data, isPlaceholderData: isLoading, isFetched } = entityQuery;

  const { data: entitiesCountQuery, isPlaceholderData: isLoadingEntitiesCount } = useEntityRelatedCountQuery(isFetched, data);

  if (!data) {
    return null;
  }

  const annotations = [ ...data.string_annotations, ...data.numeric_annotations ];

  const getAnnotationQueryParams = (annotation: StringAnnotation | NumericAnnotation, annotationsType: 'string' | 'numeric') => {
    return Object.entries(annotation).map(([ key, value ]) => {
      const paramName = encodeURIComponent(`${ annotationsType }_annotation_${ key }`);
      const paramValue = encodeURIComponent(String(value));

      return `${ paramName }=${ paramValue }`;
    }).join('&');
  };

  const stringAnnotationsQuery = data.string_annotations.map((annotation) => getAnnotationQueryParams(annotation, 'string'));
  const numericAnnotationsQuery = data.numeric_annotations.map((annotation) => getAnnotationQueryParams(annotation, 'numeric'));

  const annotationsQuery = [ ...stringAnnotationsQuery, ...numericAnnotationsQuery ]
    .filter(Boolean)
    .join('&');

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
            {
              data.data_size ?
                formatDataSize(data.data_size) :
                '0 B'
            }
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
                { annotations.map((annotation, index) => (
                  <Tag key={ index } size="lg">
                    <Flex alignItems="center" gap={ 1 }>
                      <Text fontWeight="normal" fontSize="xs">{ annotation.key }:</Text>
                      <Text fontWeight="bold" fontSize="xs">{ annotation.value }</Text>
                    </Flex>
                  </Tag>
                )) }
              </Flex>
            </Skeleton>
          </ItemValue>
        </>
      ) }

      { annotationsQuery && (
        <>
          <ItemDivider/>
          <ItemLabel hint="Entities related to this entity">Related Entities</ItemLabel>
          <ItemValue>
            <Skeleton loading={ isLoading || isLoadingEntitiesCount }>
              <Link href={ `/entity?${ annotationsQuery }` }>
                <Text fontWeight="normal" fontSize="xs">{ entitiesCountQuery?.count } other entities match these annotations</Text>
              </Link>
            </Skeleton>
          </ItemValue>
        </>
      ) }
    </Container>
  );
};

export default EntityData;
