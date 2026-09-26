const { z } = require('zod');

const operationTypeEnum = z.enum(['receipt', 'delivery', 'transfer', 'adjustment']);
const operationStatusEnum = z.enum(['draft', 'waiting', 'ready', 'done', 'canceled']);

const stockMoveLineSchema = z.object({
  product_id: z.string().uuid('Invalid product ID'),
  from_location_id: z.string().uuid('Invalid from_location_id').optional().nullable(),
  to_location_id: z.string().uuid('Invalid to_location_id').optional().nullable(),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
});

const createOperationSchema = z.object({
  type: operationTypeEnum,
  reference_document: z.string().optional(),
  lines: z.array(stockMoveLineSchema).min(1, 'At least one stock move line is required'),
});

const updateOperationSchema = z.object({
  reference_document: z.string().optional(),
  lines: z.array(stockMoveLineSchema).min(1).optional(),
});

module.exports = {
  createOperationSchema,
  updateOperationSchema,
  stockMoveLineSchema,
};
