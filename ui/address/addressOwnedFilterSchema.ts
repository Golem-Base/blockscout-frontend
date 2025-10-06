import { z } from 'zod';

export const addressOwnedFilterSchema = z
  .object({
    numeric_annotation_key: z.string().optional(),
    numeric_annotation_value: z.string().optional(),
    string_annotation_key: z.string().optional(),
    string_annotation_value: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.numeric_annotation_value && !data.numeric_annotation_key) {
      ctx.addIssue({
        code: 'custom',
        message: 'numeric_annotation_key is required when numeric_annotation_value is provided',
        path: [ 'numeric_annotation_key' ],
      });
    }
    if (data.numeric_annotation_key && !data.numeric_annotation_value) {
      ctx.addIssue({
        code: 'custom',
        message: 'numeric_annotation_value is required when numeric_annotation_key is provided',
        path: [ 'numeric_annotation_value' ],
      });
    }

    if (data.string_annotation_value && !data.string_annotation_key) {
      ctx.addIssue({
        code: 'custom',
        message: 'string_annotation_key is required when string_annotation_value is provided',
        path: [ 'string_annotation_key' ],
      });
    }
    if (data.string_annotation_key && !data.string_annotation_value) {
      ctx.addIssue({
        code: 'custom',
        message: 'string_annotation_value is required when string_annotation_key is provided',
        path: [ 'string_annotation_value' ],
      });
    }
  });
