import { pickBy } from 'es-toolkit';

import type { FullEntity } from '@golembase/l3-indexer-types';
import { EntityStatus } from '@golembase/l3-indexer-types';

import useApiQuery from 'lib/api/useApiQuery';

const useEntityRelatedCountQuery = (enabled: boolean, entity: FullEntity | undefined) => {
  const queryParams = {
    string_annotation_key: entity?.string_annotations.map((annotation) => annotation.key),
    string_annotation_value: entity?.string_annotations.map((annotation) => annotation.value),
    numeric_annotation_key: entity?.numeric_annotations.map((annotation) => annotation.key),
    numeric_annotation_value: entity?.numeric_annotations.map((annotation) => annotation.value),
    status: EntityStatus.ACTIVE,
  };

  const enabledQueryParams = pickBy(queryParams, (value) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== undefined;
  });

  return useApiQuery('golemBaseIndexer:entitiesCount', {
    queryOptions: { enabled },
    queryParams: enabledQueryParams,
  });

};

export default useEntityRelatedCountQuery;
