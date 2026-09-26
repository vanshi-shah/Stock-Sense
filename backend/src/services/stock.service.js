const { supabaseAdmin } = require('../lib/supabaseAdmin');

/**
 * Checks that sufficient stock exists at a source location before moving.
 * Throws an object with { statusCode, message } on failure.
 *
 * @param {string} productId
 * @param {string} locationId
 * @param {number} requiredQty
 */
async function assertSufficientStock(productId, locationId, requiredQty) {
  const { data, error } = await supabaseAdmin
    .from('stock_quantities')
    .select('quantity')
    .eq('product_id', productId)
    .eq('location_id', locationId)
    .maybeSingle();

  if (error) {
    const err = new Error(error.message);
    err.statusCode = 500;
    throw err;
  }

  const available = data?.quantity ?? 0;
  if (available < requiredQty) {
    const err = new Error(
      `Insufficient stock for product ${productId} at location ${locationId}. Available: ${available}, Required: ${requiredQty}`
    );
    err.statusCode = 422;
    throw err;
  }
}

/**
 * Validates an operation by inserting stock_move rows.
 * The DB trigger `after_stock_move_insert` automatically updates stock_quantities.
 *
 * @param {string} operationId - UUID of the operation
 * @param {string} operationType - 'receipt' | 'delivery' | 'transfer' | 'adjustment'
 * @param {Array} lines - array of { product_id, from_location_id, to_location_id, quantity }
 */
async function validateOperation(operationId, operationType, lines) {
  // 1. Pre-flight stock check for delivery and transfer (they deduct stock)
  if (operationType === 'delivery' || operationType === 'transfer') {
    for (const line of lines) {
      if (!line.from_location_id) {
        const err = new Error(`from_location_id is required for ${operationType}`);
        err.statusCode = 400;
        throw err;
      }
      await assertSufficientStock(line.product_id, line.from_location_id, line.quantity);
    }
  }

  // 2. Validate receipts require a to_location_id
  if (operationType === 'receipt') {
    for (const line of lines) {
      if (!line.to_location_id) {
        const err = new Error('to_location_id is required for receipt operations');
        err.statusCode = 400;
        throw err;
      }
    }
  }

  // 3. Build move rows
  const moves = lines.map((line) => ({
    operation_id: operationId,
    product_id: line.product_id,
    from_location_id: line.from_location_id ?? null,
    to_location_id: line.to_location_id ?? null,
    quantity: line.quantity,
  }));

  // 4. Insert moves
  const { error: moveError } = await supabaseAdmin.from('stock_moves').insert(moves);

  if (moveError) {
    const err = new Error(moveError.message);
    err.statusCode = 500;
    throw err;
  }

  // 5. Update stock_quantities for each line
  await updateStockQuantitiesForLines(lines);

  // 6. Mark operation as done
  const { error: opError } = await supabaseAdmin
    .from('operations')
    .update({ status: 'done' })
    .eq('id', operationId);

  if (opError) {
    const err = new Error(opError.message);
    err.statusCode = 500;
    throw err;
  }
}

/**
 * Cancels an operation by setting its status to 'canceled'.
 * Operations that are already 'done' cannot be canceled.
 */
async function cancelOperation(operationId, currentStatus) {
  if (currentStatus === 'done') {
    const err = new Error('Cannot cancel a completed operation');
    err.statusCode = 409;
    throw err;
  }
  if (currentStatus === 'canceled') {
    const err = new Error('Operation is already canceled');
    err.statusCode = 409;
    throw err;
  }

  const { error } = await supabaseAdmin
    .from('operations')
    .update({ status: 'canceled' })
    .eq('id', operationId);

  if (error) {
    const err = new Error(error.message);
    err.statusCode = 500;
    throw err;
  }
}

async function updateStockQuantitiesForLines(lines) {
  for (const line of lines) {
    if (line.from_location_id) {
      const { data: existing } = await supabaseAdmin
        .from('stock_quantities')
        .select('id, quantity')
        .eq('product_id', line.product_id)
        .eq('location_id', line.from_location_id)
        .maybeSingle();

      const newQty = (existing?.quantity || 0) - line.quantity;
      if (existing) {
        await supabaseAdmin
          .from('stock_quantities')
          .update({ quantity: Math.max(0, newQty) })
          .eq('id', existing.id);
      }
    }

    if (line.to_location_id) {
      const { data: existing } = await supabaseAdmin
        .from('stock_quantities')
        .select('id, quantity')
        .eq('product_id', line.product_id)
        .eq('location_id', line.to_location_id)
        .maybeSingle();

      if (existing) {
        await supabaseAdmin
          .from('stock_quantities')
          .update({ quantity: Number(existing.quantity) + Number(line.quantity) })
          .eq('id', existing.id);
      } else {
        await supabaseAdmin
          .from('stock_quantities')
          .insert({
            product_id: line.product_id,
            location_id: line.to_location_id,
            quantity: line.quantity,
          });
      }
    }
  }
}

module.exports = { validateOperation, cancelOperation, assertSufficientStock, updateStockQuantitiesForLines };
