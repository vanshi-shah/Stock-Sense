const { z } = require('zod');

const createWarehouseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  location: z.string().min(1, 'Location is required'),
});

const updateWarehouseSchema = createWarehouseSchema.partial();

const createLocationSchema = z.object({
  warehouse_id: z.string().uuid('Invalid warehouse ID'),
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['rack', 'shelf', 'zone', 'loading_dock', 'storage']),
});

const updateLocationSchema = createLocationSchema.partial();

module.exports = {
  createWarehouseSchema,
  updateWarehouseSchema,
  createLocationSchema,
  updateLocationSchema,
};
