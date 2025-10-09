import * as v from 'valibot';

export const addressOwnedFilterSchema = v.pipe(
  v.object({
    numeric_annotation_key: v.string(),
    numeric_annotation_value: v.string(),
    string_annotation_key: v.string(),
    string_annotation_value: v.string(),
  }),
  v.forward(
    v.check((input) => !(input.numeric_annotation_key && !input.numeric_annotation_value)),
    [ 'numeric_annotation_value' ],
  ),
  v.forward(
    v.check((input) => !(input.numeric_annotation_value && !input.numeric_annotation_key)),
    [ 'numeric_annotation_key' ],
  ),
  v.forward(
    v.check((input) => !(input.string_annotation_key && !input.string_annotation_value)),
    [ 'string_annotation_value' ],
  ),
  v.forward(
    v.check((input) => !(input.string_annotation_value && !input.string_annotation_key)),
    [ 'string_annotation_key' ],
  ),
);
