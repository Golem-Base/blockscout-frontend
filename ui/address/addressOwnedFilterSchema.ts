import * as v from 'valibot';

export const addressOwnedFilterSchema = v.pipe(
  v.object({
    numeric_annotation_key: v.string(),
    numeric_annotation_value: v.string(),
    string_annotation_key: v.string(),
    string_annotation_value: v.string(),
  }),
  v.forward(
    v.check((input) => !(Boolean(input.numeric_annotation_key.length) && !input.numeric_annotation_value.length)),
    [ 'numeric_annotation_value' ],
  ),
  v.forward(
    v.check((input) => !(Boolean(input.numeric_annotation_value.length) && !input.numeric_annotation_key.length)),
    [ 'numeric_annotation_key' ],
  ),
  v.forward(
    v.check((input) => !(Boolean(input.string_annotation_key.length) && !input.string_annotation_value.length)),
    [ 'string_annotation_value' ],
  ),
  v.forward(
    v.check((input) => !(Boolean(input.string_annotation_value.length) && !input.string_annotation_key.length)),
    [ 'string_annotation_key' ],
  ),
);
