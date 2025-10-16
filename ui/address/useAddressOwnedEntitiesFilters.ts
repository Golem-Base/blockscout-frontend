import { pickBy } from 'es-toolkit';
import { useRouter } from 'next/router';
import React from 'react';
import { safeParse } from 'valibot';

import { EntityStatusFilter_EntityStatusFilter as EntityStatusFilter } from '@golembase/l3-indexer-types';

import type { FilterState, SetError, SetInputValue } from './addressOwnedFilterReducer';
import { filterReducer, initialState } from './addressOwnedFilterReducer';
import { addressOwnedFilterSchema } from './addressOwnedFilterSchema';

export const useAddressOwnedEntitiesFilters = () => {
  const router = useRouter();
  const [ state, dispatch ] = React.useReducer(filterReducer, initialState);

  React.useEffect(() => {
    const defaultFilterStatus = router.query.status ? String(router.query.status).toUpperCase() : EntityStatusFilter.ALL;

    dispatch({
      type: 'INITIALIZE',
      payload: {
        defaultStatus: defaultFilterStatus,
        query: router.query as Record<string, string>,
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setStatus = React.useCallback((status: string) => {
    dispatch({ type: 'SET_STATUS', payload: status });
  }, []);

  const setInputValue: SetInputValue = React.useCallback((key, value) => {
    dispatch({ type: 'SET_ERROR', payload: { key, value: false } });
    dispatch({ type: 'SET_INPUT_VALUE', payload: { key, value } });
  }, []);

  const clearErrors = React.useCallback(() => {
    dispatch({ type: 'CLEAR_ERRORS' });
  }, []);

  const setError: SetError = React.useCallback((key, value) => {
    dispatch({ type: 'SET_ERROR', payload: { key, value } });
  }, []);

  const applyFilters = React.useCallback((state: FilterState) => {
    clearErrors();

    const params = new URLSearchParams(router.query as Record<string, string>);
    const isAllSelected = state.selectedStatus?.toLowerCase() === 'all';

    if (isAllSelected) params.delete('status');
    if (!isAllSelected && state.selectedStatus) params.set('status', state.selectedStatus);

    const { success, issues } = safeParse(addressOwnedFilterSchema, state.inputValues);

    if (!success) {
      issues.forEach(({ path }) => {
        const key = path?.[0].key as keyof FilterState['inputValues'];

        setError(key, true);
      });

      return;
    }

    const query = {
      pathname: router.pathname,
      query: {
        ...pickBy({
          ...Object.fromEntries(params.entries()),
          ...state.inputValues,
        }, Boolean),
      },
    };

    router.replace(query, undefined, { shallow: true });
  }, [ router, clearErrors, setError ]);

  return {
    state,
    setStatus,
    setInputValue,
    applyFilters,
  };
};
