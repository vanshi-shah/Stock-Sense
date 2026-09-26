const { z } = require('zod');

const createProductSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  name: z.string().min(1, 'Name is required'),
  category_id: z.string().uuid('Invalid category ID').optional().nullable(),
  unit_of_measure: z.string().default('pcs'),
  reorder_rule: z
    .union([z.string(), z.number()])
    .optional()
    .nullable()
    .transform((val) => (val !== undefined && val !== null ? String(val) : null)),
});

const updateProductSchema = createProductSchema.partial();

module.exports = { createProductSchema, updateProductSchema };

