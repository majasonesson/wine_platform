// test-db.ts
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load variables from your .env.local file
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Changed from ANON_KEY
);

async function testConnection() {
  console.log("Checking connection to:", process.env.NEXT_PUBLIC_SUPABASE_URL);

  // Try to fetch just one row from your USERS table
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .limit(1);

  if (error) {
    console.error("❌ Connection failed:", error.message);
  } else {
    console.log("✅ Success! Database is reachable.");
    console.log("Data sample:", data);
  }
}

testConnection();