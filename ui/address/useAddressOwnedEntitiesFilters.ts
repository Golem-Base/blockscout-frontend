import { useRouter } from 'next/router';
import React from 'react';

type FilterState = {
  selectedStatus: string;
  inputValues: {
    numeric_annotation_key: string;
    numeric_annotation_value: string;
    string_annotation_key: string;
    string_annotation_value: string;
  };
};

type FilterAction =
  | { type: 'SET_STATUS'; payload: string }
  | { type: 'SET_INPUT_VALUE'; payload: { key: keyof FilterState['inputValues']; value: string } }
  | { type: 'INITIALIZE'; payload: { defaultStatus: string; query: Record<string, string> } };

const initialState: FilterState = {
  selectedStatus: '',
  inputValues: {
    numeric_annotation_key: '',
    numeric_annotation_value: '',
    string_annotation_key: '',
    string_annotation_value: '',
  },
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_STATUS':
      return {
        ...state,
        selectedStatus: action.payload,
      };
    case 'SET_INPUT_VALUE':
      return {
        ...state,
        inputValues: {
          ...state.inputValues,
          [action.payload.key]: action.payload.value,
        },
      };
    case 'INITIALIZE':
      return {
        selectedStatus: action.payload.defaultStatus,
        inputValues: {
          numeric_annotation_key: action.payload.query.numeric_annotation_key || '',
          numeric_annotation_value: action.payload.query.numeric_annotation_value || '',
          string_annotation_key: action.payload.query.string_annotation_key || '',
          string_annotation_value: action.payload.query.string_annotation_value || '',
        },
      };
    default:
      return state;
  }
}

export const useAddressOwnedEntitiesFilters = (defaultFilterStatus: string) => {
  const router = useRouter();
  const [ state, dispatch ] = React.useReducer(filterReducer, initialState);

  React.useEffect(() => {
    dispatch({
      type: 'INITIALIZE',
      payload: {
        defaultStatus: defaultFilterStatus,
        query: router.query as Record<string, string>,
      },
    });
  }, [ defaultFilterStatus, router.query ]);

  const setStatus = React.useCallback((status: string) => {
    dispatch({ type: 'SET_STATUS', payload: status });
  }, []);

  const setInputValue = React.useCallback((key: keyof FilterState['inputValues'], value: string) => {
    dispatch({ type: 'SET_INPUT_VALUE', payload: { key, value } });
  }, []);

  const applyFilters = React.useCallback(() => {
    const params = new URLSearchParams(router.query as Record<string, string>);
    const isAllSelected = state.selectedStatus?.toLowerCase() === 'all';

    if (isAllSelected) params.delete('status');
    if (!isAllSelected && state.selectedStatus) params.set('status', state.selectedStatus);

    Object.entries(state.inputValues).forEach(([ key, value ]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    const query = {
      pathname: router.pathname,
      query: Object.fromEntries(params.entries()),
    };

    router.replace(query, undefined, { shallow: true });
  }, [ state, router ]);

  return {
    state,
    setStatus,
    setInputValue,
    applyFilters,
  };
};
