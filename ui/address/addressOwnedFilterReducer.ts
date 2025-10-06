export type FilterState = {
  selectedStatus: string;
  inputValues: {
    numeric_annotation_key: string;
    numeric_annotation_value: string;
    string_annotation_key: string;
    string_annotation_value: string;
  };
  errors: {
    numeric_annotation_key?: boolean;
    numeric_annotation_value?: boolean;
    string_annotation_key?: boolean;
    string_annotation_value?: boolean;
  };
};

  type FilterAction =
    | { type: 'SET_STATUS'; payload: string }
    | { type: 'SET_INPUT_VALUE'; payload: { key: keyof FilterState['inputValues']; value: string } }
    | { type: 'SET_ERROR'; payload: { key: keyof FilterState['errors']; value: boolean } }
    | { type: 'CLEAR_ERRORS' }
    | { type: 'INITIALIZE'; payload: { defaultStatus: string; query: Record<string, string> } };

export type SetInputValue = (key: keyof FilterState['inputValues'], value: string) => void;
export type SetError = (key: keyof FilterState['errors'], value: boolean) => void;

export const initialState: FilterState = {
  selectedStatus: '',
  inputValues: {
    numeric_annotation_key: '',
    numeric_annotation_value: '',
    string_annotation_key: '',
    string_annotation_value: '',
  },
  errors: {},
};

export function filterReducer(state: FilterState, action: FilterAction): FilterState {
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
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.payload.key]: action.payload.value },
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: {},
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
        errors: {},
      };
    default:
      return state;
  }
}
