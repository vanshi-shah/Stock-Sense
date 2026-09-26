/**
 * Quick CRUD smoke test script.
 * Run: node src/scripts/crud-test.js
 */
require('dotenv/config');
if (typeof globalThis.WebSocket === 'undefined') globalThis.WebSocket = require('ws');

const { createClient } = require('@supabase/supabase-js');
const http = require('http');

const BASE = `http://localhost:${process.env.PORT || 5000}`;

// ─── Simple fetch wrapper ────────────────────────────────────────────────────
function req(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: process.env.PORT || 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    };
    const r = http.request(options, (res) => {
      let raw = '';
      res.on('data', (c) => (raw += c));
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    r.on('error', reject);
    if (data) r.write(data);
    r.end();
  });
}

async function main() {
  const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // 1. Create a confirmed test user
  const email = 'crud-test@stocksense.dev';
  const password = 'StockSense@123';
  const { error: createErr } = await admin.auth.admin.createUser({
    email, password, email_confirm: true,
  });
  if (createErr && !createErr.message.includes('already')) {
    console.error('Cannot create user:', createErr.message);
    process.exit(1);
  }
  console.log('✅ Test user ready:', email);

  // 2. Login via backend
  const loginRes = await req('POST', '/api/auth/login', { email, password });
  if (!loginRes.body.success) {
    console.error('Login failed:', loginRes.body);
    process.exit(1);
  }
  const token = loginRes.body.token;
  console.log('✅ Login: token obtained');

  // 3. Create warehouse
  let r = await req('POST', '/api/warehouses', { name: 'Test Warehouse', location: 'Hyderabad' }, token);
  console.log(`Warehouse CREATE → ${r.status}:`, r.body.success ? r.body.data.name : r.body.error);
  const warehouseId = r.body.data?.id;

  // 4. Create location
  r = await req('POST', '/api/locations', { warehouse_id: warehouseId, name: 'Rack A1', type: 'rack' }, token);
  console.log(`Location CREATE → ${r.status}:`, r.body.success ? r.body.data.name : r.body.error);
  const locationId = r.body.data?.id;

  // 5. Create category
  r = await req('POST', '/api/categories', { name: 'Electronics', description: 'Electronic goods' }, token);
  console.log(`Category CREATE → ${r.status}:`, r.body.success ? r.body.data.name : r.body.error);
  const categoryId = r.body.data?.id;

  // 6. Create supplier
  r = await req('POST', '/api/suppliers', { name: 'TechSupplier Co', contact_info: 'info@tech.com' }, token);
  console.log(`Supplier CREATE → ${r.status}:`, r.body.success ? r.body.data.name : r.body.error);

  // 7. Create product
  r = await req('POST', '/api/products', {
    sku: `TEST-${Date.now()}`, name: 'Test Laptop',
    category_id: categoryId, unit_of_measure: 'pcs', reorder_rule: 5,
  }, token);
  console.log(`Product CREATE → ${r.status}:`, r.body.success ? `${r.body.data.sku}` : r.body.error);
  const productId = r.body.data?.id;

  // 8. Create receipt operation (draft)
  r = await req('POST', '/api/operations', {
    type: 'receipt', reference_document: 'PO-TEST-001',
    lines: [{ product_id: productId, to_location_id: locationId, quantity: 100 }],
  }, token);
  console.log(`Operation CREATE → ${r.status}:`, r.body.success ? `status=${r.body.data.status}` : r.body.error);
  const operationId = r.body.data?.id;

  // 9. Validate the receipt
  r = await req('POST', `/api/operations/${operationId}/validate`, {
    lines: [{ product_id: productId, to_location_id: locationId, quantity: 100 }],
  }, token);
  console.log(`Operation VALIDATE → ${r.status}:`, r.body.success ? r.body.message : r.body.error);

  // 10. Read stock quantities
  r = await req('GET', `/api/stock-quantities?product_id=${productId}`, null, token);
  console.log(`Stock Quantities → ${r.status}: data=`, JSON.stringify(r.body.data));

  // 11. Read stock moves ledger
  r = await req('GET', `/api/stock-moves?product_id=${productId}`, null, token);
  console.log(`Stock Moves Ledger → ${r.status}: total=${r.body.total}`);

  // 12. Dashboard KPIs
  r = await req('GET', '/api/dashboard/kpis', null, token);
  const d = r.body.data;
  console.log(`Dashboard KPIs → ${r.status}: products=${d?.total_products} low_stock=${d?.low_stock} pending_receipts=${d?.pending_receipts}`);

  // 13. Test Zod validation error
  r = await req('POST', '/api/products', { sku: '' }, token);
  console.log(`Zod Validation → ${r.status}: error="${r.body.error}"`);

  console.log('\n✅ All tests complete!');
}

main().catch(console.error);
