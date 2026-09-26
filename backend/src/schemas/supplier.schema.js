const { z } = require('zod');

const createSupplierSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contact_info: z.string().optional(),
});

const updateSupplierSchema = createSupplierSchema.partial();

module.exports = { createSupplierSchema, updateSupplierSchema };
