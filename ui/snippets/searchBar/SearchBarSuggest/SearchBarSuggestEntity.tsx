import React from 'react';

import type { ItemsProps } from './types';
import type { SearchResultGolembaseEntity } from 'types/api/search';

import StorageEntity from 'ui/shared/entities/entity/StorageEntity';

const SearchBarSuggestEntity = ({ data }: ItemsProps<SearchResultGolembaseEntity>) => {
  return (
    <StorageEntity entityKey={ data.golembase_entity } noLink/>
  );
};

export default React.memo(SearchBarSuggestEntity);
