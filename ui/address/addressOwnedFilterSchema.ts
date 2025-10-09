import * as v from 'valibot';

// export const annotationSchema = v.pipe(
//   v.object({
//     numeric_annotation_key: v.optional(v.string()),
//     numeric_annotation_value: v.optional(v.string()),
//     string_annotation_key: v.optional(v.string()),
//     string_annotation_value: v.optional(v.string()),
//   }),
//   v.custom(
//     (data) => {
//       if (data.numeric_annotation_value && !data.numeric_annotation_key) {
//         ctx.addIssue({
//           path: [ 'numeric_annotation_key' ],
//           message: 'numeric_annotation_key is required when numeric_annotation_value is filled',
//         });
//       }

//       if (data.numeric_annotation_key && !data.numeric_annotation_value) {
//         ctx.addIssue({
//           path: [ 'numeric_annotation_value' ],
//           message: 'numeric_annotation_value is required when numeric_annotation_key is filled',
//         });
//       }

//       if (data.string_annotation_value && !data.string_annotation_key) {
//         ctx.addIssue({
//           path: [ 'string_annotation_key' ],
//           message: 'string_annotation_key is required when string_annotation_value is filled',
//         });
//       }

//       if (data.string_annotation_key && !data.string_annotation_value) {
//         ctx.addIssue({
//           path: [ 'string_annotation_value' ],
//           message: 'string_annotation_value is required when string_annotation_key is filled',
//         });
//       }

//       return true;
//     },
//   ),
// );

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
