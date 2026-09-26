require('dotenv').config();

// Polyfill WebSocket for Node.js < 21 (required by @supabase/realtime-js)
if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = require('ws');
}

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
